import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { MealDataService } from "./MealDataService";

const NOTIFICATION_TASK = "MEAL_REMINDER_TASK";
const NOTIFICATION_SETTINGS_KEY = "@notification_settings";

// Configure notification behavior
Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
   }),
});

interface NotificationSettings {
   enabled: boolean;
   reminderTimes: {
      beforeMidnight: string[];
      afterMidnight: string[];
   };
   selectedBeforeMidnight: string;
   selectedAfterMidnight: string;
}

export class NotificationService {
   static async requestPermissions(): Promise<boolean> {
      try {
         const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
         let finalStatus = existingStatus;

         if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
         }

         return finalStatus === "granted";
      } catch (error) {
         console.error("Error requesting notification permissions:", error);
         return false;
      }
   }

   static async getNotificationSettings(): Promise<NotificationSettings | null> {
      try {
         const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
         return settings ? JSON.parse(settings) : null;
      } catch (error) {
         console.error("Error getting notification settings:", error);
         return null;
      }
   }

   static async scheduleNotifications() {
      try {
         // Cancel all existing notifications
         await Notifications.cancelAllScheduledNotificationsAsync();

         const settings = await this.getNotificationSettings();
         if (!settings || !settings.enabled) {
            return;
         }

         const hasPermission = await this.requestPermissions();
         if (!hasPermission) {
            console.log("Notification permission not granted");
            return;
         }

         // Schedule before midnight notification
         await this.scheduleReminderNotification(
            settings.selectedBeforeMidnight,
            "before-midnight",
            "Don't forget to log today's meals!",
            "Remember to track your day, night, and extra meals before midnight."
         );

         // Schedule after midnight notification
         await this.scheduleReminderNotification(
            settings.selectedAfterMidnight,
            "after-midnight",
            "Missing meal data from yesterday",
            "You haven't logged your meal data from yesterday. Please update it now."
         );

         console.log("Notifications scheduled successfully");
      } catch (error) {
         console.error("Error scheduling notifications:", error);
      }
   }

   private static async scheduleReminderNotification(
      time: string,
      identifier: string,
      title: string,
      body: string
   ) {
      const [hours, minutes] = time.split(":").map(Number);

      // Create a date for today at the specified time
      const triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (triggerDate.getTime() <= Date.now()) {
         triggerDate.setDate(triggerDate.getDate() + 1);
      }

      await Notifications.scheduleNotificationAsync({
         content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
         },
         trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
         },
         identifier: identifier,
      });
   }

   static async checkAndSendNotification() {
      try {
         const settings = await this.getNotificationSettings();
         if (!settings || !settings.enabled) {
            return;
         }

         const hasPermission = await this.requestPermissions();
         if (!hasPermission) {
            return;
         }

         // Check if yesterday's data is missing
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         const yesterdayKey = yesterday.toISOString().split("T")[0];

         const mealData = await MealDataService.loadMealData(yesterdayKey);

         // If no data exists for yesterday, or all fields are empty/zero
         const shouldNotify =
            !mealData ||
            (mealData.day === 0 &&
               mealData.night === 0 &&
               mealData.extra === 0);

         if (shouldNotify) {
            await Notifications.presentNotificationAsync({
               title: "Missing Meal Data",
               body: `You haven't logged your meal data for ${yesterdayKey}. Please update it now.`,
               sound: true,
               priority: Notifications.AndroidNotificationPriority.HIGH,
            });
         }
      } catch (error) {
         console.error("Error checking and sending notification:", error);
      }
   }

   static async cancelAllNotifications() {
      try {
         await Notifications.cancelAllScheduledNotificationsAsync();
         console.log("All notifications cancelled");
      } catch (error) {
         console.error("Error cancelling notifications:", error);
      }
   }

   static async handleNotificationResponse(
      response: Notifications.NotificationResponse
   ) {
      try {
         // Handle notification tap - could navigate to specific screen
         // This would be implemented based on your navigation structure
         console.log("Notification tapped:", response);
      } catch (error) {
         console.error("Error handling notification response:", error);
      }
   }

   // Check if today's data has been filled to cancel today's notifications
   static async checkTodayDataAndCancelIfNeeded() {
      try {
         const today = new Date().toISOString().split("T")[0];
         const mealData = await MealDataService.loadMealData(today);

         // If today has any data filled, we can assume user is active
         if (
            mealData &&
            (mealData.day > 0 || mealData.night > 0 || mealData.extra > 0)
         ) {
            // Cancel notifications for today only if user has logged data
            const scheduledNotifications =
               await Notifications.getAllScheduledNotificationsAsync();

            for (const notification of scheduledNotifications) {
               const triggerDate = new Date(notification.trigger as any);
               const today = new Date();

               if (triggerDate.toDateString() === today.toDateString()) {
                  await Notifications.cancelScheduledNotificationAsync(
                     notification.identifier
                  );
               }
            }
         }
      } catch (error) {
         console.error("Error checking today's data:", error);
      }
   }
}

// Background task for periodic checks (if needed)
TaskManager.defineTask(NOTIFICATION_TASK, async () => {
   try {
      await NotificationService.checkAndSendNotification();
      return { success: true };
   } catch (error) {
      console.error("Background notification task failed:", error);
      return { success: false };
   }
});

export default NotificationService;

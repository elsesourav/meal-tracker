import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { MealDataService } from "./MealDataService";

const NOTIFICATION_TASK = "MEAL_REMINDER_TASK";
const BACKGROUND_FETCH_TASK = "BACKGROUND_MEAL_CHECK";
const NOTIFICATION_SETTINGS_KEY = "@notification_settings";

// Configure notification behavior for when app is in foreground
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

// Define background tasks at module level
TaskManager.defineTask(
   NOTIFICATION_TASK,
   async ({ data, error, executionInfo }) => {
      try {
         console.log("Background notification task executing...");
         if (error) {
            console.error("Notification task error:", error);
            return;
         }

         // Handle background notification
         await NotificationService.checkAndSendNotification();
         return { success: true };
      } catch (error) {
         console.error("Background notification task failed:", error);
         return { success: false };
      }
   }
);

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
   try {
      console.log("Background fetch task executing...");
      await NotificationService.checkAndSendNotification();
      return BackgroundFetch.BackgroundFetchResult.NewData;
   } catch (error) {
      console.error("Background fetch task failed:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
   }
});

export class NotificationService {
   static async initialize(): Promise<void> {
      try {
         // Request permissions first
         const hasPermission = await this.requestPermissions();
         if (!hasPermission) {
            console.log("Notification permissions not granted");
            return;
         }

         // Set up notification channels for Android
         if (Platform.OS === "android") {
            await this.setupAndroidChannels();
         }

         // Register background tasks
         await this.registerBackgroundTasks();

         // Schedule initial notifications
         await this.scheduleNotifications();

         console.log("NotificationService initialized successfully");
      } catch (error) {
         console.error("Failed to initialize NotificationService:", error);
      }
   }

   static async setupAndroidChannels(): Promise<void> {
      try {
         await Notifications.setNotificationChannelAsync("meal-reminders", {
            name: "Meal Reminders",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#2563EB",
            sound: "default",
         });

         await Notifications.setNotificationChannelAsync("meal-alerts", {
            name: "Meal Alerts",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 250, 500],
            lightColor: "#DC2626",
            sound: "default",
         });
      } catch (error) {
         console.error("Failed to setup Android channels:", error);
      }
   }

   static async registerBackgroundTasks(): Promise<void> {
      try {
         // Register background fetch task
         const isBackgroundFetchAvailable =
            await BackgroundFetch.getStatusAsync();
         if (
            isBackgroundFetchAvailable ===
            BackgroundFetch.BackgroundFetchStatus.Available
         ) {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
               minimumInterval: 15 * 60 * 1000, // 15 minutes minimum
               stopOnTerminate: false,
               startOnBoot: true,
            });
            console.log("Background fetch registered");
         }

         // Register notification task
         if (await TaskManager.isTaskRegisteredAsync(NOTIFICATION_TASK)) {
            await TaskManager.unregisterTaskAsync(NOTIFICATION_TASK);
         }
         await Notifications.registerTaskAsync(NOTIFICATION_TASK);
         console.log("Notification task registered");
      } catch (error) {
         console.error("Failed to register background tasks:", error);
      }
   }

   static async requestPermissions(): Promise<boolean> {
      try {
         if (!Device.isDevice) {
            console.log("Must use physical device for Push Notifications");
            return false;
         }

         const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
         let finalStatus = existingStatus;

         if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync({
               ios: {
                  allowAlert: true,
                  allowBadge: true,
                  allowSound: true,
               },
            });
            finalStatus = status;
         }

         if (finalStatus !== "granted") {
            console.log("Notification permission denied");
            return false;
         }

         return true;
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

         const today = new Date();
         const yesterday = new Date(today);
         yesterday.setDate(today.getDate() - 1);

         const year = yesterday.getFullYear();
         const month = yesterday.getMonth() + 1;
         const day = yesterday.getDate();

         const yesterdayKey = `${day}/${month}/${year}`;
         const mealData = await MealDataService.loadMealData(yesterdayKey);

         // Don't notify if:
         // 1. No data exists AND neither day nor night are explicitly set to "OFF"
         // 2. Day or night meals are explicitly turned "OFF" (value -1)
         // 3. All fields have positive values (user has logged data)
         const hasData =
         mealData &&
         (mealData.day > 0 || mealData.night > 0 || mealData.extra > 0);

         // Don't send notification if day or night meals are explicitly set to "OFF"
         const dayIsOff = mealData && mealData.day === -1;
         const nightIsOff = mealData && mealData.night === -1;

         console.log("Yesterday's meal data:", mealData);
         console.log("Has data:", hasData);
         console.log("Day is OFF:", dayIsOff);
         console.log("Night is OFF:", nightIsOff);

         if (hasData && !dayIsOff && !nightIsOff) {
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

         const date = new Date();
         const year = date.getFullYear();
         const month = date.getMonth() + 1;
         const day = date.getDate();
         const today = `${day}/${month}/${year}`;

         const mealData = await MealDataService.loadMealData(today);

         // Cancel notifications if:
         // 1. Today has any positive data filled (user is active)
         // 2. Day or night meals are explicitly set to "OFF"
         const hasData =
            mealData &&
            (mealData.day > 0 || mealData.night > 0 || mealData.extra > 0);
         const dayIsOff = mealData && mealData.day === -1;
         const nightIsOff = mealData && mealData.night === -1;

         if (hasData || dayIsOff || nightIsOff) {
            // Cancel notifications for today only if user has logged data or set meals to "OFF"
            const scheduledNotifications =
               await Notifications.getAllScheduledNotificationsAsync();

            for (const notification of scheduledNotifications) {
               const triggerDate = new Date(notification.trigger as any);
               const todayDate = new Date();

               if (triggerDate.toDateString() === todayDate.toDateString()) {
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

export default NotificationService;

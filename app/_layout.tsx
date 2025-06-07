import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { ThemeProvider } from "../contexts/ThemeContext";
import { NotificationService } from "../services/NotificationService";
import "./global.css";

export default function RootLayout() {
   useEffect(() => {
      // Initialize notifications when app starts
      const initializeNotifications = async () => {
         await NotificationService.requestPermissions();
         await NotificationService.scheduleNotifications();
      };

      initializeNotifications();

      // Handle app state changes
      const handleAppStateChange = (nextAppState: string) => {
         if (nextAppState === "active") {
            // App came to foreground - check if today's data is filled
            NotificationService.checkTodayDataAndCancelIfNeeded();
         }
      };

      // Listen for app state changes
      const subscription = AppState.addEventListener(
         "change",
         handleAppStateChange
      );

      // Handle notification responses when user taps notification
      const notificationResponseListener =
         Notifications.addNotificationResponseReceivedListener(
            NotificationService.handleNotificationResponse
         );

      return () => {
         subscription?.remove();
         notificationResponseListener.remove();
      };
   }, []);

   return (
      <ThemeProvider>
         <Stack
            screenOptions={{
               headerShown: false,
            }}
         >
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
         </Stack>
      </ThemeProvider>
   );
}

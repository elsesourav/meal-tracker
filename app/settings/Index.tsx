import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomAlert from "../../components/CustomAlert";
import NotificationSettingsModal from "../../components/NotificationSettingsModal";
import ThemePopup from "../../components/ThemePopup";
import ThemedView from "../../components/ThemedView";
import {
   ALERT_MESSAGES,
   APP_INFO,
   CONSOLE_MESSAGES,
   SETTINGS_SECTIONS,
} from "../../constants/alertMessages";
import { useMealTracker } from "../../hooks/useMealTracker";
import { MealDataService } from "../../services/MealDataService";
import { NotificationService } from "../../services/NotificationService";

interface AlertState {
   visible: boolean;
   title: string;
   message: string;
   type: "delete" | "info" | "warning";
   onConfirm?: () => void;
}

const Settings = () => {
   const { exportData, importData, clearAllData } = useMealTracker();
   const [notificationModalVisible, setNotificationModalVisible] =
      useState(false);
   const [themePopupVisible, setThemePopupVisible] = useState(false);

   const [alert, setAlert] = useState<AlertState>({
      visible: false,
      title: "",
      message: "",
      type: "info",
   });

   useEffect(() => {
      // Initialize notification service when component mounts
      NotificationService.scheduleNotifications();
   }, []);

   const showAlert = (
      title: string,
      message: string,
      type: "delete" | "info" | "warning" = "info",
      onConfirm?: () => void
   ) => {
      setAlert({
         visible: true,
         title,
         message,
         type,
         onConfirm,
      });
   };

   const hideAlert = () => {
      setAlert((prev) => ({ ...prev, visible: false }));
   };

   const handleExportData = async () => {
      try {
         const success = await exportData();
         if (success) {
            showAlert(
               ALERT_MESSAGES.EXPORT_SUCCESS.title,
               ALERT_MESSAGES.EXPORT_SUCCESS.message,
               ALERT_MESSAGES.EXPORT_SUCCESS.type
            );
         }
      } catch (error) {
         console.error(CONSOLE_MESSAGES.EXPORT_ERROR, error);
         showAlert(
            ALERT_MESSAGES.EXPORT_FAILED.title,
            ALERT_MESSAGES.EXPORT_FAILED.message,
            ALERT_MESSAGES.EXPORT_FAILED.type
         );
      }
   };

   const handleImportData = async () => {
      showAlert(
         ALERT_MESSAGES.IMPORT_CONFIRMATION.title,
         ALERT_MESSAGES.IMPORT_CONFIRMATION.message,
         ALERT_MESSAGES.IMPORT_CONFIRMATION.type,
         async () => {
            try {
               const success = await importData();
               if (success) {
                  showAlert(
                     ALERT_MESSAGES.IMPORT_SUCCESS.title,
                     ALERT_MESSAGES.IMPORT_SUCCESS.message,
                     ALERT_MESSAGES.IMPORT_SUCCESS.type,
                     async () => {
                        try {
                           console.log(CONSOLE_MESSAGES.APP_RELOAD_START);
                           await Updates.reloadAsync();
                        } catch (reloadError) {
                           console.error(
                              CONSOLE_MESSAGES.APP_RELOAD_ERROR,
                              reloadError
                           );
                        }
                     }
                  );
               }
            } catch (error) {
               console.error(CONSOLE_MESSAGES.IMPORT_ERROR, error);
               showAlert(
                  ALERT_MESSAGES.IMPORT_FAILED.title,
                  ALERT_MESSAGES.IMPORT_FAILED.message,
                  ALERT_MESSAGES.IMPORT_FAILED.type
               );
            }
         }
      );
   };

   const handleClearAllData = () => {
      showAlert(
         ALERT_MESSAGES.CLEAR_CONFIRMATION.title,
         ALERT_MESSAGES.CLEAR_CONFIRMATION.message,
         ALERT_MESSAGES.CLEAR_CONFIRMATION.type,
         async () => {
            try {
               console.log(CONSOLE_MESSAGES.CLEAR_DATA_START);
               if (clearAllData) {
                  await clearAllData();
                  console.log(CONSOLE_MESSAGES.CLEAR_DATA_SUCCESS);

                  showAlert(
                     ALERT_MESSAGES.CLEAR_SUCCESS.title,
                     ALERT_MESSAGES.CLEAR_SUCCESS.message,
                     ALERT_MESSAGES.CLEAR_SUCCESS.type
                  );
               } else {
                  // Fallback to service method
                  await MealDataService.clearAllData();
                  showAlert(
                     ALERT_MESSAGES.CLEAR_SUCCESS_FALLBACK.title,
                     ALERT_MESSAGES.CLEAR_SUCCESS_FALLBACK.message,
                     ALERT_MESSAGES.CLEAR_SUCCESS_FALLBACK.type
                  );
               }
            } catch (error) {
               console.error(CONSOLE_MESSAGES.CLEAR_DATA_ERROR, error);
               showAlert(
                  ALERT_MESSAGES.CLEAR_FAILED.title,
                  ALERT_MESSAGES.CLEAR_FAILED.message,
                  ALERT_MESSAGES.CLEAR_FAILED.type
               );
            }
         }
      );
   };

   const handleEmailContact = async () => {
      try {
         const emailUrl = `mailto:${APP_INFO.CONTACT.EMAIL}`;
         await Linking.openURL(emailUrl);
      } catch (error) {
         console.error("Error opening email:", error);
      }
   };

   const handleGitHubContact = async () => {
      try {
         const githubUrl = `https://${APP_INFO.CONTACT.GITHUB}`;
         await Linking.openURL(githubUrl);
      } catch (error) {
         console.error("Error opening GitHub:", error);
      }
   };

   const handleAboutApp = () => {
      showAlert(APP_INFO.ABOUT.TITLE, APP_INFO.ABOUT.DESCRIPTION, "info");
   };

   const handleNotificationSettings = () => {
      setNotificationModalVisible(true);
   };

   const closeNotificationModal = () => {
      setNotificationModalVisible(false);
      // Reschedule notifications after settings change
      NotificationService.scheduleNotifications();
   };

   const SettingsCard = ({
      title,
      subtitle,
      icon,
      onPress,
      iconColor = "#3B82F6",
      showArrow = true,
   }: {
      title: string;
      subtitle?: string;
      icon: any;
      onPress: () => void;
      iconColor?: string;
      showArrow?: boolean;
   }) => (
      <TouchableOpacity
         onPress={onPress}
         className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
         <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mr-3">
               <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <View className="flex-1">
               <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                  {title}
               </Text>
               {subtitle && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                     {subtitle}
                  </Text>
               )}
            </View>
            {showArrow && (
               <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
         </View>
      </TouchableOpacity>
   );

   return (
      <ThemedView className="relative size-full">
         <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 pt-10 px-6">
            {/* Header */}
            <View className="mb-6">
               <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                  Settings
               </Text>
               <Text className="text-base text-gray-500 dark:text-gray-400">
                  {SETTINGS_SECTIONS.DATA_MANAGEMENT.subtitle}
               </Text>
            </View>

            {/* Preferences Section */}
            <View className="mb-6">
               <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Preferences
               </Text>

               <SettingsCard
                  title="Notifications"
                  subtitle="Configure meal reminders and alerts"
                  icon="notifications-outline"
                  onPress={handleNotificationSettings}
                  iconColor="#FF6B35"
               />

               <SettingsCard
                  title="Theme"
                  subtitle="Choose your preferred app appearance"
                  icon="color-palette-outline"
                  onPress={() => setThemePopupVisible(true)}
                  iconColor="#8B5CF6"
               />
            </View>

            {/* Contact Section */}
            <View className="mb-6">
               <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {SETTINGS_SECTIONS.CONTACT.title}
               </Text>

               <SettingsCard
                  title={SETTINGS_SECTIONS.CONTACT.cards.EMAIL.title}
                  subtitle={SETTINGS_SECTIONS.CONTACT.cards.EMAIL.subtitle}
                  icon={SETTINGS_SECTIONS.CONTACT.cards.EMAIL.icon}
                  onPress={handleEmailContact}
                  iconColor={SETTINGS_SECTIONS.CONTACT.cards.EMAIL.iconColor}
               />

               <SettingsCard
                  title={SETTINGS_SECTIONS.CONTACT.cards.GITHUB.title}
                  subtitle={SETTINGS_SECTIONS.CONTACT.cards.GITHUB.subtitle}
                  icon={SETTINGS_SECTIONS.CONTACT.cards.GITHUB.icon}
                  onPress={handleGitHubContact}
                  iconColor={SETTINGS_SECTIONS.CONTACT.cards.GITHUB.iconColor}
               />
            </View>

            {/* Data Management Section */}
            <View className="mb-6">
               <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {SETTINGS_SECTIONS.DATA_MANAGEMENT.title}
               </Text>

               <SettingsCard
                  title={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.SHARE_DATA.title
                  }
                  subtitle={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.SHARE_DATA.subtitle
                  }
                  icon={SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.SHARE_DATA.icon}
                  onPress={handleExportData}
                  iconColor={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.SHARE_DATA
                        .iconColor
                  }
               />

               <SettingsCard
                  title={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.IMPORT_DATA.title
                  }
                  subtitle={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.IMPORT_DATA
                        .subtitle
                  }
                  icon={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.IMPORT_DATA.icon
                  }
                  onPress={handleImportData}
                  iconColor={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.IMPORT_DATA
                        .iconColor
                  }
               />

               <SettingsCard
                  title={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.CLEAR_DATA.title
                  }
                  subtitle={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.CLEAR_DATA.subtitle
                  }
                  icon={SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.CLEAR_DATA.icon}
                  onPress={handleClearAllData}
                  iconColor={
                     SETTINGS_SECTIONS.DATA_MANAGEMENT.cards.CLEAR_DATA
                        .iconColor
                  }
               />
            </View>

            {/* App Info */}
            <View className="mb-6">
               <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {SETTINGS_SECTIONS.APP_INFO.title}
               </Text>

               <SettingsCard
                  title={SETTINGS_SECTIONS.APP_INFO.cards.VERSION.title}
                  subtitle={SETTINGS_SECTIONS.APP_INFO.cards.VERSION.subtitle}
                  icon={SETTINGS_SECTIONS.APP_INFO.cards.VERSION.icon}
                  onPress={() => {}}
                  showArrow={false}
               />

               <SettingsCard
                  title={SETTINGS_SECTIONS.ABOUT.title}
                  subtitle={SETTINGS_SECTIONS.ABOUT.subtitle}
                  icon={SETTINGS_SECTIONS.ABOUT.icon}
                  onPress={handleAboutApp}
                  iconColor={SETTINGS_SECTIONS.ABOUT.iconColor}
               />
            </View>

            {/* Copyright Section */}
            <View className="mb-12">
               <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <View className="flex-row items-center justify-center mb-2">
                     <Image
                        source={require("../../assets/images/admin-logo.png")}
                        style={{ width: 16, height: 16 }}
                        resizeMode="contain"
                     />
                     <Text className="text-center text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {APP_INFO.COPYRIGHT}
                     </Text>
                  </View>
                  <Text className="text-center text-xs text-gray-500 dark:text-gray-500">
                     {APP_INFO.BUILT_WITH}
                  </Text>
               </View>
            </View>
         </ScrollView>

         <CustomAlert
            visible={alert.visible}
            title={alert.title}
            message={alert.message}
            type={alert.type}
            onCancel={hideAlert}
            onConfirm={
               alert.onConfirm
                  ? () => {
                       hideAlert();
                       alert.onConfirm!();
                    }
                  : undefined
            }
         />

         <NotificationSettingsModal
            visible={notificationModalVisible}
            onClose={closeNotificationModal}
         />

         <ThemePopup
            visible={themePopupVisible}
            onClose={() => setThemePopupVisible(false)}
         />
      </ThemedView>
   );
};

export default Settings;

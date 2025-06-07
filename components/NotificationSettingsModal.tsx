import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
   Modal,
   ScrollView,
   Switch,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface NotificationSettingsModalProps {
   visible: boolean;
   onClose: () => void;
}

interface NotificationSettings {
   enabled: boolean;
   reminderTimes: {
      beforeMidnight: string[];
      afterMidnight: string[];
   };
   selectedBeforeMidnight: string;
   selectedAfterMidnight: string;
}

const STORAGE_KEY = "@notification_settings";

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
   visible,
   onClose,
}) => {
   const { currentTheme } = useTheme();
   const [settings, setSettings] = useState<NotificationSettings>({
      enabled: false,
      reminderTimes: {
         beforeMidnight: ["22:00", "23:00"],
         afterMidnight: ["01:00", "02:00", "03:00"],
      },
      selectedBeforeMidnight: "23:00",
      selectedAfterMidnight: "01:00",
   });

   useEffect(() => {
      loadSettings();
   }, []);

   const loadSettings = async () => {
      try {
         const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
         if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(parsed);
         }
      } catch (error) {
         console.error("Error loading notification settings:", error);
      }
   };

   const saveSettings = async (newSettings: NotificationSettings) => {
      try {
         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
         setSettings(newSettings);
      } catch (error) {
         console.error("Error saving notification settings:", error);
      }
   };

   const toggleNotifications = (enabled: boolean) => {
      const newSettings = { ...settings, enabled };
      saveSettings(newSettings);
   };

   const selectTime = (type: "before" | "after", time: string) => {
      const newSettings = {
         ...settings,
         [type === "before"
            ? "selectedBeforeMidnight"
            : "selectedAfterMidnight"]: time,
      };
      saveSettings(newSettings);
   };

   const TimeSelector = ({
      title,
      times,
      selectedTime,
      onSelect,
      type,
   }: {
      title: string;
      times: string[];
      selectedTime: string;
      onSelect: (time: string) => void;
      type: "before" | "after";
   }) => (
      <View className="mb-6">
         <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            {title}
         </Text>
         <View className="flex-row justify-around">
            {times.map((time) => (
               <TouchableOpacity
                  key={time}
                  onPress={() => onSelect(time)}
                  className={`px-6 py-3 rounded-lg border-2 ${
                     selectedTime === time
                        ? "bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }`}
               >
                  <Text
                     className={`text-center font-semibold ${
                        selectedTime === time
                           ? "text-white"
                           : "text-gray-700 dark:text-gray-300"
                     }`}
                  >
                     {time}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );

   return (
      <Modal
         visible={visible}
         animationType="slide"
         presentationStyle="pageSheet"
         onRequestClose={onClose}
      >
         <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-6">
               <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                     Notification Settings
                  </Text>
                  <TouchableOpacity
                     onPress={onClose}
                     className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
                  >
                     <Ionicons
                        name="close"
                        size={20}
                        color={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
                     />
                  </TouchableOpacity>
               </View>
            </View>

            <ScrollView className="flex-1 px-6 py-6">
               {/* Enable/Disable Notifications */}
               <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                  <View className="flex-row items-center justify-between">
                     <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                           Meal Reminders
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                           Get notified if you miss logging your meals
                        </Text>
                     </View>
                     <Switch
                        value={settings.enabled}
                        onValueChange={toggleNotifications}
                        trackColor={{
                           false:
                              currentTheme === "dark" ? "#374151" : "#E5E7EB",
                           true: "#3B82F6",
                        }}
                        thumbColor={
                           settings.enabled
                              ? "#FFFFFF"
                              : currentTheme === "dark"
                              ? "#6B7280"
                              : "#9CA3AF"
                        }
                     />
                  </View>
               </View>

               {settings.enabled && (
                  <>
                     {/* Explanation */}
                     <View className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
                        <View className="flex-row items-start">
                           <Ionicons
                              name="information-circle"
                              size={20}
                              color={
                                 currentTheme === "dark" ? "#60A5FA" : "#3B82F6"
                              }
                              style={{ marginTop: 2 }}
                           />
                           <View className="flex-1 ml-3">
                              <Text className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                                 How it works:
                              </Text>
                              <Text className="text-sm text-blue-700 dark:text-blue-400 leading-5">
                                 • If you haven&apos;t logged any meal data by
                                 midnight (00:00), you&apos;ll get a reminder at
                                 your selected time after midnight
                                 {"\n"}• You can also set a reminder before
                                 midnight to log yesterday&apos;s data
                                 {"\n"}• Notifications only show when the app is
                                 closed and you have missing data
                              </Text>
                           </View>
                        </View>
                     </View>

                     {/* Time Selection */}
                     <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <TimeSelector
                           title="Reminder Before Midnight"
                           times={settings.reminderTimes.beforeMidnight}
                           selectedTime={settings.selectedBeforeMidnight}
                           onSelect={(time) => selectTime("before", time)}
                           type="before"
                        />

                        <TimeSelector
                           title="Reminder After Midnight"
                           times={settings.reminderTimes.afterMidnight}
                           selectedTime={settings.selectedAfterMidnight}
                           onSelect={(time) => selectTime("after", time)}
                           type="after"
                        />
                     </View>

                     {/* Current Settings Summary */}
                     <View className="bg-green-50 rounded-lg p-4 border border-green-200 mb-8">
                        <View className="flex-row items-start">
                           <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#10B981"
                              style={{ marginTop: 2 }}
                           />
                           <View className="flex-1 ml-3">
                              <Text className="text-sm font-medium text-green-800 mb-2">
                                 Your Settings:
                              </Text>
                              <Text className="text-sm text-green-700">
                                 • Before midnight reminder:{" "}
                                 {settings.selectedBeforeMidnight}
                                 {"\n"}• After midnight reminder:{" "}
                                 {settings.selectedAfterMidnight}
                              </Text>
                           </View>
                        </View>
                     </View>
                  </>
               )}
            </ScrollView>

            {/* Footer */}
            <View className="bg-white border-t border-gray-200 p-6">
               <TouchableOpacity
                  onPress={onClose}
                  className="bg-blue-500 rounded-lg py-3 px-6"
               >
                  <Text className="text-white text-center font-semibold text-lg">
                     Save Settings
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
   );
};

export default NotificationSettingsModal;

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMealTracker } from "../../hooks/useMealTracker";
import { MealDataService } from "../../services/MealDataService";

const Settings = () => {
   const { exportData, importData, clearAllData, reloadAllData } =
      useMealTracker();

   const handleExportData = async () => {
      try {
         const success = await exportData();
         if (success) {
            Alert.alert(
               "Export Successful",
               "Your meal tracker data has been exported successfully.",
               [{ text: "OK" }]
            );
         }
      } catch (error) {
         console.error("Export error:", error);
         Alert.alert(
            "Export Failed",
            "There was an error exporting your data. Please try again.",
            [{ text: "OK" }]
         );
      }
   };

   const handleImportData = async () => {
      Alert.alert(
         "Import Data",
         "This will replace all your current data. Are you sure you want to continue?",
         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Import",
               style: "destructive",
               onPress: async () => {
                  try {
                     const success = await importData();
                     if (success) {
                        // Trigger a reload to refresh the month data choices on the main page
                        if (reloadAllData) {
                           await reloadAllData();
                           console.log("✅ Data reloaded after import");
                        }

                        Alert.alert(
                           "Import Successful",
                           "Your data has been imported successfully.",
                           [{ text: "OK" }]
                        );
                     }
                  } catch (error) {
                     console.error("Import error:", error);
                     Alert.alert(
                        "Import Failed",
                        "There was an error importing your data. Please try again.",
                        [{ text: "OK" }]
                     );
                  }
               },
            },
         ]
      );
   };

   const handleClearAllData = () => {
      Alert.alert(
         "Clear All Data",
         "This will permanently delete all your meal tracker data. This action cannot be undone.",
         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Delete All",
               style: "destructive",
               onPress: async () => {
                  try {
                     console.log(
                        "🚀 Starting complete data clear from Settings..."
                     );
                     if (clearAllData) {
                        await clearAllData(); // Use the hook function instead of service directly
                        console.log("✅ Complete data clear successful");

                        // Trigger a reload to refresh the month data choices on the main page
                        if (reloadAllData) {
                           await reloadAllData();
                           console.log("✅ Data reloaded after clear");
                        }

                        Alert.alert(
                           "Data Cleared",
                           "All your data has been deleted successfully.",
                           [{ text: "OK" }]
                        );
                     } else {
                        // Fallback to service method
                        await MealDataService.clearAllData();
                        Alert.alert(
                           "Data Cleared",
                           "All your data has been deleted successfully (fallback method).",
                           [{ text: "OK" }]
                        );
                     }
                  } catch (error) {
                     console.error("Clear data error:", error);
                     Alert.alert(
                        "Error",
                        "There was an error clearing your data. Please try again.",
                        [{ text: "OK" }]
                     );
                  }
               },
            },
         ]
      );
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
         className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm"
      >
         <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
               <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <View className="flex-1">
               <Text className="text-lg font-semibold text-gray-800">
                  {title}
               </Text>
               {subtitle && (
                  <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
               )}
            </View>
            {showArrow && (
               <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
         </View>
      </TouchableOpacity>
   );

   return (
      <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
         {/* Header */}
         <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
               Settings
            </Text>
            <Text className="text-gray-600">
               Manage your meal tracker preferences and data
            </Text>
         </View>

         {/* Data Management Section */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Data Management
            </Text>

            <SettingsCard
               title="Export Data"
               subtitle="Save your data as a JSON file"
               icon="download-outline"
               onPress={handleExportData}
               iconColor="#10B981"
            />

            <SettingsCard
               title="Import Data"
               subtitle="Load data from a JSON file"
               icon="cloud-upload-outline"
               onPress={handleImportData}
               iconColor="#3B82F6"
            />

            <SettingsCard
               title="Clear All Data"
               subtitle="Permanently delete all stored data"
               icon="trash-outline"
               onPress={handleClearAllData}
               iconColor="#EF4444"
            />
         </View>

         {/* App Info */}
         <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               App Information
            </Text>

            <View className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
               <View className="flex-row items-center mb-2">
                  <Ionicons name="analytics" size={20} color="#3B82F6" />
                  <Text className="text-blue-800 font-semibold ml-2">
                     Data Format
                  </Text>
               </View>
               <Text className="text-blue-700 text-sm">
                  Each date entry stores: {"\n"}
                  {`{ day: amount, night: amount, extra: amount }`}
                  {"\n"}
                  Example: {`{ day: 100, night: 50, extra: 25 }`}
               </Text>
            </View>

            <SettingsCard
               title="Version"
               subtitle="Meal Tracker v1.0.0"
               icon="information-circle-outline"
               onPress={() => {}}
               showArrow={false}
            />
         </View>

         {/* Copyright Section */}
         <View className="mb-8 mt-4">
            <View className="bg-gray-100 rounded-lg p-4 border border-gray-200">
               <Text className="text-center text-sm text-gray-600 mb-1">
                  © 2025 Meal Tracker App
               </Text>
               <Text className="text-center text-xs text-gray-500">
                  Built with React Native & Expo
               </Text>
            </View>
         </View>
      </ScrollView>
   );
};

export default Settings;

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMealTracker } from "../../hooks/useMealTracker";
import { MealDataService } from "../../services/MealDataService";

const Settings = () => {
   const { exportData, importData } = useMealTracker();
   const [statistics, setStatistics] = useState({
      totalDays: 0,
      totalAmount: 0,
      dayTotal: 0,
      nightTotal: 0,
      extraTotal: 0,
   });

   useEffect(() => {
      loadStatistics();
   }, []);

   const loadStatistics = async () => {
      try {
         const stats = await MealDataService.getDataStatistics();
         setStatistics(stats);
      } catch (error) {
         console.error("Error loading statistics:", error);
      }
   };

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
                        Alert.alert(
                           "Import Successful",
                           "Your data has been imported successfully.",
                           [{ text: "OK" }]
                        );
                        loadStatistics(); // Refresh statistics
                     }
                  } catch (error) {
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
                     await MealDataService.clearAllData();
                     Alert.alert(
                        "Data Cleared",
                        "All your data has been deleted successfully.",
                        [{ text: "OK" }]
                     );
                     loadStatistics(); // Refresh statistics
                  } catch (error) {
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

   const StatCard = ({
      label,
      value,
      color = "#3B82F6",
   }: {
      label: string;
      value: number;
      color?: string;
   }) => (
      <View className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
         <Text className="text-sm text-gray-500 mb-1">{label}</Text>
         <Text className={`text-2xl font-bold`} style={{ color }}>
            {label.includes("Total") && label !== "Total Days"
               ? `₹${value}`
               : value}
         </Text>
      </View>
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

         {/* Statistics Section */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Data Overview
            </Text>
            <View className="grid grid-cols-2 gap-3 mb-3">
               <StatCard
                  label="Total Days"
                  value={statistics.totalDays}
                  color="#10B981"
               />
               <StatCard
                  label="Total Amount"
                  value={statistics.totalAmount}
                  color="#F59E0B"
               />
            </View>
            <View className="grid grid-cols-3 gap-3">
               <StatCard
                  label="Day Total"
                  value={statistics.dayTotal}
                  color="#3B82F6"
               />
               <StatCard
                  label="Night Total"
                  value={statistics.nightTotal}
                  color="#8B5CF6"
               />
               <StatCard
                  label="Extra Total"
                  value={statistics.extraTotal}
                  color="#EF4444"
               />
            </View>
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

         {/* Auto-Save Info */}
         <View className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <View className="flex-row items-center mb-2">
               <Ionicons name="information-circle" size={20} color="#3B82F6" />
               <Text className="text-blue-800 font-semibold ml-2">
                  Auto-Save Enabled
               </Text>
            </View>
            <Text className="text-blue-700 text-sm">
               Your meal data is automatically saved in JSON format whenever you
               make changes. Each date stores: {"\n"}
               {`{ day: value, night: value, extra: value }`}
            </Text>
         </View>

         {/* App Info */}
         <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               App Information
            </Text>

            <SettingsCard
               title="Version"
               subtitle="Meal Tracker v1.0.0"
               icon="information-circle-outline"
               onPress={() => {}}
               showArrow={false}
            />
         </View>
      </ScrollView>
   );
};

export default Settings;

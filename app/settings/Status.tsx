import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { MealDataService } from "../../services/MealDataService";

const Status = () => {
   const [statistics, setStatistics] = useState({
      totalDays: 0,
      totalAmount: 0,
      dayTotal: 0,
      nightTotal: 0,
      extraTotal: 0,
   });

   const [currentMonthStats, setCurrentMonthStats] = useState({
      totalDays: 0,
      totalAmount: 0,
      dayTotal: 0,
      nightTotal: 0,
      extraTotal: 0,
      monthName: "",
      year: 0,
   });

   useEffect(() => {
      loadStatistics();
      loadCurrentMonthStats();
   }, []);

   const loadStatistics = async () => {
      try {
         const stats = await MealDataService.getDataStatistics();
         setStatistics(stats);
      } catch (error) {
         console.error("Error loading statistics:", error);
      }
   };

   const loadCurrentMonthStats = async () => {
      try {
         const monthStats = await MealDataService.getCurrentMonthStatistics();
         setCurrentMonthStats(monthStats);
      } catch (error) {
         console.error("Error loading current month statistics:", error);
      }
   };

   const StatCard = ({
      label,
      value,
      color = "#3B82F6",
      isCurrentMonth = false,
   }: {
      label: string;
      value: number;
      color?: string;
      isCurrentMonth?: boolean;
   }) => (
      <View
         className={`rounded-lg p-4 border shadow-sm ${
            isCurrentMonth
               ? "bg-blue-50 border-blue-200"
               : "bg-white border-gray-200"
         }`}
      >
         <Text
            className={`text-sm mb-1 ${
               isCurrentMonth ? "text-blue-600" : "text-gray-500"
            }`}
         >
            {label}
         </Text>
         <Text className={`text-2xl font-bold`} style={{ color }}>
            {label.includes("Total") && label !== "Total Days"
               ? `₹${value}`
               : value}
         </Text>
      </View>
   );

   const InfoCard = ({
      title,
      description,
      icon,
      iconColor = "#3B82F6",
   }: {
      title: string;
      description: string;
      icon: any;
      iconColor?: string;
   }) => (
      <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm">
         <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
               <Ionicons name={icon} size={16} color={iconColor} />
            </View>
            <Text className="text-lg font-semibold text-gray-800">{title}</Text>
         </View>
         <Text className="text-sm text-gray-600 ml-11">{description}</Text>
      </View>
   );

   return (
      <ScrollView className="flex-1 bg-gray-50 pt-8 px-6">
         {/* Header */}
         <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-800">
               Status Overview
            </Text>
            <Text className="text-base text-gray-500 mb-2">
               Your meal tracking statistics and app status
            </Text>
         </View>

         {/* Current Month Statistics */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Current Month - {currentMonthStats.monthName}{" "}
               {currentMonthStats.year}
            </Text>
            <View className="flex-row gap-3 mb-3">
               <View className="flex-1">
                  <StatCard
                     label="Month Days"
                     value={currentMonthStats.totalDays}
                     color="#10B981"
                     isCurrentMonth={true}
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Month Total"
                     value={currentMonthStats.totalAmount}
                     color="#F59E0B"
                     isCurrentMonth={true}
                  />
               </View>
            </View>
            <View className="flex-row gap-3">
               <View className="flex-1">
                  <StatCard
                     label="Day Total"
                     value={currentMonthStats.dayTotal}
                     color="#3B82F6"
                     isCurrentMonth={true}
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Night Total"
                     value={currentMonthStats.nightTotal}
                     color="#8B5CF6"
                     isCurrentMonth={true}
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Extra Total"
                     value={currentMonthStats.extraTotal}
                     color="#EF4444"
                     isCurrentMonth={true}
                  />
               </View>
            </View>
         </View>

         {/* Overall Statistics Section */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Overall Statistics
            </Text>
            <View className="flex-row gap-3 mb-3">
               <View className="flex-1">
                  <StatCard
                     label="Total Days"
                     value={statistics.totalDays}
                     color="#10B981"
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Total Amount"
                     value={statistics.totalAmount}
                     color="#F59E0B"
                  />
               </View>
            </View>
            <View className="flex-row gap-3">
               <View className="flex-1">
                  <StatCard
                     label="Day Total"
                     value={statistics.dayTotal}
                     color="#3B82F6"
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Night Total"
                     value={statistics.nightTotal}
                     color="#8B5CF6"
                  />
               </View>
               <View className="flex-1">
                  <StatCard
                     label="Extra Total"
                     value={statistics.extraTotal}
                     color="#EF4444"
                  />
               </View>
            </View>
         </View>

         {/* App Status */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               App Status
            </Text>

            <InfoCard
               title="Save-Only Mode"
               description="Your meal data is saved only when app closes, during imports, or manual saves"
               icon="save-outline"
               iconColor="#F59E0B"
            />

            <InfoCard
               title="Data Persistence"
               description="All data is stored locally using AsyncStorage in JSON format"
               icon="server"
               iconColor="#3B82F6"
            />

            <InfoCard
               title="Background Save"
               description="Data is automatically saved when app goes to background"
               icon="save"
               iconColor="#F59E0B"
            />
         </View>

         {/* Performance Info */}
         <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Performance
            </Text>

            <InfoCard
               title="Optimized Loading"
               description="Data loads with default values first, then saved data is applied"
               icon="flash"
               iconColor="#F59E0B"
            />

            <InfoCard
               title="Efficient Saving"
               description="Only non-zero values are saved, empty entries are automatically deleted"
               icon="trending-up"
               iconColor="#10B981"
            />
         </View>
      </ScrollView>
   );
};

export default Status;

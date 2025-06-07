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
      className = "",
   }: {
      label: string;
      value: number;
      color?: string;
      isCurrentMonth?: boolean;
      className?: string;
   }) => (
      <View
         className={`rounded-lg p-4 border shadow-sm ${
            isCurrentMonth
               ? "bg-blue-50 border-blue-200"
               : "bg-white border-gray-200"
         } ${className}`}
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
               : label.includes("%")
               ? `${value}%`
               : label.includes("Avg")
               ? value
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

         {/* Average Statistics */}
         <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Average Statistics
            </Text>

            {/* Primary Average - Full width highlight card */}
            <View className="mb-3">
               <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-full p-4 border border-green-200 shadow-sm">
                  <View className="flex-row items-center justify-between">
                     <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                           <Ionicons
                              name="restaurant"
                              size={20}
                              color="#10B981"
                           />
                        </View>
                        <View>
                           <Text className="text-sm text-green-600 font-medium">
                              Average Meals Per Day
                           </Text>
                           <Text className="text-xs text-green-500">
                              Overall daily consumption
                           </Text>
                        </View>
                     </View>
                     <Text className="text-3xl font-bold text-green-600">
                        {statistics.totalDays > 0
                           ? (
                                statistics.totalAmount / statistics.totalDays
                             ).toFixed(1)
                           : "0.0"}
                     </Text>
                  </View>
               </View>
            </View>

            {/* Detailed Averages - Grid layout */}
            <View className="flex-col bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
               <Text className="text-sm font-semibold text-gray-600 mb-3">
                  Average by Meal Type
               </Text>
               <View className="flex-row w-full gap-3">
                  <View className="flex-col flex-[4] gap-3">
                     <View className="flex-1">
                        <StatCard
                           label="Avg Day"
                           value={
                              statistics.totalDays > 0
                                 ? Math.round(
                                      (statistics.dayTotal /
                                         statistics.totalDays) *
                                         10
                                   ) / 10
                                 : 0
                           }
                           color="#3B82F6"
                        />
                     </View>
                     <View className="flex-1">
                        <StatCard
                           label="Avg Night"
                           value={
                              statistics.totalDays > 0
                                 ? Math.round(
                                      (statistics.nightTotal /
                                         statistics.totalDays) *
                                         10
                                   ) / 10
                                 : 0
                           }
                           color="#8B5CF6"
                        />
                     </View>
                  </View>
                  <View className="flex flex-[2]">
                     <View className="flex-1 flex h-full">
                        <StatCard
                           className="relative size-full flex justify-center items-center"
                           label="Avg Extra"
                           value={
                              statistics.totalDays > 0
                                 ? Math.round(
                                      (statistics.extraTotal /
                                         statistics.totalDays) *
                                         10
                                   ) / 10
                                 : 0
                           }
                           color="#EF4444"
                        />
                     </View>
                  </View>
               </View>
            </View>
         </View>

         {/* Meal Type Distribution */}
         <View className="mb-12">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
               Meal Distribution
            </Text>

            {/* Distribution Cards Container with Fixed Heights */}
            <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
               <Text className="text-sm font-semibold text-gray-600 mb-3">
                  Percentage Distribution
               </Text>

               <View className="flex-col gap-3">
                  <View className="flex-1">
                     <View className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                        <View className="flex-row items-center justify-between">
                           <View>
                              <Text className="text-sm text-blue-600 font-medium">
                                 Day Meals
                              </Text>
                              <Text className="text-xs text-blue-500">
                                 Morning & afternoon
                              </Text>
                           </View>
                           <Text className="text-2xl font-bold text-blue-600">
                              {statistics.totalAmount > 0
                                 ? Math.round(
                                      (statistics.dayTotal /
                                         statistics.totalAmount) *
                                         100
                                   )
                                 : 0}
                              %
                           </Text>
                        </View>
                     </View>
                  </View>
                  <View className="flex-1">
                     <View className="bg-purple-50 rounded-lg p-4 border border-purple-200 shadow-sm">
                        <View className="flex-row items-center justify-between">
                           <View>
                              <Text className="text-sm text-purple-600 font-medium">
                                 Night Meals
                              </Text>
                              <Text className="text-xs text-purple-500">
                                 Evening & dinner
                              </Text>
                           </View>
                           <Text className="text-2xl font-bold text-purple-600">
                              {statistics.totalAmount > 0
                                 ? Math.round(
                                      (statistics.nightTotal /
                                         statistics.totalAmount) *
                                         100
                                   )
                                 : 0}
                              %
                           </Text>
                        </View>
                     </View>
                  </View>

                  <View className="flex-1">
                     <View className="bg-red-50 rounded-lg p-4 border border-red-200 shadow-sm">
                        <View className="flex-row items-center justify-between">
                           <View>
                              <Text className="text-sm text-red-600 font-medium">
                                 Extra Meals
                              </Text>
                              <Text className="text-xs text-red-500">
                                 Additional meals
                              </Text>
                           </View>
                           <Text className="text-2xl font-bold text-red-600">
                              {statistics.totalAmount > 0
                                 ? Math.round(
                                      (statistics.extraTotal /
                                         statistics.totalAmount) *
                                         100
                                   )
                                 : 0}
                              %
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
            </View>
         </View>
      </ScrollView>
   );
};

export default Status;

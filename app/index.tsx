import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DropdownCard from "../components/DropdownCard";
import Navigation from "../components/Navigation";

const TView = ({
   className = "",
   label = "Day",
}: {
   className?: string;
   label?: string;
}) => {
   return (
      <View className={`flex w-full justify-center items-center ${className}`}>
         <Text className="text-sm font-bold text-gray-800">{label}</Text>
      </View>
   );
};

export default function Index() {
   const [selectedOptions, setSelectedOptions] = useState<{
      [key: string]: { type: string; value: string; isOn: boolean };
   }>({});
   const [customValues, setCustomValues] = useState<{ [key: string]: string }>(
      {}
   );
   const [dropdownStates, setDropdownStates] = useState<{
      [key: string]: boolean;
   }>({});
   const [currentMonth, setCurrentMonth] = useState(new Date()); // Use current date instead of fixed June 2025

   // Handle date change from Navigation component
   const handleDateChange = (newDate: Date) => {
      setCurrentMonth(newDate);
   };

   const toggleDropdown = (key: string) => {
      setDropdownStates((prev) => ({
         ...prev,
         [key]: !prev[key],
      }));
   };

   // Generate dates for selected month
   const generateDates = () => {
      const dates = [];
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = [
         "January",
         "February",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December",
      ];

      for (let i = 1; i <= daysInMonth; i++) {
         const date = new Date(year, month, i);
         const dayName = dayNames[date.getDay()];
         dates.push({
            date: i,
            day: dayName,
            fullDate: `${i}/${month + 1}/${year}`,
            monthName: monthNames[month],
            year: year,
         });
      }
      return dates;
   };

   const dates = generateDates();
   const customChoices = ["40", "60", "90", "Custom"];

   const handleValueSelect = (dateKey: string, value: string) => {
      setSelectedOptions((prev) => ({
         ...prev,
         [dateKey]: {
            ...prev[dateKey],
            value: value,
         },
      }));
   };

   const handleToggle = (dateKey: string) => {
      setSelectedOptions((prev) => ({
         ...prev,
         [dateKey]: {
            ...prev[dateKey],
            isOn: !prev[dateKey]?.isOn,
         },
      }));
   };

   const handleCustomValueChange = (dateKey: string, customValue: string) => {
      setCustomValues((prev) => ({
         ...prev,
         [dateKey]: customValue,
      }));
   };

   const renderRow = (dateInfo: {
      date: number;
      day: string;
      fullDate: string;
   }) => {
      const dateKey = dateInfo.fullDate;
      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey] || { value: "", isOn: false };
      const nightSelected = selectedOptions[nightKey] || {
         value: "",
         isOn: false,
      };
      const customSelected = selectedOptions[customKey] || {
         value: "",
         isOn: false,
      };

      const renderDropdown = (typeKey: string, typeSelected: any) => (
         <DropdownCard
            typeKey={typeKey}
            typeSelected={typeSelected}
            customChoices={customChoices}
            dropdownStates={dropdownStates}
            customValues={customValues}
            toggleDropdown={toggleDropdown}
            handleValueSelect={handleValueSelect}
            handleCustomValueChange={handleCustomValueChange}
         />
      );

      return (
         <View key={dateKey} className="flex-row border-b border-gray-200 py-2">
            {/* Date Column - flex-4 */}
            <View className="flex-[4] px-2 justify-center">
               <Text className="text-sm font-medium text-gray-800">
                  {dateInfo.date}
               </Text>
               <Text className="text-xs text-gray-500">{dateInfo.day}</Text>
            </View>

            {/* Day Column - flex-8 */}
            <View className="flex-[8] justify-center">
               {renderDropdown(dayKey, daySelected)}
            </View>

            {/* Night Column - flex-8 */}
            <View className="flex-[8] justify-center">
               {renderDropdown(nightKey, nightSelected)}
            </View>

            {/* Custom Column - flex-8 */}
            <View className="flex-[8] justify-center">
               {renderDropdown(customKey, customSelected)}
            </View>

            {/* Status Column - flex-6 */}
            <View className="flex-[6] px-2 justify-center items-center">
               <TouchableOpacity
                  onPress={() => handleToggle(dayKey)}
                  className={`p-2 rounded-full ${
                     daySelected.isOn ? "bg-green-500" : "bg-red-500"
                  }`}
               >
                  <Ionicons
                     name={daySelected.isOn ? "checkmark" : "close"}
                     size={12}
                     color="white"
                  />
               </TouchableOpacity>
            </View>
         </View>
      );
   };

   // Calculate summary
   const calculateSummary = () => {
      let dayTotal = 0;
      let nightTotal = 0;
      let customTotal = 0;
      let activeDays = 0;

      dates.forEach((dateInfo) => {
         const dateKey = dateInfo.fullDate;
         const dayKey = `${dateKey}-day`;
         const nightKey = `${dateKey}-night`;
         const customKey = `${dateKey}-custom`;

         const daySelected = selectedOptions[dayKey];
         const nightSelected = selectedOptions[nightKey];
         const customSelected = selectedOptions[customKey];

         let hasActivity = false;

         if (daySelected?.isOn) {
            const value =
               daySelected.value === "Custom"
                  ? parseInt(customValues[dayKey] || "0")
                  : parseInt(daySelected.value || "0");
            dayTotal += value;
            hasActivity = true;
         }

         if (nightSelected?.isOn) {
            const value =
               nightSelected.value === "Custom"
                  ? parseInt(customValues[nightKey] || "0")
                  : parseInt(nightSelected.value || "0");
            nightTotal += value;
            hasActivity = true;
         }

         if (customSelected?.isOn) {
            const value =
               customSelected.value === "Custom"
                  ? parseInt(customValues[customKey] || "0")
                  : parseInt(customSelected.value || "0");
            customTotal += value;
            hasActivity = true;
         }

         if (hasActivity) {
            activeDays++;
         }
      });

      return {
         dayTotal,
         nightTotal,
         customTotal,
         onCount: activeDays,
         total: dayTotal + nightTotal + customTotal,
      };
   };

   const summary = calculateSummary();
   return (
      <View className="flex-1 bg-base">
         <Navigation className="pt-10 h-28" onDateChange={handleDateChange} />

         <View className="flex-row bg-gray-100 py-3 px-2 border-b border-gray-300">
            <TView label="Date" className="flex-[4] bg-red-500" />
            <TView label="Day" className="flex-[8] bg-blue-500" />
            <TView label="Night " className="flex-[8] bg-purple-500" />
            <TView label="Custom" className="flex-[8] bg-green-500" />
            <TView label="Status" className="flex-[6] bg-yellow-500" />
         </View>

         {/* Table Rows */}
         <ScrollView className="flex-col px-2 gpa">
            {dates.map(renderRow)}
         </ScrollView>

         {/* Summary */}
         <View className="bg-gray-50 p-4 border-t border-gray-300">
            <Text className="text-lg font-bold text-gray-800 mb-3">
               Summary for {dates[0]?.monthName} {dates[0]?.year}
            </Text>

            <View className="flex-row justify-between mb-2">
               <Text className="text-sm font-medium text-gray-600">
                  Day Total:
               </Text>
               <Text className="text-sm font-bold text-blue-600">
                  {summary.dayTotal}
               </Text>
            </View>

            <View className="flex-row justify-between mb-2">
               <Text className="text-sm font-medium text-gray-600">
                  Night Total:
               </Text>
               <Text className="text-sm font-bold text-purple-600">
                  {summary.nightTotal}
               </Text>
            </View>

            <View className="flex-row justify-between mb-2">
               <Text className="text-sm font-medium text-gray-600">
                  Custom Total:
               </Text>
               <Text className="text-sm font-bold text-green-600">
                  {summary.customTotal}
               </Text>
            </View>

            <View className="flex-row justify-between mb-3">
               <Text className="text-sm font-medium text-gray-600">
                  Active Days:
               </Text>
               <Text className="text-sm font-bold text-orange-600">
                  {summary.onCount}
               </Text>
            </View>

            <View className="flex-row justify-between border-t border-gray-300 pt-3">
               <Text className="text-base font-bold text-gray-800">
                  Grand Total:
               </Text>
               <Text className="text-base font-bold text-blue-600">
                  {summary.total}
               </Text>
            </View>
         </View>
      </View>
   );
}

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropdownCard from "./DropdownCard";

interface MealRowProps {
   dateInfo: {
      date: number;
      day: string;
      fullDate: string;
   };
   selectedOptions: {
      [key: string]: { type: string; value: string; isOn: boolean };
   };
   customValues: { [key: string]: string };
   customChoices: string[];
   dropdownStates: { [key: string]: boolean };
   currentMonth: Date;
   onToggle: (dateKey: string) => void;
   onDropdownToggle: (key: string) => void;
   onValueSelect: (dateKey: string, value: string) => void;
   onCustomValueChange: (dateKey: string, customValue: string) => void;
   onCloseAllDropdowns: () => void;
}

const MealRow: React.FC<MealRowProps> = ({
   dateInfo,
   selectedOptions,
   customValues,
   customChoices,
   dropdownStates,
   currentMonth,
   onToggle,
   onDropdownToggle,
   onValueSelect,
   onCustomValueChange,
   onCloseAllDropdowns,
}) => {
   const dateKey = dateInfo.fullDate;
   const dayKey = `${dateKey}-day`;
   const nightKey = `${dateKey}-night`;
   const customKey = `${dateKey}-custom`;

   const daySelected = selectedOptions[dayKey] || {
      value: "--",
      isOn: true,
   };
   const nightSelected = selectedOptions[nightKey] || {
      value: "--",
      isOn: true,
   };
   const customSelected = selectedOptions[customKey] || {
      value: "OFF", // Default to "OFF" for Extra column
      isOn: true,
   };

   // Check if any numeric value > 0 is entered
   const hasNumericValue = () => {
      // Check Day value
      if (
         daySelected.value &&
         daySelected.value !== "--" &&
         daySelected.value !== "OFF"
      ) {
         const dayValue =
            daySelected.value === "Custom"
               ? parseInt(customValues[dayKey] || "0")
               : parseInt(daySelected.value || "0");
         if (dayValue > 0) return true;
      }

      // Check Night value
      if (
         nightSelected.value &&
         nightSelected.value !== "--" &&
         nightSelected.value !== "OFF"
      ) {
         const nightValue =
            nightSelected.value === "Custom"
               ? parseInt(customValues[nightKey] || "0")
               : parseInt(nightSelected.value || "0");
         if (nightValue > 0) return true;
      }

      // Check Extra value
      if (
         customSelected.value &&
         customSelected.value !== "--" &&
         customSelected.value !== "OFF"
      ) {
         const customValue =
            customSelected.value === "Custom"
               ? parseInt(customValues[customKey] || "0")
               : parseInt(customSelected.value || "0");
         if (customValue > 0) return true;
      }

      return false;
   };

   // Check if all three columns are OFF
   const allColumnsOff =
      (daySelected.value === "--" || daySelected.value === "OFF") &&
      (nightSelected.value === "--" || nightSelected.value === "OFF") &&
      (customSelected.value === "--" || customSelected.value === "OFF");

   // Determine status button state - OFF if all columns are OFF
   const statusIsOn = !allColumnsOff;

   // Check if this is the current date
   const isCurrentDate =
      dateInfo.date === new Date().getDate() &&
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear();

   const renderDropdown = (typeKey: string, typeSelected: any) => (
      <DropdownCard
         typeKey={typeKey}
         typeSelected={typeSelected}
         customChoices={customChoices}
         dropdownStates={dropdownStates}
         customValues={customValues}
         toggleDropdown={onDropdownToggle}
         handleValueSelect={onValueSelect}
         handleCustomValueChange={onCustomValueChange}
         closeAllDropdowns={onCloseAllDropdowns}
      />
   );

   return (
      <View
         className={`flex-row py-2 mx-1 mb-2 rounded-md border-b border-gray-300 ${
            hasNumericValue() ? "bg-green-200/20" : "bg-blue-500/5"
         }`}
      >
         {/* Date Column - flex-4 */}
         <View className="w-full flex flex-[4] justify-center items-center">
            <Text className="text-sm font-medium text-gray-800 z-20">
               {dateInfo.date}
            </Text>
            <Text className="text-xs text-gray-500 z-20">{dateInfo.day}</Text>
            {/* Date background icon */}
            <View
               className={`absolute w-8 h-9 rounded-lg z-10 ${
                  isCurrentDate ? "bg-orange-200/90" : "bg-blue-200/90"
               }`}
            />
         </View>

         {/* Day Column - flex-8 */}
         <View className="w-full flex flex-[8] justify-center">
            {renderDropdown(dayKey, daySelected)}
         </View>

         {/* Night Column - flex-8 */}
         <View className="w-full flex flex-[8] justify-center">
            {renderDropdown(nightKey, nightSelected)}
         </View>

         {/* Extra Column - flex-8 */}
         <View className="w-full flex flex-[8] justify-center">
            {renderDropdown(customKey, customSelected)}
         </View>

         {/* Status Column - flex-6 */}
         <View className="w-full flex-[6] flex justify-center items-center">
            <TouchableOpacity
               onPress={() => onToggle(dateKey)}
               className={`rounded-xl px-3 py-2 ${
                  statusIsOn ? "bg-orange-500" : "bg-emerald-400"
               }`}
            >
               <Ionicons name="power-outline" size={12} color="white" />
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default MealRow;

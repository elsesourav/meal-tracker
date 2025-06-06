import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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

   const [customChoices, setCustomChoices] = useState<string[]>([]);

   // Handle date change from Navigation component
   const handleDateChange = (newDate: Date) => {
      setCurrentMonth(newDate);
   };

   const toggleDropdown = (key: string) => {
      setDropdownStates((prev) => {
         // Close all other dropdowns when opening a new one
         const newStates: { [key: string]: boolean } = {};
         Object.keys(prev).forEach((k) => {
            newStates[k] = false;
         });
         // Toggle the clicked dropdown
         newStates[key] = !prev[key];
         return newStates;
      });
   };

   // Function to close all dropdowns
   const closeAllDropdowns = () => {
      setDropdownStates((prev) => {
         const newStates: { [key: string]: boolean } = {};
         Object.keys(prev).forEach((k) => {
            newStates[k] = false;
         });
         return newStates;
      });
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

   // Function to load custom values from AsyncStorage
   const loadModifyValues = async () => {
      try {
         const savedValues = await AsyncStorage.getItem(
            "@meal_tracker_custom_values"
         );
         if (savedValues) {
            const parsedValues: string[] = JSON.parse(savedValues);
            const sortedValues = parsedValues.sort(
               (a: string, b: string) => parseInt(a) - parseInt(b)
            );
            setCustomChoices(["--" , ...sortedValues, "OFF", "Custom"]);
         } else {
            setCustomChoices(["--", "50", "100", "OFF", "Custom"]);
         }
      } catch (error) {
         console.error("Error loading modify values:", error);
         setCustomChoices(["--", "40", "OFF", "Custom"]);
      }
   };


   useEffect(() => {
      loadModifyValues();
   }, [customChoices]);

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
            closeAllDropdowns={closeAllDropdowns}
         />
      );

      return (
         <View
            key={dateKey}
            className="flex-row py-2 mx-1 mb-2 rounded-md bg-blue-500/5 border-b border-gray-300"
         >
            {/* Date Column - flex-4 */}
            <View className="w-full flex flex-[4] justify-center items-center">
               <Text className="text-sm font-medium text-gray-800">
                  {dateInfo.date}
               </Text>
               <Text className="text-xs text-gray-500">{dateInfo.day}</Text>
               {/* add icon */}
               <View className="absolute w-8 h-9 bg-blue-200/90 rounded-lg -z-10"></View>
            </View>

            {/* Day Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(dayKey, daySelected)}
            </View>

            {/* Night Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(nightKey, nightSelected)}
            </View>

            {/* Custom Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(customKey, customSelected)}
            </View>

            {/* Status Column - flex-6 */}
            <View className="w-full flex-[6] flex justify-center items-center">
               <TouchableOpacity
                  onPress={() => handleToggle(dayKey)}
                  className={`rounded-xl px-3 py-2 ${
                     daySelected.isOn ? "bg-emerald-500" : "bg-orange-400"
                  }`}
               >
                  <Ionicons name="power-outline" size={12} color="white" />
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

         <View className="flex-row bg-gray-100 p-3 border-b border-gray-300">
            <TView label="Date" className="flex-[4] bg-red-500" />
            <TView label="Day" className="flex-[8] bg-blue-500" />
            <TView label="Night " className="flex-[8] bg-purple-500" />
            <TView label="Custom" className="flex-[8] bg-green-500" />
            <TView label="Status" className="flex-[6] bg-yellow-500" />
         </View>

         {/* Table Rows */}
         <ScrollView
            className="flex-col px-2 my-1 gap-x-2"
            onScrollBeginDrag={closeAllDropdowns}
         >
            {dates.map(renderRow)}
         </ScrollView>

         {/* Summary */}
         <View className="bg-gray-50 p-4 border-t border-gray-300">
            <Text className="text-sm font-bold text-blue-600">
               {summary.dayTotal}
            </Text>

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

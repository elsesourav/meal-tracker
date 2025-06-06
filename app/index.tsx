import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomAlert from "../components/CustomAlert";
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

   // Alert state
   const [alertVisible, setAlertVisible] = useState(false);
   const [pendingToggleKey, setPendingToggleKey] = useState<string | null>(
      null
   );

   // Info modal state
   const [infoModalVisible, setInfoModalVisible] = useState(false);

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
            setCustomChoices(["--", ...sortedValues, "OFF", "Custom"]);
         } else {
            setCustomChoices(["--", "50", "100", "OFF", "Custom"]);
         }
      } catch (error) {
         console.error("Error loading modify values:", error);
         setCustomChoices(["--", "40", "OFF", "Custom"]);
      }
   };

   // Load modify values on component mount
   useEffect(() => {
      loadModifyValues();
   }, []); // Remove customChoices from dependency to avoid infinite loop

   // Reload choices when screen comes into focus (e.g., returning from Modify screen)
   useFocusEffect(
      useCallback(() => {
         loadModifyValues();
      }, [])
   );

   const handleValueSelect = (dateKey: string, value: string) => {
      setSelectedOptions((prev) => ({
         ...prev,
         [dateKey]: {
            ...prev[dateKey],
            value: value,
            isOn: true, // Ensure isOn is true when a value is selected
         },
      }));
   };

   const handleToggle = (dateKey: string) => {
      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey];
      const nightSelected = selectedOptions[nightKey];
      const customSelected = selectedOptions[customKey];

      // Check if all columns are currently OFF
      const allColumnsOff =
         (daySelected?.value === "--" ||
            daySelected?.value === "OFF" ||
            !daySelected?.value) &&
         (nightSelected?.value === "--" ||
            nightSelected?.value === "OFF" ||
            !nightSelected?.value) &&
         (customSelected?.value === "--" ||
            customSelected?.value === "OFF" ||
            !customSelected?.value);

      // If not all columns are OFF (i.e., some have values), check for numeric values before turning OFF
      if (!allColumnsOff) {
         let hasNumericValues = false;

         // Check Day value
         if (
            daySelected?.value &&
            daySelected.value !== "--" &&
            daySelected.value !== "OFF"
         ) {
            const dayValue =
               daySelected.value === "Custom"
                  ? parseInt(customValues[dayKey] || "0")
                  : parseInt(daySelected.value || "0");
            if (dayValue > 0) hasNumericValues = true;
         }

         // Check Night value
         if (
            nightSelected?.value &&
            nightSelected.value !== "--" &&
            nightSelected.value !== "OFF"
         ) {
            const nightValue =
               nightSelected.value === "Custom"
                  ? parseInt(customValues[nightKey] || "0")
                  : parseInt(nightSelected.value || "0");
            if (nightValue > 0) hasNumericValues = true;
         }

         // Check Custom/Extra value
         if (
            customSelected?.value &&
            customSelected.value !== "--" &&
            customSelected.value !== "OFF"
         ) {
            const customValue =
               customSelected.value === "Custom"
                  ? parseInt(customValues[customKey] || "0")
                  : parseInt(customSelected.value || "0");
            if (customValue > 0) hasNumericValues = true;
         }

         // Show alert if there are numeric values
         if (hasNumericValues) {
            setPendingToggleKey(dateKey);
            setAlertVisible(true);
            return;
         }
      }

      // Proceed with toggle
      performToggle(dateKey);
   };

   const performToggle = (dateKey: string) => {
      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey];
      const nightSelected = selectedOptions[nightKey];
      const customSelected = selectedOptions[customKey];

      // Check if all columns are currently OFF
      const allColumnsOff =
         (daySelected?.value === "--" ||
            daySelected?.value === "OFF" ||
            !daySelected?.value) &&
         (nightSelected?.value === "--" ||
            nightSelected?.value === "OFF" ||
            !nightSelected?.value) &&
         (customSelected?.value === "--" ||
            customSelected?.value === "OFF" ||
            !customSelected?.value);

      if (allColumnsOff) {
         // If all are OFF, turn them ON with default values
         setSelectedOptions((prev) => ({
            ...prev,
            [dayKey]: {
               ...prev[dayKey],
               isOn: true,
               value: "--",
            },
            [nightKey]: {
               ...prev[nightKey],
               isOn: true,
               value: "--",
            },
            [customKey]: {
               ...prev[customKey],
               isOn: true,
               value: "OFF",
            },
         }));
      } else {
         // If any are ON, turn them all OFF
         setSelectedOptions((prev) => ({
            ...prev,
            [dayKey]: {
               ...prev[dayKey],
               isOn: true,
               value: "--",
            },
            [nightKey]: {
               ...prev[nightKey],
               isOn: true,
               value: "--",
            },
            [customKey]: {
               ...prev[customKey],
               isOn: true,
               value: "OFF",
            },
         }));

         // Clear custom values when turning OFF
         setCustomValues((prev) => ({
            ...prev,
            [dayKey]: "",
            [nightKey]: "",
            [customKey]: "",
         }));
      }
   };

   const handleAlertConfirm = () => {
      if (pendingToggleKey) {
         performToggle(pendingToggleKey);
         setPendingToggleKey(null);
      }
      setAlertVisible(false);
   };

   const handleAlertCancel = () => {
      setPendingToggleKey(null);
      setAlertVisible(false);
   };

   const handleInfoButtonPress = () => {
      setInfoModalVisible(true);
   };

   const closeInfoModal = () => {
      setInfoModalVisible(false);
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
            className={`flex-row py-2 mx-1 mb-2 rounded-md border-b border-gray-300 -z-20 ${
               hasNumericValue() ? "bg-green-200/20" : "bg-blue-500/5"
            }`}
         >
            {/* Date Column - flex-4 */}
            <View className="w-full flex flex-[4] justify-center items-center">
               <Text className="text-sm font-medium text-gray-800">
                  {dateInfo.date}
               </Text>
               <Text className="text-xs text-gray-500">{dateInfo.day}</Text>
               {/* add icon */}
               <View
                  className={`absolute w-8 h-9 rounded-lg -z-10 ${
                     dateInfo.date === new Date().getDate() &&
                     currentMonth.getMonth() === new Date().getMonth() &&
                     currentMonth.getFullYear() === new Date().getFullYear()
                        ? "bg-orange-200/90"
                        : "bg-blue-200/90"
                  }`}
               ></View>
            </View>

            {/* Day Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(dayKey, daySelected)}
            </View>

            {/* Night Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(nightKey, nightSelected)}
            </View>

            {/* Extra Column - flex-8 */}
            <View className="w-full flex flex-[8] justify-center ">
               {renderDropdown(customKey, customSelected)}
            </View>

            {/* Status Column - flex-6 */}
            <View className="w-full flex-[6] flex justify-center items-center">
               <TouchableOpacity
                  onPress={() => handleToggle(dateKey)}
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

         // Check Day column
         if (
            daySelected?.value &&
            daySelected.value !== "--" &&
            daySelected.value !== "OFF"
         ) {
            const value =
               daySelected.value === "Custom"
                  ? parseInt(customValues[dayKey] || "0")
                  : parseInt(daySelected.value || "0");
            if (!isNaN(value) && value > 0) {
               dayTotal += value;
               hasActivity = true;
            }
         }

         // Check Night column
         if (
            nightSelected?.value &&
            nightSelected.value !== "--" &&
            nightSelected.value !== "OFF"
         ) {
            const value =
               nightSelected.value === "Custom"
                  ? parseInt(customValues[nightKey] || "0")
                  : parseInt(nightSelected.value || "0");
            if (!isNaN(value) && value > 0) {
               nightTotal += value;
               hasActivity = true;
            }
         }

         // Check Custom/Extra column
         if (
            customSelected?.value &&
            customSelected.value !== "--" &&
            customSelected.value !== "OFF"
         ) {
            const value =
               customSelected.value === "Custom"
                  ? parseInt(customValues[customKey] || "0")
                  : parseInt(customSelected.value || "0");
            if (!isNaN(value) && value > 0) {
               customTotal += value;
               hasActivity = true;
            }
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
            <TView label="Date" className="flex-[4]" />
            <TView label="Day" className="flex-[8]" />
            <TView label="Night " className="flex-[8]" />
            <TView label="Extra" className="flex-[8]" />
            <TView label="Status" className="flex-[6]" />
         </View>

         {/* Table Rows */}
         <ScrollView
            className="flex-col px-2 my-1 gap-x-2"
            onScrollBeginDrag={closeAllDropdowns}
         >
            {dates.map(renderRow)}
         </ScrollView>

         {/* Summary */}
         <View className="bg-gray-50 p-3 border-t border-gray-300">
            <View className="flex-row">
               {/* Total Label - flex-4 */}
               <View className="flex-[4] justify-center items-center">
                  <Text className="text-sm font-bold text-gray-800">Total</Text>
               </View>

               {/* Day Total - flex-8 */}
               <View className="flex-[8] justify-center items-center">
                  <Text className="text-base font-bold text-blue-600">
                     {summary.dayTotal}
                  </Text>
               </View>

               {/* Night Total - flex-8 */}
               <View className="flex-[8] justify-center items-center">
                  <Text className="text-base font-bold text-blue-600">
                     {summary.nightTotal}
                  </Text>
               </View>

               {/* Extra Total - flex-8 */}
               <View className="flex-[8] justify-center items-center">
                  <Text className="text-base font-bold text-blue-600">
                     {summary.customTotal}
                  </Text>
               </View>

               {/* Info Icon - flex-6 */}
               <View className="flex-[6] justify-center items-center">
                  <TouchableOpacity className="p-2" onPress={handleInfoButtonPress}>
                     <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#3B82F6"
                     />
                  </TouchableOpacity>
               </View>
            </View>
         </View>

         {/* Custom Alert */}
         <CustomAlert
            visible={alertVisible}
            title="Turn Off Day"
            message="This day has data entered. Are you sure you want to turn it off? All entered values will be reset to default."
            onCancel={handleAlertCancel}
            onConfirm={handleAlertConfirm}
            type="info"
         />
      </View>
   );
}

import { useFocusEffect } from "@react-navigation/native";
import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { MealDataService } from "../services/MealDataService";
import { NotificationService } from "../services/NotificationService";
import { AsyncStorageHelper } from "../utils/AsyncStorageUtils";

interface MealOption {
   type: string;
   value: string;
   isOn: boolean;
}

interface DateInfo {
   date: number;
   day: string;
   fullDate: string;
   monthName: string;
   year: number;
}

export const useMealTracker = () => {
   const [selectedOptions, setSelectedOptions] = useState<{
      [key: string]: MealOption;
   }>({});
   const [customValues, setCustomValues] = useState<{ [key: string]: string }>(
      {}
   );
   const [dropdownStates, setDropdownStates] = useState<{
      [key: string]: boolean;
   }>({});
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const [customChoices, setCustomChoices] = useState<string[]>([]);
   const [alertVisible, setAlertVisible] = useState(false);
   const [pendingToggleKey, setPendingToggleKey] = useState<string | null>(
      null
   );
   const [infoModalVisible, setInfoModalVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // Generate dates for selected month
   const generateDates = useCallback((): DateInfo[] => {
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
   }, [currentMonth]);

   // Function to load custom values from AsyncStorage
   const loadModifyValues = useCallback(async () => {
      try {
         const savedValues = await AsyncStorageHelper.getCustomValues();
         if (savedValues) {
            const sortedValues = savedValues.sort(
               (a: string, b: string) => parseInt(a) - parseInt(b)
            );
            setCustomChoices(["--", ...sortedValues, "OFF", "Custom"]);
         } else {
            setCustomChoices(["--", "40", "60", "90", "OFF", "Custom"]);
         }
      } catch (error) {
         console.error("Error loading modify values:", error);
         setCustomChoices(["--", "40", "60", "90", "OFF", "Custom"]);
      }
   }, []);

   // Load modify values on component mount
   useEffect(() => {
      loadModifyValues();
   }, [loadModifyValues]);

   // Reload choices when screen comes into focus
   useFocusEffect(
      useCallback(() => {
         loadModifyValues();
      }, [loadModifyValues])
   );

   // Calculate summary
   const calculateSummary = (dates: DateInfo[]) => {
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
         if (daySelected?.value && daySelected.value !== "--") {
            if (daySelected.value === "OFF") {
               // Day is turned OFF - count as activity but don't add to total
               hasActivity = true;
            } else {
               const value =
                  daySelected.value === "Custom"
                     ? parseInt(customValues[dayKey] || "0")
                     : parseInt(daySelected.value || "0");
               if (!isNaN(value) && value > 0) {
                  dayTotal += value;
                  hasActivity = true;
               }
            }
         }

         // Check Night column
         if (nightSelected?.value && nightSelected.value !== "--") {
            if (nightSelected.value === "OFF") {
               // Night is turned OFF - count as activity but don't add to total
               hasActivity = true;
            } else {
               const value =
                  nightSelected.value === "Custom"
                     ? parseInt(customValues[nightKey] || "0")
                     : parseInt(nightSelected.value || "0");
               if (!isNaN(value) && value > 0) {
                  nightTotal += value;
                  hasActivity = true;
               }
            }
         }

         // Check Custom/Extra column (Extra can't be OFF, only numeric values)
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

   // Dropdown functions
   const toggleDropdown = (key: string) => {
      setDropdownStates((prev) => {
         const newStates: { [key: string]: boolean } = {};
         Object.keys(prev).forEach((k) => {
            newStates[k] = false;
         });
         newStates[key] = !prev[key];
         return newStates;
      });
   };

   const closeAllDropdowns = () => {
      setDropdownStates((prev) => {
         const newStates: { [key: string]: boolean } = {};
         Object.keys(prev).forEach((k) => {
            newStates[k] = false;
         });
         return newStates;
      });
   };

   // Event handlers
   const handleDateChange = (newDate: Date) => {
      setCurrentMonth(newDate);
   };

   const handleValueSelect = (dateKey: string, value: string) => {
      console.log("handleValueSelect called:", { dateKey, value });
      setSelectedOptions((prev) => {
         const newOptions = {
            ...prev,
            [dateKey]: {
               ...prev[dateKey],
               value: value,
               isOn: true,
            },
         };
         console.log("New selected options:", newOptions[dateKey]);
         return newOptions;
      });
   };

   const handleCustomValueChange = (dateKey: string, customValue: string) => {
      setCustomValues((prev) => ({
         ...prev,
         [dateKey]: customValue,
      }));
   };

   const handleInfoButtonPress = () => {
      setInfoModalVisible(true);
   };

   const closeInfoModal = () => {
      setInfoModalVisible(false);
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

   // Toggle logic
   const handleToggle = (dateKey: string) => {
      closeAllDropdowns();

      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey];
      const nightSelected = selectedOptions[nightKey];
      const customSelected = selectedOptions[customKey];

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

      if (!allColumnsOff) {
         let hasNumericValues = false;

         // Check for numeric values
         [daySelected, nightSelected, customSelected].forEach(
            (selected, index) => {
               const key = [dayKey, nightKey, customKey][index];
               if (
                  selected?.value &&
                  selected.value !== "--" &&
                  selected.value !== "OFF"
               ) {
                  const value =
                     selected.value === "Custom"
                        ? parseInt(customValues[key] || "0")
                        : parseInt(selected.value || "0");
                  if (value > 0) hasNumericValues = true;
               }
            }
         );

         if (hasNumericValues) {
            setPendingToggleKey(dateKey);
            setAlertVisible(true);
            return;
         }
      }

      performToggle(dateKey);
   };

   const performToggle = (dateKey: string) => {
      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey];
      const nightSelected = selectedOptions[nightKey];
      const customSelected = selectedOptions[customKey];

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
         // Turn ON with default values
         setSelectedOptions((prev) => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], isOn: true, value: "--" },
            [nightKey]: { ...prev[nightKey], isOn: true, value: "--" },
            [customKey]: { ...prev[customKey], isOn: true, value: "OFF" },
         }));
      } else {
         // Turn OFF
         setSelectedOptions((prev) => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], isOn: true, value: "--" },
            [nightKey]: { ...prev[nightKey], isOn: true, value: "--" },
            [customKey]: { ...prev[customKey], isOn: true, value: "OFF" },
         }));

         // Clear custom values
         setCustomValues((prev) => ({
            ...prev,
            [dayKey]: "",
            [nightKey]: "",
            [customKey]: "",
         }));
      }
   };

   // Export data function
   const exportData = async (): Promise<boolean> => {
      try {
         await MealDataService.exportData();
         return true;
      } catch (error) {
         console.error("Export failed:", error);
         return false;
      }
   };

   // Import data function
   const importData = async (): Promise<boolean> => {
      try {
         const success = await MealDataService.importData();
         return success;
      } catch (error) {
         console.error("Import failed:", error);
         return false;
      }
   };

   // Simple save function - saves all current data
   const saveData = useCallback(async () => {
      if (Object.keys(selectedOptions).length === 0) {
         console.log("No data to save");
         return;
      }

      try {
         console.log("Saving data...");
         await MealDataService.saveAllCurrentData(
            selectedOptions,
            customValues
         );
         console.log("✅ Data saved successfully");

         // Check if today's data has been filled and cancel notifications if needed
         await NotificationService.checkTodayDataAndCancelIfNeeded();
      } catch (error) {
         console.error("❌ Save failed:", error);
      }
   }, [selectedOptions, customValues]);

   // Load data when month changes
   useEffect(() => {
      const loadDataForMonth = async () => {
         setIsLoading(true);
         try {
            // Load custom choices first
            await loadModifyValues();

            // Load all meal data
            const allMealData = await MealDataService.loadAllMealData();
            const dates = generateDates();
            const newSelectedOptions: { [key: string]: MealOption } = {};
            const newCustomValues: { [key: string]: string } = {};

            // Get current custom choices
            const savedChoicesData = await AsyncStorageHelper.getCustomValues();

            const currentChoices = savedChoicesData
               ? [
                    "--",
                    ...savedChoicesData.sort(
                       (a: string, b: string) => parseInt(a) - parseInt(b)
                    ),
                    "OFF",
                    "Custom",
                 ]
               : ["--", "50", "100", "150", "200", "OFF", "Custom"];

            // Process all dates
            for (const dateInfo of dates) {
               const dayKey = `${dateInfo.fullDate}-day`;
               const nightKey = `${dateInfo.fullDate}-night`;
               const customKey = `${dateInfo.fullDate}-custom`;

               // Set default values
               newSelectedOptions[dayKey] = {
                  type: "day",
                  value: "--",
                  isOn: true,
               };
               newSelectedOptions[nightKey] = {
                  type: "night",
                  value: "--",
                  isOn: true,
               };
               newSelectedOptions[customKey] = {
                  type: "custom",
                  value: "OFF",
                  isOn: true,
               };

               // Load saved data if it exists
               const [day, month, year] = dateInfo.fullDate.split("/");
               const savedData = allMealData[year]?.[month]?.[day];

               if (savedData) {
                  // Process day value
                  if (savedData.day === -1) {
                     // Day is set to "OFF"
                     newSelectedOptions[dayKey] = {
                        type: "day",
                        value: "OFF",
                        isOn: true,
                     };
                  } else if (savedData.day > 0) {
                     const dayValue = savedData.day.toString();
                     if (currentChoices.includes(dayValue)) {
                        newSelectedOptions[dayKey] = {
                           type: "day",
                           value: dayValue,
                           isOn: true,
                        };
                     } else {
                        newSelectedOptions[dayKey] = {
                           type: "day",
                           value: "Custom",
                           isOn: true,
                        };
                        newCustomValues[dayKey] = dayValue;
                     }
                  }

                  // Process night value
                  if (savedData.night === -1) {
                     // Night is set to "OFF"
                     newSelectedOptions[nightKey] = {
                        type: "night",
                        value: "OFF",
                        isOn: true,
                     };
                  } else if (savedData.night > 0) {
                     const nightValue = savedData.night.toString();
                     if (currentChoices.includes(nightValue)) {
                        newSelectedOptions[nightKey] = {
                           type: "night",
                           value: nightValue,
                           isOn: true,
                        };
                     } else {
                        newSelectedOptions[nightKey] = {
                           type: "night",
                           value: "Custom",
                           isOn: true,
                        };
                        newCustomValues[nightKey] = nightValue;
                     }
                  }

                  // Process extra value
                  if (savedData.extra > 0) {
                     const extraValue = savedData.extra.toString();
                     if (currentChoices.includes(extraValue)) {
                        newSelectedOptions[customKey] = {
                           type: "custom",
                           value: extraValue,
                           isOn: true,
                        };
                     } else {
                        newSelectedOptions[customKey] = {
                           type: "custom",
                           value: "Custom",
                           isOn: true,
                        };
                        newCustomValues[customKey] = extraValue;
                     }
                  }
               }
            }

            setSelectedOptions(newSelectedOptions);
            setCustomValues(newCustomValues);
            console.log("✅ Data loaded for month");
         } catch (error) {
            console.error("Error loading data:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadDataForMonth();
   }, [currentMonth, generateDates, loadModifyValues]);

   const clearAllData = useCallback(async () => {
      try {
         console.log("🗑️ Clearing all data...");

         await MealDataService.clearAllData();
         console.log("✅ Storage cleared");
         await Updates.reloadAsync();

         return true;
      } catch (error) {
         console.error("❌ Error clearing data:", error);
         throw error;
      }
   }, []);

   // Save data when app goes to background
   useEffect(() => {
      const handleAppStateChange = (nextAppState: string) => {
         if (nextAppState === "background" || nextAppState === "inactive") {
            console.log("App going to background, saving data...");
            saveData();
         }
      };

      const subscription = AppState.addEventListener(
         "change",
         handleAppStateChange
      );
      return () => subscription?.remove();
   }, [saveData]);

   return {
      // State
      selectedOptions,
      customValues,
      dropdownStates,
      currentMonth,
      customChoices,
      alertVisible,
      infoModalVisible,
      isLoading,

      // Functions
      generateDates,
      calculateSummary,
      toggleDropdown,
      closeAllDropdowns,
      handleDateChange,
      handleValueSelect,
      handleCustomValueChange,
      handleToggle,
      handleInfoButtonPress,
      closeInfoModal,
      handleAlertConfirm,
      handleAlertCancel,
      exportData,
      importData,
      saveData,
      clearAllData,
   };
};

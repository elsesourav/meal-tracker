import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { MealDataService } from "../services/MealDataService";

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
   }, []);

   // Reload choices when screen comes into focus
   useFocusEffect(
      useCallback(() => {
         loadModifyValues();
      }, [])
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
         if (success) {
            // Reload data after import
            await loadModifyValues();
            // Could add additional state refresh here if needed
         }
         return success;
      } catch (error) {
         console.error("Import failed:", error);
         return false;
      }
   };

   // Load saved data when component mounts or month changes
   useEffect(() => {
      const loadSavedData = async () => {
         setIsLoading(true);
         try {
            // Load custom choices first
            await loadModifyValues();

            const dates = generateDates();
            const newSelectedOptions: { [key: string]: MealOption } = {};
            const newCustomValues: { [key: string]: string } = {};

            // Get current custom choices
            const savedChoicesData = await AsyncStorage.getItem(
               "@meal_tracker_custom_values"
            );
            const currentChoices = savedChoicesData
               ? [
                    "--",
                    ...JSON.parse(savedChoicesData).sort(
                       (a: string, b: string) => parseInt(a) - parseInt(b)
                    ),
                    "OFF",
                    "Custom",
                 ]
               : ["--", "50", "100", "OFF", "Custom"];

            // Initialize all dates with default values first
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

               // Then load saved data if it exists
               const savedData = await MealDataService.loadMealData(
                  dateInfo.fullDate
               );
               if (savedData) {
                  // Override with saved values if they exist
                  if (savedData.day > 0) {
                     const dayValue = savedData.day.toString();
                     // Check if the value exists in choices, otherwise use "Custom" and set custom value
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
                  if (savedData.night > 0) {
                     const nightValue = savedData.night.toString();
                     // Check if the value exists in choices, otherwise use "Custom" and set custom value
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
                  if (savedData.extra > 0) {
                     const extraValue = savedData.extra.toString();
                     // Check if the value exists in choices, otherwise use "Custom" and set custom value
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
         } catch (error) {
            console.error("Error loading saved data:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadSavedData();
   }, [currentMonth, generateDates]); // Removed customChoices dependency

   // Auto-save whenever selectedOptions or customValues change
   useEffect(() => {
      // Don't auto-save during initial loading
      if (isLoading) {
         console.log("Skipping auto-save: still loading");
         return;
      }

      // Don't auto-save if there are no options (initial state)
      if (Object.keys(selectedOptions).length === 0) {
         console.log("Skipping auto-save: no options to save");
         return;
      }

      console.log(
         "Auto-save effect triggered. selectedOptions count:",
         Object.keys(selectedOptions).length
      );

      const saveChanges = async () => {
         console.log("Starting auto-save...");
         // Get all unique date keys from selectedOptions
         const dateKeys = new Set<string>();
         Object.keys(selectedOptions).forEach((key) => {
            console.log("Processing key:", key);
            if (key.includes("-")) {
               const parts = key.split("-");
               console.log("Key parts:", parts);
               if (parts.length >= 2) {
                  // Key format is like "1/6/2025-night", so we want the first part
                  const baseDateKey = parts[0];
                  dateKeys.add(baseDateKey);
                  console.log("Added date key:", baseDateKey);
               }
            }
         });

         console.log("Dates to save:", Array.from(dateKeys));

         // Save data for each date
         for (const dateKey of dateKeys) {
            try {
               const mealData = MealDataService.convertToMealData(
                  dateKey,
                  selectedOptions,
                  customValues
               );
               console.log(`Saving data for ${dateKey}:`, mealData);

               // Only save if there's actual data (not all zeros)
               if (
                  mealData.day > 0 ||
                  mealData.night > 0 ||
                  mealData.extra > 0
               ) {
                  await MealDataService.saveMealData(dateKey, mealData);
                  console.log(`Saved data for ${dateKey}`);
               } else {
                  // If all values are zero, delete the entry
                  await MealDataService.deleteMealData(dateKey);
                  console.log(`Deleted empty data for ${dateKey}`);
               }
            } catch (error) {
               console.error("Auto-save failed for date", dateKey, ":", error);
            }
         }
         console.log("Auto-save completed");
      };

      // Debounce the save operation
      const timeoutId = setTimeout(saveChanges, 500); // Reduced from 2000 to 500ms
      return () => {
         console.log("Auto-save timeout cleared");
         clearTimeout(timeoutId);
      };
   }, [selectedOptions, customValues, isLoading]);

   // Manual save function for immediate saving
   const manualSave = useCallback(async () => {
      console.log("Manual save triggered");
      if (Object.keys(selectedOptions).length === 0) {
         console.log("No data to save");
         return;
      }

      try {
         const dateKeys = new Set<string>();
         Object.keys(selectedOptions).forEach((key) => {
            if (key.includes("-")) {
               const parts = key.split("-");
               if (parts.length >= 2) {
                  // Key format is like "1/6/2025-night", so we want the first part
                  const baseDateKey = parts[0];
                  dateKeys.add(baseDateKey);
               }
            }
         });

         for (const dateKey of dateKeys) {
            const mealData = MealDataService.convertToMealData(
               dateKey,
               selectedOptions,
               customValues
            );

            if (mealData.day > 0 || mealData.night > 0 || mealData.extra > 0) {
               await MealDataService.saveMealData(dateKey, mealData);
               console.log(`Manually saved data for ${dateKey}:`, mealData);
            }
         }
         console.log("Manual save completed");
      } catch (error) {
         console.error("Manual save failed:", error);
      }
   }, [selectedOptions, customValues]);

   // Save data when app goes to background
   useEffect(() => {
      const handleAppStateChange = (nextAppState: string) => {
         if (nextAppState === "background" || nextAppState === "inactive") {
            console.log("App going to background, saving data...");
            manualSave();
         }
      };

      const subscription = AppState.addEventListener(
         "change",
         handleAppStateChange
      );

      return () => subscription?.remove();
   }, [manualSave]);

   return {
      // State
      selectedOptions,
      customValues,
      dropdownStates,
      currentMonth,
      customChoices,
      alertVisible,
      infoModalVisible,

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
      manualSave,
   };
};

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { AsyncStorageHelper } from "../utils/AsyncStorageUtils";

interface MealData {
   day: number;
   night: number;
   extra: number;
}

interface MonthData {
   [day: string]: MealData;
}

interface YearData {
   [month: string]: MonthData;
}

interface SavedMealData {
   [year: string]: YearData;
}

interface LegacyData {
   [dateKey: string]: MealData;
}

interface ExportData {
   version: string;
   exportDate: string;
   data: SavedMealData | LegacyData;
   customChoices: string[];
}

export class MealDataService {
   // Helper function to convert date string (1/6/2025) to { year, month, day }
   private static parseDateKey(dateKey: string): {
      year: string;
      month: string;
      day: string;
   } {
      const [day, month, year] = dateKey.split("/");
      return { year, month, day };
   }

   // Helper function to restructure flat data to hierarchical format
   private static restructureData(flatData: LegacyData): SavedMealData {
      const structuredData: SavedMealData = {};

      Object.entries(flatData).forEach(([dateKey, mealData]) => {
         const { year, month, day } = this.parseDateKey(dateKey);

         if (!structuredData[year]) {
            structuredData[year] = {};
         }
         if (!structuredData[year][month]) {
            structuredData[year][month] = {};
         }
         structuredData[year][month][day] = mealData;
      });

      return structuredData;
   }

   // Helper function to flatten hierarchical data
   private static flattenData(structuredData: SavedMealData): LegacyData {
      const flatData: LegacyData = {};

      Object.entries(structuredData).forEach(([year, yearData]) => {
         Object.entries(yearData).forEach(([month, monthData]) => {
            Object.entries(monthData).forEach(([day, mealData]) => {
               flatData[`${day}/${month}/${year}`] = mealData;
            });
         });
      });

      return flatData;
   }

   // Simple save method - saves all current data at once
   static async saveAllCurrentData(
      selectedOptions: {
         [key: string]: { type: string; value: string; isOn: boolean };
      },
      customValues: { [key: string]: string }
   ): Promise<void> {
      try {
         const existingData = await this.loadAllMealData();

         // Extract all unique date keys from selected options
         const dateKeys = new Set<string>();
         Object.keys(selectedOptions).forEach((key) => {
            if (key.includes("-")) {
               const datePart = key.split("-")[0];
               dateKeys.add(datePart);
            }
         });

         // Process each date
         for (const dateKey of dateKeys) {
            const dayKey = `${dateKey}-day`;
            const nightKey = `${dateKey}-night`;
            const customKey = `${dateKey}-custom`;

            const daySelected = selectedOptions[dayKey];
            const nightSelected = selectedOptions[nightKey];
            const customSelected = selectedOptions[customKey];

            let day = 0,
               night = 0,
               extra = 0;

            // Process day value
            if (
               daySelected?.value &&
               daySelected.value !== "--" &&
               daySelected.value !== "OFF"
            ) {
               const value =
                  daySelected.value === "Custom"
                     ? parseInt(customValues[dayKey] || "0")
                     : parseInt(daySelected.value || "0");
               if (!isNaN(value)) day = value;
            }

            // Process night value
            if (
               nightSelected?.value &&
               nightSelected.value !== "--" &&
               nightSelected.value !== "OFF"
            ) {
               const value =
                  nightSelected.value === "Custom"
                     ? parseInt(customValues[nightKey] || "0")
                     : parseInt(nightSelected.value || "0");
               if (!isNaN(value)) night = value;
            }

            // Process custom/extra value
            if (
               customSelected?.value &&
               customSelected.value !== "--" &&
               customSelected.value !== "OFF"
            ) {
               const value =
                  customSelected.value === "Custom"
                     ? parseInt(customValues[customKey] || "0")
                     : parseInt(customSelected.value || "0");
               if (!isNaN(value)) extra = value;
            }

            // Save or delete based on whether there's any data
            const { year, month, day: dayNum } = this.parseDateKey(dateKey);

            if (day > 0 || night > 0 || extra > 0) {
               // Save data
               if (!existingData[year]) existingData[year] = {};
               if (!existingData[year][month]) existingData[year][month] = {};
               existingData[year][month][dayNum] = { day, night, extra };
            } else {
               // Remove data if all values are zero
               if (existingData[year]?.[month]?.[dayNum]) {
                  delete existingData[year][month][dayNum];

                  // Cleanup empty objects
                  if (Object.keys(existingData[year][month]).length === 0) {
                     delete existingData[year][month];
                  }
                  if (Object.keys(existingData[year]).length === 0) {
                     delete existingData[year];
                  }
               }
            }
         }

         await AsyncStorageHelper.setMealData(existingData);
      } catch (error) {
         console.error("Error saving meal data:", error);
         throw error;
      }
   }

   // Load all meal data
   static async loadAllMealData(): Promise<SavedMealData> {
      try {
         const data = await AsyncStorageHelper.getMealData();
         if (!data) return {};

         // Check if the data is in old format (flat) and convert if needed
         const firstKey = Object.keys(data)[0];
         if (firstKey && firstKey.includes("/")) {
            return this.restructureData(data as LegacyData);
         }

         return data as SavedMealData;
      } catch (error) {
         console.error("Error loading meal data:", error);
         return {};
      }
   }

   // Load meal data for a specific date
   static async loadMealData(dateKey: string): Promise<MealData | null> {
      try {
         const { year, month, day } = this.parseDateKey(dateKey);
         const allData = await this.loadAllMealData();
         return allData[year]?.[month]?.[day] || null;
      } catch (error) {
         console.error("Error loading meal data for date:", error);
         return null;
      }
   }

   // Delete meal data for specific dates
   static async deleteMealData(dateKeys: string[]): Promise<void> {
      try {
         const existingData = await this.loadAllMealData();

         dateKeys.forEach((dateKey) => {
            const { year, month, day } = this.parseDateKey(dateKey);
            if (existingData[year]?.[month]?.[day]) {
               delete existingData[year][month][day];

               // Cleanup empty objects
               if (Object.keys(existingData[year][month]).length === 0) {
                  delete existingData[year][month];
               }
               if (Object.keys(existingData[year]).length === 0) {
                  delete existingData[year];
               }
            }
         });

         await AsyncStorageHelper.setMealData(existingData);
      } catch (error) {
         console.error("Error deleting meal data:", error);
         throw error;
      }
   }

   // Clear all meal data (preserves custom choices)
   static async clearAllData(): Promise<void> {
      try {
         await AsyncStorageHelper.clearAllMealTrackerData();
         console.log("✅ All meal data cleared from storage");
         return;
      } catch (error) {
         console.error("Error clearing meal data:", error);
         throw error;
      }
   }

   // Export data function (handles both old and new formats)
   static async exportData(): Promise<string | null> {
      try {
         const mealData = await this.loadAllMealData();
         const customChoices =
            (await AsyncStorageHelper.getCustomValues()) || [];

         const exportData: ExportData = {
            version: "2.0", // Updated version to indicate new data structure
            exportDate: new Date().toISOString(),
            data: mealData,
            customChoices: customChoices,
         };

         const fileName = `meal_tracker_export_${
            new Date().toISOString().split("T")[0]
         }.json`;
         const fileUri = FileSystem.documentDirectory + fileName;

         await FileSystem.writeAsStringAsync(
            fileUri,
            JSON.stringify(exportData, null, 2),
            { encoding: FileSystem.EncodingType.UTF8 }
         );

         if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
               mimeType: "application/json",
               dialogTitle: "Export Meal Tracker Data",
            });
         }

         return fileUri;
      } catch (error) {
         console.error("Error exporting data:", error);
         throw error;
      }
   }

   // Import data function (handles both old and new formats)
   static async importData(): Promise<boolean> {
      try {
         const result = await DocumentPicker.getDocumentAsync({
            type: "application/json",
            copyToCacheDirectory: true,
         });

         if (result.canceled) {
            return false;
         }

         const fileUri = result.assets[0].uri;
         const fileContent = await FileSystem.readAsStringAsync(fileUri);
         const importData: ExportData = JSON.parse(fileContent);

         // Validate the import data structure
         if (!importData.version || !importData.data) {
            throw new Error("Invalid file format");
         }

         let dataToSave: SavedMealData;

         // Handle different versions
         if (importData.version === "1.0") {
            dataToSave = this.restructureData(importData.data as LegacyData);
         } else {
            dataToSave = importData.data as SavedMealData;
         }

         // Save imported meal data
         await AsyncStorageHelper.setMealData(dataToSave);

         // Save imported custom choices if available
         if (importData.customChoices) {
            await AsyncStorageHelper.setCustomValues(importData.customChoices);
         }

         return true;
      } catch (error) {
         console.error("Error importing data:", error);
         throw error;
      }
   }

   // Get data statistics
   static async getDataStatistics(): Promise<{
      totalDays: number;
      totalAmount: number;
      dayTotal: number;
      nightTotal: number;
      extraTotal: number;
   }> {
      try {
         const allData = await this.loadAllMealData();
         let totalDays = 0;
         let totalAmount = 0;
         let dayTotal = 0;
         let nightTotal = 0;
         let extraTotal = 0;

         Object.values(allData).forEach((yearData) => {
            Object.values(yearData).forEach((monthData) => {
               Object.values(monthData).forEach((data) => {
                  if (data.day > 0 || data.night > 0 || data.extra > 0) {
                     totalDays++;
                  }
                  dayTotal += data.day;
                  nightTotal += data.night;
                  extraTotal += data.extra;
                  totalAmount += data.day + data.night + data.extra;
               });
            });
         });

         return {
            totalDays,
            totalAmount,
            dayTotal,
            nightTotal,
            extraTotal,
         };
      } catch (error) {
         console.error("Error getting statistics:", error);
         return {
            totalDays: 0,
            totalAmount: 0,
            dayTotal: 0,
            nightTotal: 0,
            extraTotal: 0,
         };
      }
   }

   // Get current month statistics
   static async getCurrentMonthStatistics(): Promise<{
      totalDays: number;
      totalAmount: number;
      dayTotal: number;
      nightTotal: number;
      extraTotal: number;
      monthName: string;
      year: number;
   }> {
      try {
         const allData = await this.loadAllMealData();
         const now = new Date();
         const currentMonth = (now.getMonth() + 1).toString(); // 1-based month
         const currentYear = now.getFullYear().toString();

         let totalDays = 0;
         let totalAmount = 0;
         let dayTotal = 0;
         let nightTotal = 0;
         let extraTotal = 0;

         const yearData = allData[currentYear];
         if (yearData?.[currentMonth]) {
            Object.values(yearData[currentMonth]).forEach((data) => {
               if (data.day > 0 || data.night > 0 || data.extra > 0) {
                  totalDays++;
               }
               dayTotal += data.day;
               nightTotal += data.night;
               extraTotal += data.extra;
               totalAmount += data.day + data.night + data.extra;
            });
         }

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

         return {
            totalDays,
            totalAmount,
            dayTotal,
            nightTotal,
            extraTotal,
            monthName: monthNames[parseInt(currentMonth) - 1],
            year: parseInt(currentYear),
         };
      } catch (error) {
         console.error("Error getting current month statistics:", error);
         return {
            totalDays: 0,
            totalAmount: 0,
            dayTotal: 0,
            nightTotal: 0,
            extraTotal: 0,
            monthName: "Unknown",
            year: new Date().getFullYear(),
         };
      }
   }
}

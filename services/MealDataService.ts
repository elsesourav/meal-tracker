import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface MealData {
   day: number;
   night: number;
   extra: number;
}

interface SavedMealData {
   [dateKey: string]: MealData;
}

interface ExportData {
   version: string;
   exportDate: string;
   data: SavedMealData;
   customChoices: string[];
}

const STORAGE_KEY = "@meal_tracker_data";
const CUSTOM_CHOICES_KEY = "@meal_tracker_custom_values";

export class MealDataService {
   // Save meal data for a specific date
   static async saveMealData(dateKey: string, data: MealData): Promise<void> {
      try {
         const existingData = await this.loadAllMealData();
         existingData[dateKey] = data;
         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      } catch (error) {
         console.error("Error saving meal data:", error);
         throw error;
      }
   }

   // Load all meal data
   static async loadAllMealData(): Promise<SavedMealData> {
      try {
         const data = await AsyncStorage.getItem(STORAGE_KEY);
         return data ? JSON.parse(data) : {};
      } catch (error) {
         console.error("Error loading meal data:", error);
         return {};
      }
   }

   // Load meal data for a specific date
   static async loadMealData(dateKey: string): Promise<MealData | null> {
      try {
         const allData = await this.loadAllMealData();
         return allData[dateKey] || null;
      } catch (error) {
         console.error("Error loading meal data for date:", error);
         return null;
      }
   }

   // Delete meal data for a specific date
   static async deleteMealData(dateKey: string): Promise<void> {
      try {
         const existingData = await this.loadAllMealData();
         delete existingData[dateKey];
         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      } catch (error) {
         console.error("Error deleting meal data:", error);
         throw error;
      }
   }

   // Convert selected options and custom values to MealData format
   static convertToMealData(
      dateKey: string,
      selectedOptions: { [key: string]: any },
      customValues: { [key: string]: string }
   ): MealData {
      const dayKey = `${dateKey}-day`;
      const nightKey = `${dateKey}-night`;
      const customKey = `${dateKey}-custom`;

      const daySelected = selectedOptions[dayKey];
      const nightSelected = selectedOptions[nightKey];
      const customSelected = selectedOptions[customKey];

      // Get day value
      let dayValue = 0;
      if (
         daySelected?.value &&
         daySelected.value !== "--" &&
         daySelected.value !== "OFF"
      ) {
         dayValue =
            daySelected.value === "Custom"
               ? parseInt(customValues[dayKey] || "0")
               : parseInt(daySelected.value || "0");
         if (isNaN(dayValue)) dayValue = 0;
      }

      // Get night value
      let nightValue = 0;
      if (
         nightSelected?.value &&
         nightSelected.value !== "--" &&
         nightSelected.value !== "OFF"
      ) {
         nightValue =
            nightSelected.value === "Custom"
               ? parseInt(customValues[nightKey] || "0")
               : parseInt(nightSelected.value || "0");
         if (isNaN(nightValue)) nightValue = 0;
      }

      // Get extra value
      let extraValue = 0;
      if (
         customSelected?.value &&
         customSelected.value !== "--" &&
         customSelected.value !== "OFF"
      ) {
         extraValue =
            customSelected.value === "Custom"
               ? parseInt(customValues[customKey] || "0")
               : parseInt(customSelected.value || "0");
         if (isNaN(extraValue)) extraValue = 0;
      }

      return {
         day: dayValue,
         night: nightValue,
         extra: extraValue,
      };
   }

   // Export all data to JSON file
   static async exportData(): Promise<string | null> {
      try {
         const mealData = await this.loadAllMealData();
         const customChoicesData = await AsyncStorage.getItem(
            CUSTOM_CHOICES_KEY
         );
         const customChoices = customChoicesData
            ? JSON.parse(customChoicesData)
            : [];

         const exportData: ExportData = {
            version: "1.0",
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

         // Share the file
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

   // Import data from JSON file
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

         // Save imported meal data
         await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(importData.data)
         );

         // Save imported custom choices if available
         if (importData.customChoices) {
            await AsyncStorage.setItem(
               CUSTOM_CHOICES_KEY,
               JSON.stringify(importData.customChoices)
            );
         }

         return true;
      } catch (error) {
         console.error("Error importing data:", error);
         throw error;
      }
   }

   // Clear all data
   static async clearAllData(): Promise<void> {
      try {
         await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (error) {
         console.error("Error clearing data:", error);
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

         Object.values(allData).forEach((data) => {
            if (data.day > 0 || data.night > 0 || data.extra > 0) {
               totalDays++;
            }
            dayTotal += data.day;
            nightTotal += data.night;
            extraTotal += data.extra;
            totalAmount += data.day + data.night + data.extra;
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
}

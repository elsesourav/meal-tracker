// Debug script to test clearAllData functionality
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@meal_tracker_data";
const CUSTOM_CHOICES_KEY = "@meal_tracker_custom_values";

// Test data clearing
async function testClearData() {
   console.log("🔍 Testing clearAllData functionality...");

   try {
      // First, let's see what data exists before clearing
      console.log("\n📊 Current data before clearing:");
      const mealData = await AsyncStorage.getItem(STORAGE_KEY);
      const customData = await AsyncStorage.getItem(CUSTOM_CHOICES_KEY);

      console.log("Meal data exists:", mealData ? "YES" : "NO");
      if (mealData) {
         const parsed = JSON.parse(mealData);
         console.log("Meal data keys:", Object.keys(parsed).length);
         console.log("Sample keys:", Object.keys(parsed).slice(0, 3));
      }

      console.log("Custom choices exist:", customData ? "YES" : "NO");
      if (customData) {
         const parsed = JSON.parse(customData);
         console.log("Custom choices:", parsed);
      }

      // Clear all data
      console.log("\n🗑️ Clearing all data...");
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(CUSTOM_CHOICES_KEY);
      console.log("✅ Clear operations completed");

      // Verify data is cleared
      console.log("\n🔍 Verifying data is cleared:");
      const mealDataAfter = await AsyncStorage.getItem(STORAGE_KEY);
      const customDataAfter = await AsyncStorage.getItem(CUSTOM_CHOICES_KEY);

      console.log(
         "Meal data after clear:",
         mealDataAfter ? "STILL EXISTS!" : "Cleared ✅"
      );
      console.log(
         "Custom data after clear:",
         customDataAfter ? "STILL EXISTS!" : "Cleared ✅"
      );

      // List all AsyncStorage keys to see what's there
      console.log("\n📋 All AsyncStorage keys:");
      const allKeys = await AsyncStorage.getAllKeys();
      const relevantKeys = allKeys.filter(
         (key) =>
            key.includes("meal") ||
            key.includes("tracker") ||
            key.includes("custom")
      );
      console.log("Relevant keys found:", relevantKeys);
   } catch (error) {
      console.error("❌ Error during test:", error);
   }
}

export { testClearData };

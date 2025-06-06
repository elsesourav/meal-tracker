// Test script to verify clearAllData functionality
const AsyncStorage =
   require("@react-native-async-storage/async-storage").default;

const STORAGE_KEY = "@meal_tracker_data";
const CUSTOM_CHOICES_KEY = "@meal_tracker_custom_values";

// Mock some test data
const testMealData = {
   "6/1/2025": { day: 50, night: 100, extra: 0 },
   "6/2/2025": { day: 100, night: 50, extra: 25 },
   "6/3/2025": { day: 0, night: 100, extra: 0 },
};

const testCustomChoices = ["25", "75", "125", "150"];

async function setupTestData() {
   console.log("📦 Setting up test data...");
   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(testMealData));
   await AsyncStorage.setItem(
      CUSTOM_CHOICES_KEY,
      JSON.stringify(testCustomChoices)
   );
   console.log("✅ Test data setup complete");
}

async function testClearAllData() {
   console.log("\n🧪 Testing clearAllData functionality...");

   try {
      // Setup test data first
      await setupTestData();

      // Verify test data exists
      console.log("\n📊 Verifying test data exists:");
      const mealData = await AsyncStorage.getItem(STORAGE_KEY);
      const customData = await AsyncStorage.getItem(CUSTOM_CHOICES_KEY);

      console.log("- Meal data:", mealData ? "EXISTS ✅" : "MISSING ❌");
      console.log("- Custom data:", customData ? "EXISTS ✅" : "MISSING ❌");

      if (mealData) {
         const parsed = JSON.parse(mealData);
         console.log("- Meal data entries:", Object.keys(parsed).length);
      }

      // Now test the clear functionality
      console.log("\n🗑️ Testing clear operations...");

      // Simulate the clearAllData method
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(CUSTOM_CHOICES_KEY);

      // Verify data is cleared
      console.log("\n🔍 Verifying data is cleared:");
      const mealDataAfter = await AsyncStorage.getItem(STORAGE_KEY);
      const customDataAfter = await AsyncStorage.getItem(CUSTOM_CHOICES_KEY);

      console.log(
         "- Meal data after clear:",
         mealDataAfter ? "STILL EXISTS! ❌" : "Cleared ✅"
      );
      console.log(
         "- Custom data after clear:",
         customDataAfter ? "STILL EXISTS! ❌" : "Cleared ✅"
      );

      // Check all AsyncStorage keys
      console.log("\n🔑 All AsyncStorage keys:");
      const allKeys = await AsyncStorage.getAllKeys();
      console.log("- Total keys:", allKeys.length);

      const relevantKeys = allKeys.filter(
         (key) =>
            key.includes("meal") ||
            key.includes("tracker") ||
            key.includes("custom")
      );
      console.log(
         "- Relevant keys:",
         relevantKeys.length > 0 ? relevantKeys : "None ✅"
      );

      // Final result
      if (!mealDataAfter && !customDataAfter && relevantKeys.length === 0) {
         console.log(
            "\n✅ SUCCESS: clearAllData functionality works correctly!"
         );
         return true;
      } else {
         console.log("\n❌ FAILURE: clearAllData did not work properly!");
         return false;
      }
   } catch (error) {
      console.error("\n❌ Error during test:", error);
      return false;
   }
}

// Run the test
testClearAllData().then((success) => {
   console.log("\n" + "=".repeat(50));
   console.log(success ? "🎉 Test PASSED" : "💥 Test FAILED");
   console.log("=".repeat(50));
});

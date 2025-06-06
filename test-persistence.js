// Test script to verify data persistence
const AsyncStorage = require("@react-native-async-storage/async-storage");

// Mock AsyncStorage for testing
const mockStorage = {};

const MockAsyncStorage = {
   setItem: async (key, value) => {
      mockStorage[key] = value;
      console.log(`[MOCK] Set ${key}: ${value}`);
      return Promise.resolve();
   },
   getItem: async (key) => {
      const value = mockStorage[key] || null;
      console.log(`[MOCK] Get ${key}: ${value}`);
      return Promise.resolve(value);
   },
   removeItem: async (key) => {
      delete mockStorage[key];
      console.log(`[MOCK] Removed ${key}`);
      return Promise.resolve();
   },
   clear: async () => {
      Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      console.log(`[MOCK] Cleared all storage`);
      return Promise.resolve();
   },
};

class TestMealDataService {
   static STORAGE_KEY = "@meal_tracker_data";

   static async saveMealData(dateKey, data) {
      try {
         const existingData = await this.loadAllMealData();
         existingData[dateKey] = data;
         await MockAsyncStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(existingData)
         );
         console.log(`✅ Saved data for ${dateKey}:`, data);
      } catch (error) {
         console.error("❌ Error saving meal data:", error);
         throw error;
      }
   }

   static async loadAllMealData() {
      try {
         const data = await MockAsyncStorage.getItem(this.STORAGE_KEY);
         return data ? JSON.parse(data) : {};
      } catch (error) {
         console.error("❌ Error loading meal data:", error);
         return {};
      }
   }

   static async loadMealData(dateKey) {
      try {
         const allData = await this.loadAllMealData();
         return allData[dateKey] || null;
      } catch (error) {
         console.error("❌ Error loading meal data for date:", error);
         return null;
      }
   }
}

// Test the data persistence
async function testDataPersistence() {
   console.log("🧪 Testing Data Persistence...\n");

   // Test 1: Save data
   console.log("📝 Test 1: Save meal data");
   const testData = { day: 100, night: 50, extra: 25 };
   await TestMealDataService.saveMealData("2025/6/6", testData);

   // Test 2: Load data
   console.log("\n📖 Test 2: Load meal data");
   const loadedData = await TestMealDataService.loadMealData("2025/6/6");
   console.log("Loaded data:", loadedData);

   // Test 3: Verify data matches
   console.log("\n✅ Test 3: Verify data integrity");
   const dataMatches = JSON.stringify(testData) === JSON.stringify(loadedData);
   console.log("Data matches:", dataMatches ? "✅ YES" : "❌ NO");

   // Test 4: Save multiple dates
   console.log("\n📝 Test 4: Save multiple dates");
   await TestMealDataService.saveMealData("2025/6/7", {
      day: 75,
      night: 25,
      extra: 0,
   });
   await TestMealDataService.saveMealData("2025/6/8", {
      day: 0,
      night: 100,
      extra: 50,
   });

   // Test 5: Load all data
   console.log("\n📖 Test 5: Load all data");
   const allData = await TestMealDataService.loadAllMealData();
   console.log("All data:", JSON.stringify(allData, null, 2));

   console.log("\n🎉 Data persistence tests completed!");
}

// Run the test
testDataPersistence().catch(console.error);

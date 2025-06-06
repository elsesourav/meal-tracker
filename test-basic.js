// Basic test to verify the MealDataService functionality
const { MealDataService } = require("./services/MealDataService.ts");

// Test the data conversion
const testData = {
   selectedOptions: {
      "1/6/2025-day": { type: "day", value: "50", isOn: true },
      "1/6/2025-night": { type: "night", value: "100", isOn: true },
      "1/6/2025-custom": { type: "custom", value: "OFF", isOn: true },
   },
   customValues: {},
};

console.log("Testing MealDataService.convertToMealData...");
try {
   const result = MealDataService.convertToMealData(
      "1/6/2025",
      testData.selectedOptions,
      testData.customValues
   );
   console.log("Result:", result);
   console.log("Expected: { day: 50, night: 100, extra: 0 }");
} catch (error) {
   console.error("Error:", error);
}

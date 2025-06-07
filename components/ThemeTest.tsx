import React, { useEffect, useState } from "react";
import { Appearance, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const ThemeTest: React.FC = () => {
   const { themeMode, currentTheme } = useTheme();
   const [systemTheme, setSystemTheme] = useState(Appearance.getColorScheme());
   const [changeCount, setChangeCount] = useState(0);
   const [lastChangeTime, setLastChangeTime] = useState<string>("");

   useEffect(() => {
      // Set initial system theme
      const initialTheme = Appearance.getColorScheme();
      setSystemTheme(initialTheme);

      // Listen for system theme changes
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
         console.log("🔍 ThemeTest detected system theme change:", colorScheme);
         setSystemTheme(colorScheme);
         setChangeCount((prev) => prev + 1);
         setLastChangeTime(new Date().toLocaleTimeString());
      });

      // Additional polling to catch missed changes (NativeWind v4 workaround)
      const pollInterval = setInterval(() => {
         const currentTheme = Appearance.getColorScheme();
         if (currentTheme !== systemTheme) {
            console.log("🔍 ThemeTest polling detected change:", currentTheme);
            setSystemTheme(currentTheme);
            setChangeCount((prev) => prev + 1);
            setLastChangeTime(new Date().toLocaleTimeString());
         }
      }, 2000); // Check every 2 seconds

      return () => {
         console.log("ThemeTest: Cleaning up listener");
         subscription?.remove();
         clearInterval(pollInterval);
      };
   }, [systemTheme]);

   const handleRefresh = () => {
      // Use both local refresh and context refresh
      const currentSystemTheme = Appearance.getColorScheme();
      console.log(
         "🔄 ThemeTest manual refresh - Current system theme:",
         currentSystemTheme
      );
      setSystemTheme(currentSystemTheme);
      setChangeCount((prev) => prev + 1);
      setLastChangeTime(new Date().toLocaleTimeString());
   };

   return (
      <View className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-4">
         <View className="flex-row justify-between items-center">
            <Text className="text-blue-800 dark:text-blue-200 font-semibold">
               🎨 Theme Debug Panel
            </Text>
            <TouchableOpacity
               onPress={handleRefresh}
               className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded"
            >
               <Text className="text-blue-800 dark:text-blue-200 text-xs">
                  🔄 Refresh
               </Text>
            </TouchableOpacity>
         </View>
         <Text className="text-blue-600 dark:text-blue-300 text-sm mt-1">
            Selected Mode: {themeMode}
         </Text>
         <Text className="text-blue-600 dark:text-blue-300 text-sm">
            Current Theme: {currentTheme}
         </Text>
         <Text className="text-blue-600 dark:text-blue-300 text-sm">
            System Theme: {systemTheme || "unknown"}
         </Text>
         <Text className="text-blue-600 dark:text-blue-300 text-sm">
            Changes Detected: {changeCount}
         </Text>
         {lastChangeTime && (
            <Text className="text-blue-600 dark:text-blue-300 text-sm">
               Last Change: {lastChangeTime}
            </Text>
         )}
         <Text className="text-gray-700 dark:text-gray-300 text-xs mt-2">
            {themeMode === "system"
               ? `Following system (${systemTheme}) → ${currentTheme}`
               : `Manual override: ${themeMode}`}
         </Text>
         <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            {themeMode === "system" && systemTheme !== currentTheme
               ? "⚠️ System theme mismatch!"
               : "✅ Theme sync OK"}
         </Text>
      </View>
   );
};

export default ThemeTest;

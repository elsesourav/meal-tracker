import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
   themeMode: ThemeMode;
   currentTheme: "light" | "dark";
   setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
   const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
      Appearance.getColorScheme()
   );

   // Use NativeWind's useColorScheme hook for theme application
   const { setColorScheme } = useNativeWindColorScheme();

   // Calculate current theme based on mode and system theme
   const currentTheme: "light" | "dark" =
      themeMode === "system"
         ? systemTheme === "dark"
            ? "dark"
            : "light"
         : themeMode;

   // Initialize theme on app startup only
   useEffect(() => {
      const initializeTheme = async () => {
         // Get current system theme
         const currentSystemTheme = Appearance.getColorScheme();
         setSystemTheme(currentSystemTheme);

         // Load saved theme mode
         await loadThemeMode();
      };

      initializeTheme();
   }, []);

   // Update NativeWind color scheme when theme changes
   useEffect(() => {
      setColorScheme(currentTheme);
   }, [currentTheme, setColorScheme]);

   const loadThemeMode = async () => {
      try {
         const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
         if (
            savedMode &&
            (savedMode === "light" ||
               savedMode === "dark" ||
               savedMode === "system")
         ) {
            setThemeModeState(savedMode as ThemeMode);
         }
      } catch (error) {
         console.error("Error loading theme mode:", error);
      }
   };

   const setThemeMode = async (mode: ThemeMode) => {
      try {
         await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
         setThemeModeState(mode);
      } catch (error) {
         console.error("Error saving theme mode:", error);
      }
   };

   return (
      <ThemeContext.Provider value={{ themeMode, currentTheme, setThemeMode }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = (): ThemeContextType => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
   }
   return context;
};

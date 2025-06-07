import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface ThemePopupProps {
   visible: boolean;
   onClose: () => void;
   className?: string;
}

type ThemeOption = {
   id: "light" | "dark" | "system";
   label: string;
   icon: keyof typeof Ionicons.glyphMap;
   description: string;
};

const themeOptions: ThemeOption[] = [
   {
      id: "light",
      label: "Light",
      icon: "sunny",
      description: "Always use light theme",
   },
   {
      id: "dark",
      label: "Dark",
      icon: "moon",
      description: "Always use dark theme",
   },
   {
      id: "system",
      label: "System",
      icon: "phone-portrait",
      description: "Follow system setting",
   },
];

const ThemePopup: React.FC<ThemePopupProps> = ({
   visible,
   onClose,
   className,
}) => {
   const { themeMode, currentTheme, setThemeMode } = useTheme();

   const handleThemeSelect = (mode: "light" | "dark" | "system") => {
      setThemeMode(mode);
      onClose();
   };

   return (
      <Modal
         visible={visible}
         transparent
         animationType="fade"
         onRequestClose={onClose}
      >
         <View className="flex-1">
            <TouchableOpacity
               className="flex-1 bg-black/50"
               activeOpacity={1}
               onPress={onClose}
            >
               <View className="flex-1 justify-center items-center p-4">
                  <TouchableOpacity
                     activeOpacity={1}
                     className={`w-80 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg`}
                     onPress={() => {}}
                  >
                     {/* Header */}
                     <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-gray-800 dark:text-white">
                           Theme
                        </Text>
                        <TouchableOpacity
                           onPress={onClose}
                           className="w-8 h-8 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-700"
                        >
                           <Ionicons
                              name="close"
                              size={18}
                              color={
                                 currentTheme === "dark" ? "#E5E7EB" : "#6B7280"
                              }
                           />
                        </TouchableOpacity>
                     </View>

                     {/* Theme Options */}
                     <View className="flex-col gap-2">
                        {themeOptions.map((option) => (
                           <TouchableOpacity
                              key={option.id}
                              onPress={() => handleThemeSelect(option.id)}
                              className={`flex-row items-center p-4 rounded-xl ${
                                 themeMode === option.id
                                    ? "bg-blue-50 dark:bg-blue-600/20 border-2 border-blue-500"
                                    : "bg-gray-50 dark:bg-gray-700/50"
                              }`}
                           >
                              <View
                                 className={`w-10 h-10 rounded-full items-center justify-center ${
                                    themeMode === option.id
                                       ? "bg-blue-500"
                                       : "bg-gray-200 dark:bg-gray-600"
                                 }`}
                              >
                                 <Ionicons
                                    name={option.icon}
                                    size={20}
                                    color={
                                       themeMode === option.id
                                          ? "#FFFFFF"
                                          : currentTheme === "dark"
                                          ? "#E5E7EB"
                                          : "#6B7280"
                                    }
                                 />
                              </View>

                              <View className="flex-1 ml-3">
                                 <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {option.label}
                                 </Text>
                                 <Text className="text-sm text-gray-500 dark:text-gray-300">
                                    {option.description}
                                 </Text>
                              </View>

                              {themeMode === option.id && (
                                 <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color="#3B82F6"
                                 />
                              )}
                           </TouchableOpacity>
                        ))}
                     </View>

                     {/* Current Theme Indicator */}
                     <View className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                        <Text className="text-sm text-center text-gray-600 dark:text-gray-300">
                           Currently using:{" "}
                           {currentTheme === "dark" ? "🌙 Dark" : "☀️ Light"}{" "}
                           theme
                        </Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </TouchableOpacity>
         </View>
      </Modal>
   );
};

export default ThemePopup;

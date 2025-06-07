import React, { useEffect, useRef, useState } from "react";
import {
   Dimensions,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface DropdownCardProps {
   typeKey: string;
   typeSelected: {
      value: string;
      isOn: boolean;
   };
   customChoices?: string[];
   dropdownStates: { [key: string]: boolean };
   customValues: { [key: string]: string };
   toggleDropdown: (key: string) => void;
   handleValueSelect: (typeKey: string, value: string) => void;
   handleCustomValueChange: (typeKey: string, customValue: string) => void;
   closeAllDropdowns?: () => void; // Optional function to close all dropdowns
}

const DropdownCard: React.FC<DropdownCardProps> = ({
   typeKey,
   typeSelected,
   customChoices = ["--", "40", "OFF", "Custom"],
   dropdownStates,
   customValues,
   toggleDropdown,
   handleValueSelect,
   handleCustomValueChange,
   closeAllDropdowns,
}) => {
   const { currentTheme } = useTheme();
   const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">(
      "below"
   );
   const [isPositionCalculated, setIsPositionCalculated] = useState(false);
   const buttonRef = useRef<View>(null);

   // Refresh values when dropdown is opened (to catch any changes from settings)
   const isDropdownOpen = dropdownStates[typeKey];
   const dropdownHeight = 250;

   const determineDropdownPosition = () => {
      if (!buttonRef.current) return;

      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
         const screenHeight = Dimensions.get("window").height;
         const buttonCenterY = pageY + height / 2;
         const screenCenterY = screenHeight / 2;

         const shouldShowAbove = buttonCenterY > screenCenterY;
         setDropdownPosition(shouldShowAbove ? "above" : "below");
         setIsPositionCalculated(true);
      });
   };

   // Determine position when dropdown opens
   useEffect(() => {
      if (isDropdownOpen) {
         setIsPositionCalculated(false);
         // Use requestAnimationFrame to ensure the button is rendered before measuring
         requestAnimationFrame(() => {
            determineDropdownPosition();
         });
      }
   }, [isDropdownOpen]);

   return (
      <View className="relative mx-0.5">
         {typeSelected.value === "Custom" ? (
            <TextInput
               className="bg-gray-100/30 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 rounded-full px-3 py-2 flex-row flex justify-between items-center shadow-sm text-center text-gray-800 dark:text-white font-bold"
               placeholder="Enter..."
               placeholderTextColor={
                  currentTheme === "dark" ? "#9CA3AF" : "#6B7280"
               }
               value={customValues[typeKey] || ""}
               onChangeText={(text) => handleCustomValueChange(typeKey, text)}
               onFocus={() => {
                  // Close all dropdowns when user focuses on custom input
                  if (closeAllDropdowns) {
                     closeAllDropdowns();
                  }
               }}
               keyboardType="numeric"
               style={{ minHeight: 36, zIndex: 10 }}
            />
         ) : (
            /* Dropdown Button */
            <TouchableOpacity
               ref={buttonRef}
               onPress={() => toggleDropdown(typeKey)}
               className="bg-gray-100/30 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 rounded-full px-3 py-2 flex-row flex justify-between items-center shadow-sm"
               style={{ minHeight: 36, zIndex: 50 }}
            >
               <Text
                  className={`text-center flex-1 font-bold ${
                     typeSelected.value === "OFF"
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-white"
                  }`}
               >
                  {typeSelected.value ||
                     (typeKey.includes("-custom") ? "OFF" : "--")}
               </Text>
            </TouchableOpacity>
         )}

         {/* Dropdown Menu - only show when not Custom */}
         {dropdownStates[typeKey] &&
            typeSelected.value !== "Custom" &&
            isPositionCalculated && (
               <>
                  {/* Background Overlay - captures outside clicks */}
                  <TouchableOpacity
                     className="absolute size-[10000] z-40 -top-[5000] -left-[5000]"
                     onPress={() => {
                        if (closeAllDropdowns) {
                           closeAllDropdowns();
                        } else {
                           toggleDropdown(typeKey);
                        }
                     }}
                     activeOpacity={1}
                  />

                  {/* Actual Dropdown Content */}
                  <View
                     className="absolute left-1 right-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600"
                     style={{
                        ...(dropdownPosition === "above"
                           ? { bottom: 42 }
                           : { top: 42 }),
                        height: dropdownHeight,
                        zIndex: 200,
                     }}
                  >
                     <View className="rounded-lg flex-col h-full w-full">
                        {(dropdownPosition === "above"
                           ? [...customChoices].reverse()
                           : customChoices
                        ).map((choice, index, array) => (
                           <TouchableOpacity
                              key={choice}
                              onPress={() => {
                                 handleValueSelect(typeKey, choice);
                                 // Close all dropdowns after selection
                                 if (closeAllDropdowns) {
                                    closeAllDropdowns();
                                 } else {
                                    toggleDropdown(typeKey);
                                 }
                              }}
                              className={`flex justify-center items-center flex-1 ${
                                 index === 0 ? "rounded-t-lg" : ""
                              } ${
                                 index === array.length - 1
                                    ? "rounded-b-lg"
                                    : ""
                              } ${
                                 typeSelected.value === choice
                                    ? "bg-blue-50 dark:bg-blue-800/30 border-l-2 border-l-blue-500"
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                              style={{
                                 borderBottomWidth:
                                    index < array.length - 1 ? 1 : 0,
                                 borderBottomColor:
                                    currentTheme === "dark"
                                       ? "#374151"
                                       : "#F3F4F6",
                              }}
                           >
                              <Text
                                 className={`text-bold ${
                                    typeSelected.value === choice
                                       ? "text-blue-700 dark:text-blue-400 font-semibold"
                                       : "text-gray-700 dark:text-gray-300"
                                 }`}
                                 numberOfLines={1}
                                 ellipsizeMode="tail"
                              >
                                 {choice}
                              </Text>
                           </TouchableOpacity>
                        ))}
                     </View>
                  </View>
               </>
            )}
      </View>
   );
};

export default DropdownCard;

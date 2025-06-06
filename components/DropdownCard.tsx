import React, { useEffect, useRef, useState } from "react";
import {
   Dimensions,
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";

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
   const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">(
      "below"
   );
   const buttonRef = useRef<View>(null);

   // Refresh values when dropdown is opened (to catch any changes from settings)
   const isDropdownOpen = dropdownStates[typeKey];

   // Calculate dropdown height based on number of choices
   // Show max 4 items at a time (4 * 44px + 8px padding = 184px), then make it scrollable
   const maxVisibleItems = 4;
   const itemHeight = 36;
   const padding = 8;
   const dropdownHeight = Math.min(
      customChoices.length * itemHeight + padding,
      maxVisibleItems * itemHeight + padding
   );

   // Function to determine dropdown position based on screen position
   const determineDropdownPosition = () => {
      if (!buttonRef.current) return;

      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
         const screenHeight = Dimensions.get("window").height;
         const buttonCenterY = pageY + height / 2;
         const screenCenterY = screenHeight / 2;

         // Show dropdown above if button is in bottom half of screen
         const shouldShowAbove = buttonCenterY > screenCenterY;
         setDropdownPosition(shouldShowAbove ? "above" : "below");
      });
   };

   // Determine position when dropdown opens
   useEffect(() => {
      if (isDropdownOpen) {
         determineDropdownPosition();
      }
   }, [isDropdownOpen]);

   return (
      <View className="relative mx-0.5">
         {/* Show Custom Input instead of dropdown when Custom is selected */}
         {typeSelected.value === "Custom" ? (
            <TextInput
               className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 flex-row flex justify-between items-center shadow-sm text-center"
               placeholder="Enter..."
               value={customValues[typeKey] || ""}
               onChangeText={(text) => handleCustomValueChange(typeKey, text)}
               onFocus={() => {
                  // Close all dropdowns when user focuses on custom input
                  if (closeAllDropdowns) {
                     closeAllDropdowns();
                  }
               }}
               keyboardType="numeric"
               style={{ minHeight: 36, zIndex: 50 }}
            />
         ) : (
            /* Dropdown Button */
            <TouchableOpacity
               ref={buttonRef}
               onPress={() => toggleDropdown(typeKey)}
               className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 flex-row flex justify-between items-center shadow-sm"
               style={{ minHeight: 36, zIndex: 50 }}
            >
               <Text className=" text-center text-gray-800 flex-1 font-medium">
                  {typeSelected.value || "--"}
               </Text>
            </TouchableOpacity>
         )}

         {/* Dropdown Menu - only show when not Custom */}
         {dropdownStates[typeKey] && typeSelected.value !== "Custom" && (
            <View
               className="absolute left-1 right-1 bg-white rounded-lg shadow-lg border border-gray-100"
               style={{
                  ...(dropdownPosition === "above"
                     ? { bottom: 42 } // Position above the button
                     : { top: 42 }), // Position below the button
                  height: dropdownHeight,
                  zIndex: 60,
               }}
            >
               <ScrollView
                  showsVerticalScrollIndicator={
                     customChoices.length > maxVisibleItems
                  }
                  className="rounded-lg"
                  nestedScrollEnabled={true}
               >
                  {customChoices.map((choice, index) => (
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
                        className={`flex justify-center items-center h-[30] ${
                           index === 0 ? "rounded-t-lg" : ""
                        } ${
                           index === customChoices.length - 1
                              ? "rounded-b-lg"
                              : ""
                        } ${
                           typeSelected.value === choice
                              ? "bg-blue-50 border-l-2 border-l-blue-500"
                              : "bg-white hover:bg-gray-50"
                        }`}
                        style={{
                           borderBottomWidth:
                              index < customChoices.length - 1 ? 1 : 0,
                           borderBottomColor: "#F3F4F6",
                        }}
                     >
                        <Text
                           className={`text-sm ${
                              typeSelected.value === choice
                                 ? "text-blue-700 font-semibold"
                                 : "text-gray-700"
                           }`}
                           numberOfLines={1}
                           ellipsizeMode="tail"
                        >
                           {choice}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>
         )}
      </View>
   );
};

export default DropdownCard;

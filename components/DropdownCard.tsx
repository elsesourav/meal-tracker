import React, { useEffect, useRef, useState } from "react";
import {
   Dimensions,
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
   const dropdownHeight = 250;

   const determineDropdownPosition = () => {
      if (!buttonRef.current) return;

      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
         const screenHeight = Dimensions.get("window").height;
         const buttonCenterY = pageY + height / 2;
         const screenCenterY = screenHeight / 2;

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
               <Text
                  className={`text-center flex-1 font-medium ${
                     typeSelected.value === "OFF"
                        ? "text-gray-400"
                        : "text-gray-800"
                  }`}
               >
                  {typeSelected.value ||
                     (typeKey.includes("-custom") ? "OFF" : "--")}
               </Text>
            </TouchableOpacity>
         )}

         {/* Dropdown Menu - only show when not Custom */}
         {dropdownStates[typeKey] && typeSelected.value !== "Custom" && (
            <View
               className="absolute left-1 right-1 bg-white rounded-lg shadow-md border border-gray-300"
               style={{
                  ...(dropdownPosition === "above"
                     ? { bottom: 0 }
                     : { top: 0 }),
                  height: dropdownHeight,
                  zIndex: 60,
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
                        } ${index === array.length - 1 ? "rounded-b-lg" : ""} ${
                           typeSelected.value === choice
                              ? "bg-blue-50 border-l-2 border-l-blue-500"
                              : "bg-white hover:bg-gray-50"
                        }`}
                        style={{
                           borderBottomWidth: index < array.length - 1 ? 1 : 0,
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
               </View>
            </View>
         )}
      </View>
   );
};

export default DropdownCard;

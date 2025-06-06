import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";

/**
 * @typedef {Object} DropdownCardProps
 * @property {string} typeKey
 * @property {{ value: string, isOn: boolean }} typeSelected
 * @property {string[]=} customChoices
 * @property {{ [key: string]: boolean }} dropdownStates
 * @property {{ [key: string]: string }} customValues
 * @property {(key: string) => void} toggleDropdown
 * @property {(typeKey: string, value: string) => void} handleValueSelect
 * @property {(typeKey: string, customValue: string) => void} handleCustomValueChange
 */

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
}

const DropdownCard: React.FC<DropdownCardProps> = ({
   typeKey,
   typeSelected,
   customChoices = ["40", "60", "90", "Custom"],
   dropdownStates,
   customValues,
   toggleDropdown,
   handleValueSelect,
   handleCustomValueChange,
}) => {
   return (
      <View className="px-1 relative">
         <TouchableOpacity
            onPress={() => toggleDropdown(typeKey)}
            className="bg-white border border-gray-300 rounded px-2 py-1 mb-1 flex-row justify-between items-center min-h-[32px]"
         >
            <Text className="text-xs text-gray-700 flex-1">
               {typeSelected.value || "Select"}
            </Text>
            <Ionicons
               name={dropdownStates[typeKey] ? "chevron-up" : "chevron-down"}
               size={12}
               color="#666"
            />
         </TouchableOpacity>

         {dropdownStates[typeKey] && (
            <View
               className="absolute left-1 right-1 bg-white border border-gray-300 rounded shadow-lg z-50"
               style={{
                  bottom: 40, // Position above the button
                  minHeight: 120, // Fixed height for 4 options
               }}
            >
               <ScrollView 
                  className="max-h-32"
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
               >
                  {customChoices.map((choice, index) => (
                     <TouchableOpacity
                        key={choice}
                        onPress={() => {
                           handleValueSelect(typeKey, choice);
                           toggleDropdown(typeKey);
                        }}
                        className={`px-3 py-2 ${
                           index < customChoices.length - 1 ? "border-b border-gray-100" : ""
                        } ${
                           typeSelected.value === choice
                              ? "bg-blue-500"
                              : "bg-white hover:bg-gray-50"
                        }`}
                     >
                        <Text
                           className={`text-xs text-center ${
                              typeSelected.value === choice
                                 ? "text-white font-medium"
                                 : "text-gray-700"
                           }`}
                        >
                           {choice}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>
         )}

         {typeSelected.value === "Custom" && (
            <TextInput
               className="bg-white border border-gray-300 rounded px-2 py-1 text-xs mt-1"
               placeholder="Enter value"
               value={customValues[typeKey] || ""}
               onChangeText={(text) => handleCustomValueChange(typeKey, text)}
               keyboardType="numeric"
            />
         )}
      </View>
   );
};

export default DropdownCard;

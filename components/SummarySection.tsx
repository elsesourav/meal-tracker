import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface SummarySectionProps {
   summary: {
      dayTotal: number;
      nightTotal: number;
      customTotal: number;
      onCount: number;
      total: number;
   };
   onInfoButtonPress: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({
   summary,
   onInfoButtonPress,
}) => {
   const { currentTheme } = useTheme();

   return (
      <View className="bg-gray-50 dark:bg-gray-800 p-3 border-t border-gray-300 dark:border-gray-600">
         <View className="flex-row">
            {/* Total Label - flex-4 */}
            <View className="flex-[4] justify-center items-center">
               <Text className="text-sm font-bold text-gray-800 dark:text-white">
                  Total
               </Text>
            </View>

            {/* Day Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600 dark:text-blue-400">
                  ₹{summary.dayTotal}
               </Text>
            </View>

            {/* Night Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600 dark:text-blue-400">
                  ₹{summary.nightTotal}
               </Text>
            </View>

            {/* Extra Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600 dark:text-blue-400">
                  ₹{summary.customTotal}
               </Text>
            </View>

            {/* Info Icon - flex-6 */}
            <View className="flex-[6] justify-center items-center">
               <TouchableOpacity className="p-2" onPress={onInfoButtonPress}>
                  <Ionicons
                     name="information-circle-outline"
                     size={20}
                     color={currentTheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

export default SummarySection;

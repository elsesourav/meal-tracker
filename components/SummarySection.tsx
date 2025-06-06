import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
   return (
      <View className="bg-gray-50 p-3 border-t border-gray-300">
         <View className="flex-row">
            {/* Total Label - flex-4 */}
            <View className="flex-[4] justify-center items-center">
               <Text className="text-sm font-bold text-gray-800">Total</Text>
            </View>

            {/* Day Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600">
                  ₹{summary.dayTotal}
               </Text>
            </View>

            {/* Night Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600">
                  ₹{summary.nightTotal}
               </Text>
            </View>

            {/* Extra Total - flex-8 */}
            <View className="flex-[8] justify-center items-center">
               <Text className="text-base font-bold text-blue-600">
                  ₹{summary.customTotal}
               </Text>
            </View>

            {/* Info Icon - flex-6 */}
            <View className="flex-[6] justify-center items-center">
               <TouchableOpacity className="p-2" onPress={onInfoButtonPress}>
                  <Ionicons
                     name="information-circle-outline"
                     size={20}
                     color="#3B82F6"
                  />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

export default SummarySection;

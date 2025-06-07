import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SummaryDetailsModalProps {
   visible: boolean;
   onClose: () => void;
   currentMonth: Date;
   summary: {
      dayTotal: number;
      nightTotal: number;
      customTotal: number;
      onCount: number;
      total: number;
   };
   datesLength: number;
}

const SummaryDetailsModal: React.FC<SummaryDetailsModalProps> = ({
   visible,
   onClose,
   currentMonth,
   summary,
   datesLength,
}) => {
   return (
      <Modal
         visible={visible}
         transparent={true}
         animationType="fade"
         onRequestClose={onClose}
      >
         <TouchableOpacity
            className="flex-1 bg-black/50 justify-center items-center px-5"
            activeOpacity={1}
            onPress={onClose}
         >
            <TouchableOpacity
               className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-96 shadow-xl"
               activeOpacity={1}
               onPress={(e) => e.stopPropagation()}
            >
               {/* Header */}
               <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-800 dark:text-gray-100">
                     Summary Details
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                     <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
               </View>

               {/* Month Info */}
               <View className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 mb-4">
                  <Text className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                     Current Month
                  </Text>
                  <Text className="text-lg font-bold text-blue-600 dark:text-blue-300">
                     {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                     })}
                  </Text>
               </View>

               {/* Totals Grid */}
               <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                     Column Totals
                  </Text>

                  <View className="flex-col gap-1">
                     {/* Day Total */}
                     <View className="flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <View className="flex-row items-center">
                           <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                           <Text className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Day Total
                           </Text>
                        </View>
                        <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                           ₹{summary.dayTotal}
                        </Text>
                     </View>

                     {/* Night Total */}
                     <View className="flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <View className="flex-row items-center">
                           <View className="w-3 h-3 rounded-full bg-indigo-500 mr-2" />
                           <Text className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Night Total
                           </Text>
                        </View>
                        <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                           ₹{summary.nightTotal}
                        </Text>
                     </View>

                     {/* Extra Total */}
                     <View className="flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <View className="flex-row items-center">
                           <View className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                           <Text className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Extra Total
                           </Text>
                        </View>
                        <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                           ₹{summary.customTotal}
                        </Text>
                     </View>
                  </View>
               </View>

               {/* Grand Total */}
               <View className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-4">
                  <View className="flex-row justify-between items-center">
                     <Text className="text-sm font-semibold text-green-800 dark:text-green-200">
                        Grand Total
                     </Text>
                     <Text className="text-2xl font-bold text-green-600 dark:text-green-300">
                        ₹{summary.total}
                     </Text>
                  </View>
               </View>

               {/* Statistics */}
               <View className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                     Statistics
                  </Text>

                  <View className="flex-row justify-between items-center mb-2">
                     <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Active Days
                     </Text>
                     <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {summary.onCount} / {datesLength}
                     </Text>
                  </View>

                  <View className="flex-row justify-between items-center mb-2">
                     <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Average per Active Day
                     </Text>
                     <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        ₹
                        {summary.onCount > 0
                           ? (summary.total / summary.onCount).toFixed(1)
                           : "0.0"}
                     </Text>
                  </View>

                  <View className="flex-row justify-between items-center">
                     <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly Average
                     </Text>
                     <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        ₹
                        {datesLength > 0
                           ? (summary.total / datesLength).toFixed(1)
                           : "0.0"}
                     </Text>
                  </View>
               </View>

               {/* Close Button */}
               <TouchableOpacity
                  onPress={onClose}
                  className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 mt-6"
               >
                  <Text className="text-white text-center font-semibold">
                     Close
                  </Text>
               </TouchableOpacity>
            </TouchableOpacity>
         </TouchableOpacity>
      </Modal>
   );
};

export default SummaryDetailsModal;

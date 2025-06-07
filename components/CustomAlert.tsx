import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface CustomAlertProps {
   visible: boolean;
   title: string;
   message: string;
   onCancel: () => void;
   onConfirm?: () => void;
   type?: "delete" | "info" | "warning";
}

const CustomAlert: React.FC<CustomAlertProps> = ({
   visible,
   title,
   message,
   onCancel,
   onConfirm,
   type = "info", // Default to 'info' instead of 'delete'
}) => {
   const { currentTheme } = useTheme();

   return (
      <Modal
         visible={visible}
         transparent
         animationType="fade"
         statusBarTranslucent
      >
         <View className={`${currentTheme === "dark" ? "dark" : ""} relative flex-1`}>
            <View className="flex-1 bg-black/50 justify-center items-center px-5">
               <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-80 shadow-xl">
                  <View
                     className={`w-12 h-12 rounded-full ${
                        type === "delete"
                           ? "bg-red-50"
                           : type === "warning"
                           ? "bg-orange-50"
                           : "bg-blue-50"
                     } justify-center items-center self-center mb-4`}
                  >
                     <Ionicons
                        name={
                           type === "delete"
                              ? "trash-outline"
                              : type === "warning"
                              ? "warning-outline"
                              : "information-circle-outline"
                        }
                        size={24}
                        color={
                           type === "delete"
                              ? "#DC2626"
                              : type === "warning"
                              ? "#D97706"
                              : "#2563EB"
                        }
                     />
                  </View>

                  <Text className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
                     {title}
                  </Text>

                  <Text className="text-sm text-gray-500 dark:text-gray-300 text-center mb-6 leading-5">
                     {message}
                  </Text>

                  <View
                     className={`${onConfirm ? "flex-row" : "flex-col"} gap-3`}
                  >
                     {onConfirm && (
                        <TouchableOpacity
                           onPress={onCancel}
                           className="flex-1 bg-gray-50 dark:bg-gray-700 py-3 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                           <Text className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                              Cancel
                           </Text>
                        </TouchableOpacity>
                     )}

                     <TouchableOpacity
                        onPress={onConfirm || onCancel}
                        className={`${onConfirm ? "flex-1" : ""} ${
                           type === "delete"
                              ? "bg-red-600"
                              : type === "warning"
                              ? "bg-orange-600"
                              : "bg-blue-600"
                        } py-3 rounded-lg`}
                     >
                        <Text className="text-sm font-medium text-white text-center">
                           {onConfirm
                              ? type === "delete"
                                 ? "Delete"
                                 : type === "warning"
                                 ? "Proceed"
                                 : "Confirm"
                              : "OK"}
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </View>
      </Modal>
   );
};

export default CustomAlert;

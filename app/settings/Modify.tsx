import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import Toast from "../../components/Toast";

const STORAGE_KEY = "@meal_tracker_custom_values";

const Modify = () => {
   const [values, setValues] = useState<string[]>([]);
   const [newValue, setNewValue] = useState("");
   const [alertVisible, setAlertVisible] = useState(false);
   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
   const [duplicateAlertVisible, setDuplicateAlertVisible] = useState(false);
   const [invalidValueAlertVisible, setInvalidValueAlertVisible] =
      useState(false);
   const [toastVisible, setToastVisible] = useState(false);
   const [toastMessage, setToastMessage] = useState("");
   const [toastType, setToastType] = useState<"success" | "error" | "info">(
      "success"
   );

   // Load saved values on component mount
   useEffect(() => {
      const loadData = async () => {
         try {
            const savedValues = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedValues) {
               const parsedValues: string[] = JSON.parse(savedValues);
               setValues(
                  parsedValues.sort(
                     (a: string, b: string) => parseInt(a) - parseInt(b)
                  )
               );
            } else {
               // Set default values if no saved data exists
               const defaultValues = ["40", "60", "90"];
               setValues(
                  defaultValues.sort(
                     (a: string, b: string) => parseInt(a) - parseInt(b)
                  )
               );
            }
         } catch (error) {
            console.error("Error loading saved values:", error);
            // Fallback to default values
            setValues(["40", "60", "90"]);
            showToast("Error loading saved data, using defaults", "error");
         }
      };
      loadData();
   }, []);

   // Save values whenever the values array changes
   useEffect(() => {
      const saveData = async () => {
         if (values.length > 0) {
            try {
               await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(values));
            } catch (error) {
               console.error("Error saving values:", error);
               showToast("Error saving data", "error");
            }
         }
      };
      saveData();
   }, [values]);

   const validateNumericInput = (text: string): boolean => {
      // Check if the input contains only digits (no decimal points, letters, or special characters)
      const numericRegex = /^\d+$/;
      return numericRegex.test(text.trim());
   };

   const showToast = (
      message: string,
      type: "success" | "error" | "info" = "success"
   ) => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
   };

   const hideToast = () => {
      setToastVisible(false);
   };

   const addValue = () => {
      const trimmedValue = newValue.trim();

      if (!trimmedValue) {
         showToast("Please enter a value", "error");
         return;
      }

      if (!validateNumericInput(trimmedValue)) {
         setInvalidValueAlertVisible(true);
         return;
      }

      if (values.includes(trimmedValue)) {
         setDuplicateAlertVisible(true);
         return;
      }

      // No limit on number of values - users can add as many as they want

      setValues(
         [...values, trimmedValue].sort(
            (a: string, b: string) => parseInt(a) - parseInt(b)
         )
      );
      setNewValue("");
      showToast(`"${trimmedValue}" added successfully!`, "success");
   };

   const deleteValue = (index: number) => {
      setDeleteIndex(index);
      setAlertVisible(true);
   };

   const confirmDelete = () => {
      if (deleteIndex !== null) {
         const deletedValue = values[deleteIndex];
         setValues(values.filter((_, i) => i !== deleteIndex));
         showToast(`"${deletedValue}" deleted successfully!`, "success");
      }
      setAlertVisible(false);
      setDeleteIndex(null);
   };

   const cancelDelete = () => {
      setAlertVisible(false);
      setDeleteIndex(null);
   };

   const closeDuplicateAlert = () => {
      setDuplicateAlertVisible(false);
   };

   const closeInvalidValueAlert = () => {
      setInvalidValueAlertVisible(false);
   };

   const handleTextChange = (text: string) => {
      // Allow only numeric input in real-time
      const numericText = text.replace(/[^0-9]/g, "");
      setNewValue(numericText);
   };

   return (
      <View className="flex-1 bg-white pt-10 px-6">
         <Text className="text-2xl font-bold text-gray-800">Custom Choice</Text>

         <Text className="text-base text-gray-500 mb-2">
            Manage your custom selection options
         </Text>

         {/* Add New Value Section */}
         <View className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
            <View className="flex-row justify-between items-center mb-3">
               <Text className="text-base font-semibold text-gray-700">
                  Add New Choice
               </Text>
               <Text className="text-sm font-medium text-gray-500">
                  {values.length} choices
               </Text>
            </View>

            <View className="flex-row gap-3">
               <TextInput
                  className="flex-1 border rounded-lg px-3 py-2.5 bg-white border-gray-300 text-gray-950"
                  placeholder="Enter numeric value only..."
                  value={newValue}
                  onChangeText={handleTextChange}
                  onSubmitEditing={addValue}
                  keyboardType="numeric"
               />

               <TouchableOpacity
                  onPress={addValue}
                  className="px-4 py-2.5 rounded-lg justify-center items-center bg-blue-600"
               >
                  <Ionicons name="add" size={20} color="white" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Current Choices Section */}
         <Text className="text-lg font-semibold text-gray-700 mb-4">
            Current Choice ({values.length})
         </Text>

         <ScrollView className="flex-1">
            {values.map((value, index) => (
               <View
                  key={index}
                  className="flex-row justify-between items-center bg-white p-4 mb-2 rounded-lg border border-gray-200 shadow-sm"
               >
                  <View className="flex-row items-center flex-1">
                     <View className="w-2 h-2 rounded-full bg-blue-600 mr-3" />

                     <Text className="text-base text-gray-700 font-medium">
                        {value}
                     </Text>
                  </View>

                  <TouchableOpacity
                     onPress={() => deleteValue(index)}
                     className="bg-red-50 p-2 rounded-md border border-red-200"
                  >
                     <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
               </View>
            ))}
         </ScrollView>

         {values.length === 0 && (
            <View className="flex-1 justify-center items-center opacity-50">
               <Ionicons name="list-outline" size={48} color="#9CA3AF" />
               <Text className="text-base text-gray-400 mt-2">
                  No choices added yet
               </Text>
            </View>
         )}

         <CustomAlert
            visible={alertVisible}
            title="Delete Choice"
            message={`Are you sure you want to delete "${
               deleteIndex !== null ? values[deleteIndex] : ""
            }"? This action cannot be undone.`}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
         />

         <CustomAlert
            visible={duplicateAlertVisible}
            title="Duplicate Choice"
            message="This Choice already exists in your list. Please enter a different choice."
            onCancel={closeDuplicateAlert}
            type="info"
         />

         <CustomAlert
            visible={invalidValueAlertVisible}
            title="Invalid Choice"
            message="Please enter only numeric values without decimal points, letters, or special characters."
            onCancel={closeInvalidValueAlert}
            type="info"
         />

         <Toast
            visible={toastVisible}
            message={toastMessage}
            type={toastType}
            onHide={hideToast}
         />
      </View>
   );
};

export default Modify;

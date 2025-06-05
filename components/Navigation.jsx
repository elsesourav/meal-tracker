import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomDatePicker from "./CustomDatePicker";

const Navigation = ({ className = "" }) => {
   const router = useRouter();
   const [currentDate, setCurrentDate] = useState(new Date());
   const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

   const goToPreviousMonth = () => {
      setCurrentDate(
         new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
   };

   const goToNextMonth = () => {
      setCurrentDate(
         new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
   };

   const openCustomDatePicker = () => {
      setIsDatePickerVisible(true);
   };

   const handleDateSelect = (year, month) => {
      setCurrentDate(new Date(year, month, 1));
   };

   const navigateToSettings = () => {
      router.push("/settings");
   };

   return (
      <View className={`flex-row h-24 bg-background py-2 ${className}`}>
         <View className="flex-row items-center w-full justify-center">
            {/* Custom Month */}
            <View className="flex justify-center items-center w-20">
               <TouchableOpacity
                  className="p-3 rounded-xl bg-white shadow-sm"
                  onPress={openCustomDatePicker}
               >
                  <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
               </TouchableOpacity>
            </View>

            {/* Month Navigation */}
            <View className="flex-row items-center justify-center p-2 flex-1 bg-secondary rounded-xl shadow-md">
               <TouchableOpacity
                  onPress={goToPreviousMonth}
                  className="p-2 rounded-full bg-white shadow-sm"
               >
                  <Ionicons name="chevron-back" size={20} color="#3B82F6" />
               </TouchableOpacity>

               <Text className="text-xl font-semibold text-gray-800 flex-1 text-center">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
               </Text>

               <TouchableOpacity
                  onPress={goToNextMonth}
                  className="p-2 rounded-full bg-white shadow-sm"
               >
                  <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
               </TouchableOpacity>
            </View>

            {/* Settings Icon */}
            <View className="flex justify-center items-center w-20">
               <TouchableOpacity
                  className="p-3 rounded-xl bg-white shadow-sm"
                  onPress={navigateToSettings}
               >
                  <Ionicons name="settings-outline" size={24} color="#3B82F6" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Custom Date Picker */}
         <CustomDatePicker
            visible={isDatePickerVisible}
            onClose={() => setIsDatePickerVisible(false)}
            initialYear={currentDate.getFullYear()}
            initialMonth={currentDate.getMonth()}
            onDateSelect={handleDateSelect}
         />
      </View>
   );
};
export default Navigation;

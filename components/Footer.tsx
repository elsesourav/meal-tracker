import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import CustomDatePicker from "./CustomDatePicker";

interface FooterProps {
   className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
   const { currentTheme } = useTheme();
   const [currentDate, setCurrentDate] = useState<Date>(new Date());
   const [isDatePickerVisible, setIsDatePickerVisible] =
      useState<boolean>(false);

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

   const handleDateSelect = (year: number, month: number) => {
      setCurrentDate(new Date(year, month, 1));
   };

   return (
      <View
         className={`relative flex-row h-24 bg-white dark:bg-gray-900 py-2 ${className}`}
      >
         <View className="flex-row items-center w-full justify-center">
            {/* Custom Month */}
            <View className="flex justify-center items-center w-20">
               <TouchableOpacity
                  className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/50 shadow-sm border border-blue-100 dark:border-blue-800"
                  onPress={openCustomDatePicker}
               >
                  <Ionicons
                     name="calendar-outline"
                     size={24}
                     color={currentTheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
               </TouchableOpacity>
            </View>

            {/* Month Navigation */}
            <View className="flex-row items-center justify-center p-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md">
               <TouchableOpacity
                  onPress={goToPreviousMonth}
                  className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600"
               >
                  <Ionicons
                     name="chevron-back"
                     size={20}
                     color={currentTheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
               </TouchableOpacity>

               <Text className="text-xl font-semibold text-gray-800 dark:text-white flex-1 text-center">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
               </Text>

               <TouchableOpacity
                  onPress={goToNextMonth}
                  className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600"
               >
                  <Ionicons
                     name="chevron-forward"
                     size={20}
                     color={currentTheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
               </TouchableOpacity>
            </View>

            {/* Settings Icon */}
            <View className="flex justify-center items-center w-20">
               <TouchableOpacity className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/50 shadow-sm border border-blue-100 dark:border-blue-800">
                  <Ionicons
                     name="settings-outline"
                     size={24}
                     color={currentTheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
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

export default Footer;

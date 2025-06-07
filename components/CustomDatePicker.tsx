import { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface CustomDatePickerProps {
   visible: boolean;
   onClose: () => void;
   initialYear: number;
   initialMonth: number;
   onDateSelect: (year: number, month: number) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
   visible,
   onClose,
   initialYear,
   initialMonth,
   onDateSelect,
}) => {
   const { currentTheme } = useTheme();
   const [selectedYear, setSelectedYear] = useState<number>(initialYear);
   const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);

   const yearScrollRef = useRef<ScrollView>(null);
   const monthScrollRef = useRef<ScrollView>(null);

   // Store current scroll positions
   const yearScrollPosition = useRef<number>(0);
   const monthScrollPosition = useRef<number>(0);

   // Update selected values when modal opens with new initial values
   useEffect(() => {
      if (visible) {
         setSelectedYear(initialYear);
         setSelectedMonth(initialMonth);
      }
   }, [visible, initialYear, initialMonth]);

   const currentYear = new Date().getFullYear();
   const currentMonth = new Date().getMonth();

   // Generate years from 1990 to currentYear + 10
   const years = Array.from(
      { length: currentYear + 10 - 1990 + 1 },
      (_, i) => 1990 + i
   );

   // Auto-scroll to selected date when modal opens
   useEffect(() => {
      if (visible) {
         const itemHeight = 50;

         // Scroll to selected year
         setTimeout(() => {
            if (yearScrollRef.current) {
               const yearIndex = years.findIndex(
                  (year) => year === selectedYear
               );
               if (yearIndex >= 0) {
                  const targetY = yearIndex * itemHeight;
                  yearScrollPosition.current = targetY;
                  yearScrollRef.current.scrollTo({
                     y: targetY,
                     animated: false,
                  });
               }
            }

            // Scroll to selected month
            if (monthScrollRef.current) {
               const monthIndex = selectedMonth;
               if (monthIndex >= 0) {
                  const targetY = monthIndex * itemHeight;
                  monthScrollPosition.current = targetY;
                  monthScrollRef.current.scrollTo({
                     y: targetY,
                     animated: false,
                  });
               }
            }
         }, 100);
      }
   }, [visible, selectedYear, selectedMonth, years]);

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

   const handleApply = () => {
      // Calculate which items are currently in the center based on scroll positions
      const itemHeight = 50;

      // Calculate centered year - divide scroll position by item height to get index
      const yearIndex = Math.round(yearScrollPosition.current / itemHeight);
      const clampedYearIndex = Math.max(
         0,
         Math.min(yearIndex, years.length - 1)
      );
      const finalYear = years[clampedYearIndex];

      // Calculate centered month - divide scroll position by item height to get index
      const monthIndex = Math.round(monthScrollPosition.current / itemHeight);
      const clampedMonthIndex = Math.max(0, Math.min(monthIndex, 11)); // 0-11 for months
      const finalMonth = clampedMonthIndex;

      onDateSelect(finalYear, finalMonth);
      onClose();
   };

   const goToCurrentDate = () => {
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth);
      onDateSelect(currentYear, currentMonth);
      onClose();
   };

   const renderScrollableList = (
      items: (string | number)[],
      selectedValue: number,
      onSelect: (value: number) => void,
      isYear: boolean = false,
      scrollRef?: React.RefObject<ScrollView>
   ) => {
      const itemHeight = 50;
      const containerHeight = 200;

      // Track scroll position
      const handleScroll = (event: any) => {
         const offsetY = event.nativeEvent.contentOffset.y;
         if (isYear) {
            yearScrollPosition.current = offsetY;
         } else {
            monthScrollPosition.current = offsetY;
         }
      };

      return (
         <View
            style={{ height: containerHeight }}
            className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 relative"
         >
            <ScrollView
               ref={scrollRef}
               showsVerticalScrollIndicator={false}
               snapToInterval={itemHeight}
               decelerationRate="fast"
               onScroll={handleScroll}
               scrollEventThrottle={16}
               contentContainerStyle={{
                  paddingVertical: (containerHeight - itemHeight) / 2,
               }}
               style={{ flex: 1 }}
            >
               {items.map((item, index) => {
                  return (
                     <TouchableOpacity
                        key={index}
                        style={{ height: itemHeight }}
                        className="justify-center items-center bg-transparent"
                     >
                        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300">
                           {isYear ? item : item}
                        </Text>
                     </TouchableOpacity>
                  );
               })}
            </ScrollView>

            {/* Selection Indicator */}
            <View
               className="absolute left-0 right-0 border-t border-b border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-800/20 pointer-events-none"
               style={{
                  top: (containerHeight - itemHeight) / 2,
                  height: itemHeight,
               }}
            />
         </View>
      );
   };

   return (
      <Modal
         visible={visible}
         transparent={true}
         animationType="slide"
         onRequestClose={onClose}
      >
         <View
            className={`${
               currentTheme === "dark" ? "dark" : ""
            } relative flex-1`}
         >
            <TouchableOpacity
               className="flex-1 justify-end bg-black/50"
               activeOpacity={1}
               onPress={onClose}
            >
               <TouchableOpacity
                  className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-xl"
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
               >
                  <Text className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                     Select Date
                  </Text>

                  {/* Year and Month Selectors */}
                  <View className="flex-row gap-4 mb-6">
                     {/* Year Selector */}
                     <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
                           Year
                        </Text>
                        {renderScrollableList(
                           years,
                           selectedYear,
                           setSelectedYear,
                           true,
                           yearScrollRef as React.RefObject<ScrollView>
                        )}
                     </View>

                     {/* Month Selector */}
                     <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
                           Month
                        </Text>
                        {renderScrollableList(
                           monthNames,
                           selectedMonth,
                           setSelectedMonth,
                           false,
                           monthScrollRef as React.RefObject<ScrollView>
                        )}
                     </View>
                  </View>

                  {/* Current Date Button */}
                  <TouchableOpacity
                     onPress={goToCurrentDate}
                     className="bg-gray-100 dark:bg-gray-700 rounded-xl py-3 mb-4"
                  >
                     <Text className="text-gray-700 dark:text-gray-300 text-center font-medium">
                        Current Date ({monthNames[currentMonth]} {currentYear})
                     </Text>
                  </TouchableOpacity>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                     <TouchableOpacity
                        onPress={onClose}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl py-3"
                     >
                        <Text className="text-gray-700 dark:text-gray-300 text-center font-semibold">
                           Cancel
                        </Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        onPress={handleApply}
                        className="flex-1 bg-blue-500 rounded-xl py-3"
                     >
                        <Text className="text-white text-center font-semibold">
                           Apply
                        </Text>
                     </TouchableOpacity>
                  </View>
               </TouchableOpacity>
            </TouchableOpacity>
         </View>
      </Modal>
   );
};

export default CustomDatePicker;

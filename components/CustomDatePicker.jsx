import { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const CustomDatePicker = ({
   visible,
   onClose,
   initialYear,
   initialMonth,
   onDateSelect,
}) => {
   const [selectedYear, setSelectedYear] = useState(initialYear);
   const [selectedMonth, setSelectedMonth] = useState(initialMonth);

   const yearScrollRef = useRef(null);
   const monthScrollRef = useRef(null);

   // Update selected values when modal opens with new initial values
   useEffect(() => {
      if (visible) {
         setSelectedYear(initialYear);
         setSelectedMonth(initialMonth);
      }
   }, [visible, initialYear, initialMonth]);

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
                  yearScrollRef.current.scrollTo({
                     y: yearIndex * itemHeight,
                     animated: true,
                  });
               }
            }

            // Scroll to selected month
            if (monthScrollRef.current) {
               const monthIndex = selectedMonth;
               if (monthIndex >= 0) {
                  monthScrollRef.current.scrollTo({
                     y: monthIndex * itemHeight,
                     animated: true,
                  });
               }
            }
         }, 300); // Delay to ensure modal animation is complete
      }
   }, [visible, selectedYear, selectedMonth, years]);

   const currentYear = new Date().getFullYear();
   const currentMonth = new Date().getMonth();

   // Generate years from 1990 to currentYear + 10
   const years = Array.from(
      { length: currentYear + 10 - 1990 + 1 },
      (_, i) => 1990 + i
   );

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
      onDateSelect(selectedYear, selectedMonth);
      onClose();
   };

   const goToCurrentDate = () => {
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth);
      onDateSelect(currentYear, currentMonth);
      onClose();
   };

   const renderScrollableList = (
      items,
      selectedValue,
      onSelect,
      isYear = false,
      scrollRef = null
   ) => {
      const itemHeight = 50;
      const containerHeight = 200;

      return (
         <View
            style={{ height: containerHeight }}
            className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative"
         >
            <ScrollView
               ref={scrollRef}
               showsVerticalScrollIndicator={false}
               snapToInterval={itemHeight}
               decelerationRate="fast"
               contentContainerStyle={{
                  paddingVertical: (containerHeight - itemHeight) / 2,
               }}
               style={{ flex: 1 }}
            >
               {items.map((item, index) => {
                  const value = isYear ? item : index;
                  const isSelected = selectedValue === value;

                  return (
                     <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(value)}
                        style={{ height: itemHeight }}
                        className={`justify-center items-center ${
                           isSelected ? "bg-blue-100" : "bg-transparent"
                        }`}
                     >
                        <Text
                           className={`text-lg font-medium ${
                              isSelected ? "text-blue-600" : "text-gray-700"
                           }`}
                        >
                           {isYear ? item : item}
                        </Text>
                     </TouchableOpacity>
                  );
               })}
            </ScrollView>

            {/* Selection Indicator */}
            <View
               className="absolute left-0 right-0 border-t border-b border-blue-300 bg-blue-50/30 pointer-events-none"
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
         <TouchableOpacity
            className="flex-1 justify-end bg-black/50"
            activeOpacity={1}
            onPress={onClose}
         >
            <TouchableOpacity
               className="bg-white rounded-t-3xl p-6 shadow-xl"
               activeOpacity={1}
               onPress={(e) => e.stopPropagation()}
            >
               <Text className="text-xl font-bold text-gray-800 text-center mb-6">
                  Select Date
               </Text>

               {/* Year and Month Selectors */}
               <View className="flex-row gap-4 mb-6">
                  {/* Year Selector */}
                  <View className="flex-1">
                     <Text className="text-sm font-semibold text-gray-600 mb-2 text-center">
                        Year
                     </Text>
                     {renderScrollableList(
                        years,
                        selectedYear,
                        setSelectedYear,
                        true,
                        yearScrollRef
                     )}
                  </View>

                  {/* Month Selector */}
                  <View className="flex-1">
                     <Text className="text-sm font-semibold text-gray-600 mb-2 text-center">
                        Month
                     </Text>
                     {renderScrollableList(
                        monthNames,
                        selectedMonth,
                        setSelectedMonth,
                        false,
                        monthScrollRef
                     )}
                  </View>
               </View>

               {/* Current Date Button */}
               <TouchableOpacity
                  onPress={goToCurrentDate}
                  className="bg-gray-100 rounded-xl py-3 mb-4"
               >
                  <Text className="text-gray-700 text-center font-medium">
                     Current Date ({monthNames[currentMonth]} {currentYear})
                  </Text>
               </TouchableOpacity>

               {/* Action Buttons */}
               <View className="flex-row gap-3">
                  <TouchableOpacity
                     onPress={onClose}
                     className="flex-1 bg-gray-100 rounded-xl py-3"
                  >
                     <Text className="text-gray-700 text-center font-semibold">
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
      </Modal>
   );
};

export default CustomDatePicker;

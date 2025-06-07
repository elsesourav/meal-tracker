import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface TableHeaderProps {
   className?: string;
}

const HeaderCell = ({
   className = "",
   label = "Day",
   currentTheme,
}: {
   className?: string;
   label?: string;
   currentTheme?: string;
}) => {
   return (
      <View className={`flex w-full justify-center items-center ${className}`}>
         <Text className="text-sm font-bold text-gray-800 dark:text-white">
            {label}
         </Text>
      </View>
   );
};

const TableHeader: React.FC<TableHeaderProps> = ({ className = "" }) => {
   const { currentTheme } = useTheme();

   return (
      <View
         className={`flex-row bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-300 dark:border-gray-600 ${className}`}
      >
         <HeaderCell
            label="Date"
            className="flex-[4]"
            currentTheme={currentTheme}
         />
         <HeaderCell
            label="Day"
            className="flex-[8]"
            currentTheme={currentTheme}
         />
         <HeaderCell
            label="Night "
            className="flex-[8]"
            currentTheme={currentTheme}
         />
         <HeaderCell
            label="Extra"
            className="flex-[8]"
            currentTheme={currentTheme}
         />
         <HeaderCell
            label="Status"
            className="flex-[6]"
            currentTheme={currentTheme}
         />
      </View>
   );
};

export default TableHeader;

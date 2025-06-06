import React from "react";
import { Text, View } from "react-native";

interface TableHeaderProps {
   className?: string;
}

const HeaderCell = ({
   className = "",
   label = "Day",
}: {
   className?: string;
   label?: string;
}) => {
   return (
      <View className={`flex w-full justify-center items-center ${className}`}>
         <Text className="text-sm font-bold text-gray-800">{label}</Text>
      </View>
   );
};

const TableHeader: React.FC<TableHeaderProps> = ({ className = "" }) => {
   return (
      <View
         className={`flex-row bg-gray-100 p-3 border-b border-gray-300 ${className}`}
      >
         <HeaderCell label="Date" className="flex-[4]" />
         <HeaderCell label="Day" className="flex-[8]" />
         <HeaderCell label="Night " className="flex-[8]" />
         <HeaderCell label="Extra" className="flex-[8]" />
         <HeaderCell label="Status" className="flex-[6]" />
      </View>
   );
};

export default TableHeader;

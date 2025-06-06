import React from "react";
import { ScrollView } from "react-native";
import MealRow from "./MealRow";

interface MealTableProps {
   dates: {
      date: number;
      day: string;
      fullDate: string;
      monthName: string;
      year: number;
   }[];
   selectedOptions: {
      [key: string]: { type: string; value: string; isOn: boolean };
   };
   customValues: { [key: string]: string };
   customChoices: string[];
   dropdownStates: { [key: string]: boolean };
   currentMonth: Date;
   onToggle: (dateKey: string) => void;
   onDropdownToggle: (key: string) => void;
   onValueSelect: (dateKey: string, value: string) => void;
   onCustomValueChange: (dateKey: string, customValue: string) => void;
   onCloseAllDropdowns: () => void;
}

const MealTable: React.FC<MealTableProps> = ({
   dates,
   selectedOptions,
   customValues,
   customChoices,
   dropdownStates,
   currentMonth,
   onToggle,
   onDropdownToggle,
   onValueSelect,
   onCustomValueChange,
   onCloseAllDropdowns,
}) => {
   return (
      <ScrollView
         className="flex-col px-2 my-1 gap-x-2"
         onScrollBeginDrag={onCloseAllDropdowns}
      >
         {dates.map((dateInfo) => (
            <MealRow
               key={dateInfo.fullDate}
               dateInfo={dateInfo}
               selectedOptions={selectedOptions}
               customValues={customValues}
               customChoices={customChoices}
               dropdownStates={dropdownStates}
               currentMonth={currentMonth}
               onToggle={onToggle}
               onDropdownToggle={onDropdownToggle}
               onValueSelect={onValueSelect}
               onCustomValueChange={onCustomValueChange}
               onCloseAllDropdowns={onCloseAllDropdowns}
            />
         ))}
      </ScrollView>
   );
};

export default MealTable;

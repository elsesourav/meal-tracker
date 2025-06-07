import React from "react";
import CustomAlert from "../components/CustomAlert";
import MealTable from "../components/MealTable";
import Navigation from "../components/Navigation";
import SummaryDetailsModal from "../components/SummaryDetailsModal";
import SummarySection from "../components/SummarySection";
import TableHeader from "../components/TableHeader";
import ThemedView from "../components/ThemedView";
import { useMealTracker } from "../hooks/useMealTracker";

export default function Index() {
   const {
      // State
      selectedOptions,
      customValues,
      dropdownStates,
      currentMonth,
      customChoices,
      alertVisible,
      infoModalVisible,

      // Functions
      generateDates,
      calculateSummary,
      toggleDropdown,
      closeAllDropdowns,
      handleDateChange,
      handleValueSelect,
      handleCustomValueChange,
      handleToggle,
      handleInfoButtonPress,
      closeInfoModal,
      handleAlertConfirm,
      handleAlertCancel,
      saveData,
   } = useMealTracker();

   const dates = generateDates();
   const summary = calculateSummary(dates);

   return (
      <ThemedView className="flex-1 bg-white dark:bg-gray-900">
         <Navigation
            className="pt-10 h-28"
            currentDate={currentMonth}
            onDateChange={handleDateChange}
            onSettingsPress={saveData}
            onSaveBeforeDateChange={saveData}
         />

         <TableHeader />

         <MealTable
            dates={dates}
            selectedOptions={selectedOptions}
            customValues={customValues}
            customChoices={customChoices}
            dropdownStates={dropdownStates}
            currentMonth={currentMonth}
            onToggle={handleToggle}
            onDropdownToggle={toggleDropdown}
            onValueSelect={handleValueSelect}
            onCustomValueChange={handleCustomValueChange}
            onCloseAllDropdowns={closeAllDropdowns}
         />

         <SummarySection
            summary={summary}
            onInfoButtonPress={handleInfoButtonPress}
         />

         {/* Custom Alert */}
         <CustomAlert
            visible={alertVisible}
            title="Turn Off Day"
            message="This day has data entered. Are you sure you want to turn it off? All entered values will be reset to default."
            onCancel={handleAlertCancel}
            onConfirm={handleAlertConfirm}
            type="info"
         />

         {/* Summary Details Modal */}
         <SummaryDetailsModal
            visible={infoModalVisible}
            onClose={closeInfoModal}
            currentMonth={currentMonth}
            summary={summary}
            datesLength={dates.length}
         />
      </ThemedView>
   );
}

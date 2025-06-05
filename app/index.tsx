import Navigation from "@/components/Navigation";
import { Text, View } from "react-native";

export default function Index() {
   return (
      <View className="flex-1 bg-white">
         <Navigation className="pt-10 h-28" />

         <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold text-gray-800">
               Meal Tracker
            </Text>
         </View>
      </View>
   );
}

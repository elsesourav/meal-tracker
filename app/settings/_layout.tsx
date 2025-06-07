import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const TabItem = ({
   icon,
   label,
   color,
   focused,
}: {
   icon: string;
   label: string;
   color: string;
   focused: boolean;
}) => (
   <View className="text-center w-30 items-center justify-center">
      <Ionicons name={icon as any} size={focused ? 26 : 24} color={color} />
      {focused && (
         <Text
            className="text-xs w-32 font-semibold mt-1 text-center"
            style={{
               color: color,
            }}
         >
            {label}
         </Text>
      )}
   </View>
);

const Layout = () => {
   const { currentTheme } = useTheme();

   return (
      <>
         <View
            className="absolute top-0 left-0 h-10 w-screen z-[1000] bg-gray-50 dark:bg-gray-900 shadow-white dark:shadow-[#1F2937]"
            style={{
               shadowOffset: { width: 0, height: 0 },
               shadowOpacity: 1,
               shadowRadius: 6,
               elevation: 7,
            }}
         ></View>
         
         <Tabs
            screenOptions={{
               tabBarActiveTintColor:
                  currentTheme === "dark" ? "#60A5FA" : "#2563EB",
               tabBarInactiveTintColor:
                  currentTheme === "dark" ? "#6B7280" : "#9CA3AF",
               tabBarStyle: {
                  backgroundColor:
                     currentTheme === "dark" ? "#1F2937" : "white",
                  borderTopWidth: 1,
                  borderTopColor:
                     currentTheme === "dark" ? "#374151" : "#F3F4F6",
                  paddingTop: 8,
                  paddingBottom: 12,
                  height: 80,
               },
               headerShown: false,
               tabBarShowLabel: false,
            }}
         >
            <Tabs.Screen
               name="Status"
               options={{
                  tabBarIcon: ({ color, focused }) => (
                     <TabItem
                        icon="analytics-outline"
                        label="Status"
                        color={color}
                        focused={focused}
                     />
                  ),
               }}
            />
            <Tabs.Screen
               name="Modify"
               options={{
                  tabBarIcon: ({ color, focused }) => (
                     <TabItem
                        icon="create-outline"
                        label="Modify"
                        color={color}
                        focused={focused}
                     />
                  ),
               }}
            />
            <Tabs.Screen
               name="Index"
               options={{
                  tabBarIcon: ({ color, focused }) => (
                     <TabItem
                        icon="settings-outline"
                        label="Settings"
                        color={color}
                        focused={focused}
                     />
                  ),
               }}
            />
         </Tabs>
      </>
   );
};

export default Layout;

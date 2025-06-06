import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

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

const _layout = () => {
   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: "#2563EB",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarStyle: {
               backgroundColor: "white",
               borderTopWidth: 1,
               borderTopColor: "#F3F4F6",
               paddingTop: 8,
               paddingBottom: 12,
               height: 80,
            },
            headerShown: false,
            tabBarShowLabel: false,
         }}
      >
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
      </Tabs>
   );
};

export default _layout;

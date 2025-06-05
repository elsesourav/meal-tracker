import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

const AnimatedText = ({
   name,
   focused,
   color,
}: {
   name: string;
   focused: boolean;
   color: string;
}) => {
   const opacity = useRef(new Animated.Value(focused ? 1 : 0.7)).current;
   const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;

   useEffect(() => {
      Animated.parallel([
         Animated.timing(opacity, {
            toValue: focused ? 1 : 0.7,
            duration: 200,
            useNativeDriver: true,
         }),
         Animated.spring(scale, {
            toValue: focused ? 1 : 0.9,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
         }),
      ]).start();
   }, [focused, opacity, scale]);

   return (
      <Animated.View
         style={{
            height: 14,
            opacity,
            transform: [{ scale }],
            justifyContent: "center",
            marginTop: 2,
            zIndex: 1,
         }}
      >
         <Text
            style={{
               fontSize: 9,
               color,
               textAlign: "center",
               fontWeight: focused ? "700" : "500",
               letterSpacing: 0.2,
            }}
            numberOfLines={1}
         >
            {name}
         </Text>
      </Animated.View>
   );
};

const AnimatedIcon = ({
   name,
   size,
   color,
   focused,
}: {
   name: any;
   size: number;
   color: string;
   focused: boolean;
}) => {
   const scale = useRef(new Animated.Value(focused ? 1.2 : 1)).current;
   const translateY = useRef(new Animated.Value(focused ? -1 : 0)).current;

   useEffect(() => {
      Animated.parallel([
         Animated.spring(scale, {
            toValue: focused ? 1.2 : 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
         }),
         Animated.spring(translateY, {
            toValue: focused ? -1 : 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
         }),
      ]).start();
   }, [focused, scale, translateY]);

   return (
      <Animated.View
         style={{
            transform: [{ scale }, { translateY }],
            zIndex: 1,
         }}
      >
         <Ionicons name={name} size={28} color={color} />
      </Animated.View>
   );
};

const TabBackground = ({ focused }: { focused: boolean }) => {
   const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
   const scale = useRef(new Animated.Value(focused ? 1 : 0.85)).current;

   useEffect(() => {
      Animated.parallel([
         Animated.timing(opacity, {
            toValue: focused ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
         }),
         Animated.spring(scale, {
            toValue: focused ? 1 : 0.85,
            tension: 40,
            friction: 6,
            useNativeDriver: true,
         }),
      ]).start();
   }, [focused, opacity, scale]);

   return (
      <Animated.View
         style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#F0F7FF",
            borderRadius: 12,
            opacity,
            transform: [{ scale }],
            zIndex: -1,
         }}
      />
   );
};

const _layout = () => {
   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: "#3B82F6",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarStyle: {
               backgroundColor: "white",
               borderTopWidth: 1,
               borderTopColor: "#E5E7EB",
               paddingBottom: 10,
               paddingTop: 10,
               height: 85,
               shadowColor: "#000",
               shadowOffset: {
                  width: 0,
                  height: -2,
               },
               shadowOpacity: 0.05,
               shadowRadius: 3,
               elevation: 8,
            },
            headerShown: false,
            tabBarShowLabel: false,
         }}
      >
         <Tabs.Screen
            name="Index"
            options={{
               tabBarIcon: ({ color, size, focused }) => (
                  <View
                     style={{
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 60,
                        minWidth: 75,
                        borderRadius: 12,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        position: "relative",
                        overflow: "hidden",
                     }}
                  >
                     <TabBackground focused={focused} />
                     <AnimatedIcon
                        name="settings-outline"
                        size={size}
                        color={color}
                        focused={focused}
                     />
                     <AnimatedText
                        name="Settings"
                        focused={focused}
                        color={color}
                     />
                  </View>
               ),
            }}
         />
         <Tabs.Screen
            name="Profile"
            options={{
               tabBarIcon: ({ color, size, focused }) => (
                  <View
                     style={{
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 60,
                        minWidth: 75,
                        borderRadius: 12,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        position: "relative",
                        overflow: "hidden",
                     }}
                  >
                     <TabBackground focused={focused} />
                     <AnimatedIcon
                        name="person-outline"
                        size={size}
                        color={color}
                        focused={focused}
                     />
                     <AnimatedText
                        name="Profile"
                        focused={focused}
                        color={color}
                     />
                  </View>
               ),
            }}
         />
         <Tabs.Screen
            name="Modify"
            options={{
               tabBarIcon: ({ color, size, focused }) => (
                  <View
                     style={{
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 60,
                        minWidth: 75,
                        borderRadius: 12,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        position: "relative",
                        overflow: "hidden",
                     }}
                  >
                     <TabBackground focused={focused} />
                     <AnimatedIcon
                        name="create-outline"
                        size={size}
                        color={color}
                        focused={focused}
                     />
                     <AnimatedText
                        name="Modify"
                        focused={focused}
                        color={color}
                     />
                  </View>
               ),
            }}
         />
      </Tabs>
   );
};

export default _layout;

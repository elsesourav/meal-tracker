import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Animated, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type ToastType = "success" | "error" | "info";

interface ToastProps {
   visible: boolean;
   message: string;
   type?: ToastType;
   duration?: number;
   onHide?: () => void;
}

interface ToastConfig {
   bgClass: string;
   icon: keyof typeof Ionicons.glyphMap;
   iconColor: string;
}

const Toast: React.FC<ToastProps> = ({
   visible,
   message,
   type = "success",
   duration = 3000,
   onHide,
}) => {
   const { currentTheme } = useTheme();
   const fadeAnim = React.useRef(new Animated.Value(0)).current;

   const hideToast = useCallback(() => {
      Animated.timing(fadeAnim, {
         toValue: 0,
         duration: 300,
         useNativeDriver: true,
      }).start(() => {
         onHide?.();
      });
   }, [fadeAnim, onHide]);

   useEffect(() => {
      if (visible) {
         // Show animation
         Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
         }).start();

         // Auto hide after duration
         const timer = setTimeout(() => {
            hideToast();
         }, duration);

         return () => clearTimeout(timer);
      }
   }, [visible, duration, fadeAnim, hideToast]);

   const getToastConfig = (currentTheme: "light" | "dark"): ToastConfig => {
      switch (type) {
         case "success":
            return {
               bgClass:
                  currentTheme === "dark" ? "bg-emerald-600" : "bg-emerald-500",
               icon: "checkmark-circle-outline",
               iconColor: "white",
            };
         case "error":
            return {
               bgClass: currentTheme === "dark" ? "bg-red-600" : "bg-red-500",
               icon: "close-circle-outline",
               iconColor: "white",
            };
         case "info":
            return {
               bgClass: currentTheme === "dark" ? "bg-blue-600" : "bg-blue-500",
               icon: "information-circle-outline",
               iconColor: "white",
            };
         default:
            return {
               bgClass:
                  currentTheme === "dark" ? "bg-emerald-600" : "bg-emerald-500",
               icon: "checkmark-circle-outline",
               iconColor: "white",
            };
      }
   };

   const config = getToastConfig(currentTheme);

   if (!visible) return null;

   return (
      <Animated.View
         className="absolute bottom-20 left-5 right-5 z-50 items-center"
         style={{
            opacity: fadeAnim,
         }}
      >
         <View
            className={`${
               config.bgClass
            } rounded-xl py-3 px-4 flex-row items-center shadow-lg border ${
               currentTheme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
            style={{
               alignSelf: "center",
               minWidth: 120,
               maxWidth: "90%",
            }}
         >
            <Ionicons
               name={config.icon}
               size={18}
               color={config.iconColor}
               style={{ marginRight: 8 }}
            />
            <Text
               className="text-white text-sm font-medium"
               numberOfLines={1}
               ellipsizeMode="tail"
               style={{
                  flexShrink: 1,
                  textAlign: "center",
               }}
            >
               {message}
            </Text>
         </View>
      </Animated.View>
   );
};

export default Toast;

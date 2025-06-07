import React from "react";
import { View, ViewProps } from "react-native";

interface ThemedViewProps extends ViewProps {
   children: React.ReactNode;
   className?: string;
}

const ThemedView: React.FC<ThemedViewProps> = ({
   children,
   className = "",
   style,
   ...props
}) => {
   // NativeWind handles dark mode automatically when useColorScheme is used
   return (
      <View className={className} style={style} {...props}>
         {children}
      </View>
   );
};

export default ThemedView;

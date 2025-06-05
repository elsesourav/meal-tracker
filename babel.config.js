module.exports = function (api) {
   api.cache(true);
   return {
      presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
      ],
      plugins: [
         // Add react-native-reanimated plugin for better performance
         "react-native-reanimated/plugin",
      ],
   };
};

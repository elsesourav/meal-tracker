/** @type {import('tailwindcss').Config} */
module.exports = {
   // NOTE: Update this to include the paths to all of your component files.
   content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
         colors: {
            primary: "#124e66",
            secondary: "#e4eae5",
            background: "#d3d9d4",

            dark: {
               secondary: "#141619",
               background: "#ede8f5",
            },
         },
      },
   },
   plugins: [],
};

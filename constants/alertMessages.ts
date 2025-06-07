// Alert messages and important strings for the app

export const ALERT_MESSAGES = {
   // Export Data Messages
   EXPORT_SUCCESS: {
      title: "Export Successful",
      message: "Your meal tracker data has been exported successfully.",
      type: "info" as const,
   },
   EXPORT_FAILED: {
      title: "Export Failed",
      message: "There was an error exporting your data. Please try again.",
      type: "info" as const,
   },

   // Import Data Messages
   IMPORT_CONFIRMATION: {
      title: "Import Data",
      message:
         "This will replace all your current data. Are you sure you want to continue?",
      type: "warning" as const, // Changed to "warning" to indicate caution needed
   },
   IMPORT_SUCCESS: {
      title: "Import Successful",
      message:
         "Your data has been imported successfully. The app will reload now.",
      type: "info" as const,
   },
   IMPORT_FAILED: {
      title: "Import Failed",
      message: "There was an error importing your data. Please try again.",
      type: "info" as const,
   },

   // Clear Data Messages
   CLEAR_CONFIRMATION: {
      title: "Clear All Data",
      message:
         "This will permanently delete all your meal tracker data. This action cannot be undone.",
      type: "delete" as const,
   },
   CLEAR_SUCCESS: {
      title: "Data Cleared",
      message: "All your data has been deleted successfully.",
      type: "info" as const,
   },
   CLEAR_SUCCESS_FALLBACK: {
      title: "Data Cleared",
      message: "All your data has been deleted successfully (fallback method).",
      type: "info" as const,
   },
   CLEAR_FAILED: {
      title: "Error",
      message: "There was an error clearing your data. Please try again.",
      type: "info" as const,
   },

   // Generic Messages
   CONFIRM_ACTION: {
      title: "Confirm Action",
      message: "Are you sure you want to proceed?",
      type: "info" as const,
   },
   OPERATION_CANCELLED: {
      title: "Operation Cancelled",
      message: "The operation was cancelled by the user.",
      type: "info" as const,
   },
} as const;

export const APP_INFO = {
   VERSION: "v1.0.0",
   APP_NAME: "Meal Tracker",
   COPYRIGHT: "©elsesourav2025",
   BUILT_WITH: "Built with React Native & Expo",
   DATA_FORMAT_TITLE: "Data Format",
   DATA_FORMAT_DESCRIPTION:
      "Each date entry stores: \n{ day: amount, night: amount, extra: amount }\nExample: { day: 100, night: 50, extra: 25 }",
   // Contact Information
   CONTACT: {
      EMAIL: "elsesourav@gmail.com",
      GITHUB: "github.com/elsesourav",
   },
   // About App Information
   ABOUT: {
      TITLE: "About This App",
      DESCRIPTION:
         "Meal Tracker is a simple and efficient app designed to help you track your daily meal consumption. Monitor your day meals, night meals, and extra meals with ease.\n\nFeatures:\n• Track daily meal consumption\n• View monthly statistics\n• Export and import data\n• Clean and intuitive interface\n• Optimized performance\n\nDeveloped with ❤️ by elsesourav2025\nBuilt using React Native & Expo",
   },
} as const;

export const SETTINGS_SECTIONS = {
   CONTACT: {
      title: "Contact",
      cards: {
         EMAIL: {
            title: "Email",
            subtitle: APP_INFO.CONTACT.EMAIL,
            icon: "mail-outline",
            iconColor: "#3B82F6",
         },
         GITHUB: {
            title: "GitHub",
            subtitle: APP_INFO.CONTACT.GITHUB,
            icon: "logo-github",
            iconColor: "#1F2937",
         },
      },
   },
   ABOUT: {
      title: "About This App",
      subtitle: "Learn more about this application",
      icon: "information-circle-outline",
      iconColor: "#10B981",
   },
   DATA_MANAGEMENT: {
      title: "Data Management",
      subtitle: "Manage your meal tracker preferences and data",
      cards: {
         SHARE_DATA: {
            title: "Share Data",
            subtitle: "Share your data as a JSON file",
            icon: "share-outline",
            iconColor: "#10B981",
         },
         IMPORT_DATA: {
            title: "Import Data",
            subtitle: "Load data from a JSON file",
            icon: "cloud-upload-outline",
            iconColor: "#3B82F6",
         },
         CLEAR_DATA: {
            title: "Clear All Data",
            subtitle: "Permanently delete all stored data",
            icon: "trash-outline",
            iconColor: "#EF4444",
         },
      },
   },
   APP_INFO: {
      title: "App Information",
      cards: {
         VERSION: {
            title: "Version",
            subtitle: `Meal Tracker ${APP_INFO.VERSION}`,
            icon: "information-circle-outline",
            iconColor: "#3B82F6",
         },
      },
   },
} as const;

export const CONSOLE_MESSAGES = {
   EXPORT_ERROR: "Export error:",
   IMPORT_ERROR: "Import error:",
   CLEAR_DATA_ERROR: "Clear data error:",
   CLEAR_DATA_START: "🚀 Starting complete data clear from Settings...",
   CLEAR_DATA_SUCCESS: "✅ Complete data clear successful",
   APP_RELOAD_START: "🔄 Reloading app after data import...",
   APP_RELOAD_ERROR: "App reload error:",
} as const;

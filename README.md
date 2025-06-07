# 🍽️ Meal Tracker

A comprehensive React Native mobile application built with Expo for tracking daily meal consumption and managing meal reminders.

## 📱 Features

### Core Functionality

-  **Daily Meal Tracking**: Track day meals, night meals, and extra meals
-  **Calendar View**: Navigate through dates to view/edit meal data
-  **Data Export**: Export meal data as JSON files
-  **Data Import**: Import previously exported meal data
-  **Summary Statistics**: View meal consumption summaries and analytics

### Smart Notifications

-  **Background Notifications**: Receive reminders even when app is closed
-  **Customizable Reminders**: Set before-midnight and after-midnight reminder times
-  **Smart Scheduling**: Notifications automatically adapt based on your meal logging behavior
-  **Cross-Platform Support**: Works on both Android and iOS

### User Experience

-  **Dark/Light Theme**: Toggle between light and dark modes
-  **Responsive Design**: Beautiful UI that works across different screen sizes
-  **Smooth Animations**: Fluid transitions and interactions
-  **Offline Support**: Works without internet connection

## 🚀 Getting Started

### Prerequisites

-  Node.js (16 or later)
-  npm or yarn
-  Expo CLI
-  Android Studio (for Android development)
-  Xcode (for iOS development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/elsesourav/meal-tracker.git
   cd meal-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**

   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

### Building for Production

#### Android APK

```bash
npm run build:android
```

#### Production Build

```bash
npm run build:android:production
```

## 🏗️ Technology Stack

-  **Framework**: React Native with Expo
-  **Navigation**: Expo Router
-  **State Management**: React Hooks & Context API
-  **Storage**: AsyncStorage
-  **Notifications**: Expo Notifications with Background Tasks
-  **Styling**: NativeWind (Tailwind CSS for React Native)
-  **TypeScript**: Full TypeScript support
-  **Build System**: EAS Build

## 📂 Project Structure

```
meal-tracker/
├── app/                          # App routes and screens
│   ├── _layout.tsx              # Root layout with navigation setup
│   ├── index.tsx                # Main meal tracking screen
│   └── settings/                # Settings screens
├── components/                   # Reusable UI components
│   ├── MealTable.tsx            # Main meal tracking table
│   ├── NotificationSettingsModal.tsx
│   └── ...
├── services/                     # Business logic services
│   ├── MealDataService.ts       # Meal data management
│   └── NotificationService.ts   # Background notifications
├── contexts/                     # React contexts
├── hooks/                        # Custom React hooks
├── utils/                        # Utility functions
└── assets/                       # Images, fonts, sounds
```

## 🔧 Key Components

### MealDataService

Handles all meal data operations including:

-  CRUD operations for meal data
-  Data export/import functionality
-  Date-based data retrieval

### NotificationService

Manages background notifications with:

-  Background task registration
-  Smart notification scheduling
-  Platform-specific optimizations
-  Permission handling

### Theme System

-  Light/Dark theme support
-  System theme detection
-  Persistent theme preferences

## 🔔 Notification Features

The app includes sophisticated background notification support:

-  **Background Tasks**: Notifications work even when app is closed
-  **Smart Scheduling**: Reminders adapt to your usage patterns
-  **Customizable Times**: Set your preferred reminder times
-  **Cross-Platform**: Optimized for both Android and iOS

## 📊 Data Management

-  **Local Storage**: All data stored locally on device
-  **Export/Import**: JSON-based data portability
-  **Date-based Organization**: Easy navigation through historical data
-  **Data Validation**: Robust error handling and data integrity

## 🛠️ Development

### Available Scripts

-  `npm start` - Start Expo development server
-  `npm run android` - Run on Android device/emulator
-  `npm run ios` - Run on iOS device/simulator
-  `npm run web` - Run in web browser
-  `npm run lint` - Run ESLint
-  `npm run build:android` - Build Android APK

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**elsesourav**

-  GitHub: [@elsesourav](https://github.com/elsesourav)

## 🙏 Acknowledgments

-  Built with React Native and Expo
-  Uses various open-source libraries and tools
-  Inspired by the need for simple meal tracking

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**© 2025 elsesourav. All rights reserved.**

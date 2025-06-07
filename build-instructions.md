# Meal Tracker APK Build Instructions

## Current Build Status

The APK build process has been initiated and is currently running.

## Build Configuration

-  **App Name**: Meal Tracker
-  **Package**: com.elsesourav.mealtracker
-  **Version**: 1.0.0
-  **Build Type**: APK (Preview Profile)
-  **Platform**: Android

## Build Commands Available

### Quick Build Commands

```bash
# Build APK for testing
npm run build:android

# Build production APK
npm run build:android:production

# Local build (faster, builds on your machine)
npx eas build --platform android --profile preview --local
```

## Installation Steps

### Option 1: Direct Installation (Recommended)

1. Once build completes, locate the APK file in your build output
2. Transfer to your Android device via:
   -  USB cable
   -  Email attachment
   -  Cloud storage (Google Drive, Dropbox)
   -  ADB install

### Option 2: ADB Installation

```bash
# Install via ADB (Android Debug Bridge)
adb install path/to/meal-tracker.apk

# If multiple devices connected
adb devices
adb -s DEVICE_ID install meal-tracker.apk
```

### Option 3: Enable Unknown Sources

1. On your Android device, go to Settings
2. Navigate to Security & Privacy
3. Enable "Install unknown apps" for your file manager
4. Transfer APK to device and tap to install

## Build Features Included

✅ Dark/Light theme support
✅ Meal tracking functionality  
✅ Custom date picker
✅ Notification settings
✅ Data export/import
✅ Statistics and analytics
✅ Settings management

## Troubleshooting

-  If build fails, check EAS CLI version: `npx eas --version`
-  Update EAS CLI: `npm install -g eas-cli`
-  Clear build cache: `npx eas build --clear-cache`

## Next Steps

1. Wait for build completion
2. Download APK from build output location
3. Install on your Android device
4. Test all app features
5. Report any issues

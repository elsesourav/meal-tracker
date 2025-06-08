#!/bin/bash

# =============================================================================
# Meal Tracker - Android Release Build Script
# =============================================================================
# This script automates the Android release APK build process
# Make sure you have already generated a release keystore using generate-keystore.sh
# =============================================================================

echo "🚀 Meal Tracker - Android Release Build"
echo "======================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected: meal-tracker project root"
    exit 1
fi

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "📱 Android project not found. Generating native code..."
    echo ""
    npx expo prebuild --platform android
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate Android project"
        exit 1
    fi
else
    echo "✅ Android project found"
fi

# Check if keystore exists
if [ ! -f "android/app/keystores/release.keystore" ]; then
    echo ""
    echo "🔑 Release keystore not found!"
    echo "   Expected location: android/app/keystores/release.keystore"
    echo ""
    read -p "   Do you want to generate it now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/generate-keystore.sh
        if [ $? -ne 0 ]; then
            echo "❌ Keystore generation failed"
            exit 1
        fi
    else
        echo "❌ Cannot build release APK without keystore"
        echo "   Run: ./scripts/generate-keystore.sh"
        exit 1
    fi
fi

# Check if gradle.properties has keystore config
if ! grep -q "MEAL_TRACKER_RELEASE_STORE_FILE" android/gradle.properties; then
    echo "⚠️  Keystore configuration not found in gradle.properties"
    echo "   Please update your passwords in android/gradle.properties"
    exit 1
fi

# Check if passwords are still placeholders
if grep -q "your_store_password\|your_key_password" android/gradle.properties; then
    echo ""
    echo "🔐 Please update your keystore passwords in android/gradle.properties"
    echo "   Current placeholders found:"
    grep -n "your_.*_password" android/gradle.properties
    echo ""
    echo "   Replace 'your_store_password' and 'your_key_password' with actual values"
    echo "   Then run this script again"
    exit 1
fi

echo ""
echo "🔨 Building Release APK..."
echo "========================="
echo ""

# Navigate to android directory and build
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release APK
echo "📦 Building signed release APK..."
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Release APK built successfully!"
    echo ""
    
    # Find the APK file
    APK_PATH=$(find . -name "app-release.apk" -type f | head -1)
    if [ -n "$APK_PATH" ]; then
        echo "📱 APK Location: $APK_PATH"
        
        # Get APK info
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 APK Size: $APK_SIZE"
        
        # Copy to root for easy access
        cp "$APK_PATH" "../meal-tracker-release.apk"
        echo "📋 Copied to: meal-tracker-release.apk (in project root)"
        echo ""
        
        echo "🎉 Build Complete!"
        echo "================="
        echo "• APK ready for distribution"
        echo "• Test the APK before publishing"
        echo "• Keep your keystore file safe"
        echo ""
    else
        echo "⚠️  APK file not found in expected location"
        echo "   Check: android/app/build/outputs/apk/release/"
    fi
else
    echo ""
    echo "❌ Build failed!"
    echo "==============="
    echo "Common issues:"
    echo "• Incorrect keystore passwords in gradle.properties"
    echo "• Missing keystore file"
    echo "• Android SDK/build tools issues"
    echo ""
    echo "Check the error messages above for details"
    exit 1
fi

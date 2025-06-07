#!/bin/bash

# Meal Tracker APK Installation Helper Script

echo "🍽️  Meal Tracker APK Installation Helper"
echo "========================================"

# Function to check if ADB is available
check_adb() {
    if command -v adb &> /dev/null; then
        echo "✅ ADB is available"
        return 0
    else
        echo "❌ ADB not found. Install Android SDK Platform Tools"
        return 1
    fi
}

# Function to install APK via ADB
install_via_adb() {
    local apk_path="$1"
    
    if [ ! -f "$apk_path" ]; then
        echo "❌ APK file not found: $apk_path"
        return 1
    fi
    
    echo "📱 Installing APK via ADB..."
    adb install "$apk_path"
    
    if [ $? -eq 0 ]; then
        echo "✅ APK installed successfully!"
        echo "🚀 You can now open Meal Tracker on your device"
    else
        echo "❌ Installation failed. Check device connection and USB debugging"
    fi
}

# Function to find APK files
find_apk() {
    echo "🔍 Looking for APK files..."
    
    # Common locations where EAS build might place APKs
    local search_paths=(
        "./build-output"
        "./dist"
        "."
        "~/Downloads"
    )
    
    for path in "${search_paths[@]}"; do
        if [ -d "$path" ]; then
            local apks=$(find "$path" -name "*.apk" -type f 2>/dev/null)
            if [ ! -z "$apks" ]; then
                echo "📦 Found APK files:"
                echo "$apks"
                return 0
            fi
        fi
    done
    
    echo "❌ No APK files found in common locations"
    echo "💡 Check your EAS build output for the APK location"
    return 1
}

# Main execution
echo ""
echo "1. Checking ADB availability..."
check_adb

echo ""
echo "2. Searching for APK files..."
find_apk

echo ""
echo "3. Installation options:"
echo "   a) Use: ./install-apk.sh path/to/your/app.apk"
echo "   b) Manually transfer APK to device and install"
echo "   c) Use cloud storage to transfer to device"

# If APK path provided as argument
if [ ! -z "$1" ]; then
    echo ""
    echo "4. Installing provided APK: $1"
    if check_adb; then
        install_via_adb "$1"
    fi
fi

echo ""
echo "📋 Manual Installation Steps:"
echo "   1. Transfer APK to Android device"
echo "   2. Enable 'Install unknown apps' in Settings > Security"
echo "   3. Open file manager and tap APK to install"
echo "   4. Follow installation prompts"

echo ""
echo "🎉 Enjoy using Meal Tracker!"

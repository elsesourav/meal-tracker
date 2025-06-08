#!/bin/bash

# =============================================================================
# Meal Tracker - Release Keystore Generation Script
# =============================================================================
# This script helps you generate a release keystore for signing your APK
# Run this script only once when setting up release builds for the first time
# =============================================================================

echo "🔐 Meal Tracker - Release Keystore Setup"
echo "========================================"
echo ""

# Navigate to the correct directory
cd "$(dirname "$0")/../android/app" || exit 1

# Check if keystores directory exists
if [ ! -d "keystores" ]; then
    echo "📁 Creating keystores directory..."
    mkdir -p keystores
fi

# Check if keystore already exists
if [ -f "keystores/release.keystore" ]; then
    echo "⚠️  Release keystore already exists!"
    echo "   Location: android/app/keystores/release.keystore"
    echo ""
    read -p "   Do you want to replace it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Keystore generation cancelled."
        exit 0
    fi
fi

echo ""
echo "🔑 Generating Release Keystore..."
echo "================================"
echo ""
echo "You'll be prompted to enter the following information:"
echo "  • Keystore password (remember this!)"
echo "  • Key password (can be same as keystore password)"
echo "  • Your name, organization, city, state, country"
echo ""
echo "⚠️  IMPORTANT: Remember your passwords! You'll need them to:"
echo "   1. Update android/gradle.properties"
echo "   2. Build signed release APKs"
echo "   3. Upload updates to app stores"
echo ""

# Generate the keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore keystores/release.keystore \
  -alias meal-tracker-key \
  -keyalg RSA -keysize 2048 -validity 10000

# Check if keystore was created successfully
if [ $? -eq 0 ] && [ -f "keystores/release.keystore" ]; then
    echo ""
    echo "✅ Release keystore created successfully!"
    echo "   Location: android/app/keystores/release.keystore"
    echo ""
    echo "📝 Next Steps:"
    echo "=============="
    echo "1. Update android/gradle.properties with your passwords:"
    echo "   MEAL_TRACKER_RELEASE_STORE_PASSWORD=your_store_password"
    echo "   MEAL_TRACKER_RELEASE_KEY_PASSWORD=your_key_password"
    echo ""
    echo "2. Build signed release APK:"
    echo "   cd android && ./gradlew assembleRelease"
    echo ""
    echo "🔒 Security Tips:"
    echo "==============="
    echo "• Keep your keystore file safe - back it up securely"
    echo "• Never commit passwords to version control"
    echo "• Consider using environment variables for passwords"
    echo "• Store keystore password in a secure password manager"
    echo ""
else
    echo ""
    echo "❌ Failed to create keystore!"
    echo "   Please check the error messages above and try again."
    exit 1
fi

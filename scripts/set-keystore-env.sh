#!/bin/bash

# =============================================================================
# Meal Tracker - Secure Environment Setup
# =============================================================================
# This script sets up environment variables for keystore passwords
# Run this before building release APKs: source ./scripts/set-keystore-env.sh
# =============================================================================

echo "🔐 Setting up keystore environment variables..."
echo "=============================================="
echo ""

# Prompt for store password
echo -n "Enter your keystore store password: "
read -s STORE_PASSWORD
echo ""

# Prompt for key password
echo -n "Enter your keystore key password: "
read -s KEY_PASSWORD
echo ""

# Export environment variables
export MEAL_TRACKER_STORE_PASSWORD="$STORE_PASSWORD"
export MEAL_TRACKER_KEY_PASSWORD="$KEY_PASSWORD"

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "📋 Variables exported:"
echo "  • MEAL_TRACKER_STORE_PASSWORD"
echo "  • MEAL_TRACKER_KEY_PASSWORD"
echo ""
echo "🚀 You can now run your build commands:"
echo "  npm run build:release"
echo "  ./scripts/build-release.sh"
echo ""
echo "⚠️  Note: These variables are only set for this terminal session"
echo "   You'll need to run this script again if you open a new terminal"
echo ""

# Clear password variables from script memory
unset STORE_PASSWORD
unset KEY_PASSWORD

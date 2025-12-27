#!/bin/bash

# Setup Validation Script for Secret Santa Google Play Publishing
# This script checks if all prerequisites are installed and configured

echo "🎅 Secret Santa - Google Play Publishing Setup Validator"
echo "========================================================"
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ((ERRORS++))
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 is missing"
        ((WARNINGS++))
        return 1
    fi
}

check_json() {
    if python3 -m json.tool "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is valid JSON"
        return 0
    else
        echo -e "${RED}✗${NC} $1 has JSON syntax errors"
        ((ERRORS++))
        return 1
    fi
}

# 1. Check Node.js and npm
echo "1️⃣  Checking Node.js and npm..."
check_command "node"
check_command "npm"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   Node version: $NODE_VERSION"
fi
echo ""

# 2. Check Java
echo "2️⃣  Checking Java JDK..."
check_command "java"
check_command "keytool"
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "   Java version: $JAVA_VERSION"
fi
echo ""

# 3. Check Android SDK
echo "3️⃣  Checking Android SDK..."
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✓${NC} ANDROID_HOME is set: $ANDROID_HOME"
    if [ -d "$ANDROID_HOME" ]; then
        echo -e "${GREEN}✓${NC} Android SDK directory exists"
    else
        echo -e "${RED}✗${NC} Android SDK directory not found"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} ANDROID_HOME is not set"
    echo "   Set it with: export ANDROID_HOME=/path/to/android/sdk"
    ((WARNINGS++))
fi
echo ""

# 4. Check npm dependencies
echo "4️⃣  Checking npm dependencies..."
if [ -f "package.json" ]; then
    check_file "package-lock.json"
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules directory exists"
        if [ -d "node_modules/@bubblewrap" ]; then
            echo -e "${GREEN}✓${NC} Bubblewrap CLI is installed"
        else
            echo -e "${YELLOW}⚠${NC} Bubblewrap CLI not found in node_modules"
            echo "   Run: npm install"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠${NC} node_modules not found"
        echo "   Run: npm install"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    ((ERRORS++))
fi
echo ""

# 5. Check configuration files
echo "5️⃣  Checking configuration files..."
check_file "twa-manifest.json" && check_json "twa-manifest.json"
check_file "manifest.json" && check_json "manifest.json"
check_file ".well-known/assetlinks.json" && check_json ".well-known/assetlinks.json"
check_file ".gitignore"
echo ""

# 6. Check documentation
echo "6️⃣  Checking documentation files..."
check_file "GOOGLE_PLAY_GUIDE.md"
check_file "QUICKSTART_PLAY_STORE.md"
check_file "PRIVACY_POLICY.md"
check_file "PLAY_STORE_ASSETS.md"
check_file "PUBLISHING_CHECKLIST.md"
check_file "TROUBLESHOOTING.md"
echo ""

# 7. Check GitHub Actions workflow
echo "7️⃣  Checking GitHub Actions workflow..."
check_file ".github/workflows/build-android.yml"
echo ""

# 8. Check keystore (optional but important)
echo "8️⃣  Checking keystore..."
if [ -f "android.keystore" ]; then
    echo -e "${GREEN}✓${NC} android.keystore exists"
    echo "   ${YELLOW}Note: Ensure this file is backed up securely!${NC}"
    
    # Try to verify keystore (without prompting for password)
    # Note: This may prompt for password if keystore is protected
    # Output is redirected to prevent password exposure in logs
    if keytool -list -v -keystore android.keystore -alias android 2>/dev/null | grep -q "Valid from"; then
        echo -e "${GREEN}✓${NC} Keystore is valid and accessible"
    else
        echo -e "${YELLOW}⚠${NC} Could not verify keystore (password-protected or invalid)"
        echo "   This is normal if your keystore requires a password"
    fi
else
    echo -e "${YELLOW}⚠${NC} android.keystore not found"
    echo "   Generate one with:"
    echo "   keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000"
    ((WARNINGS++))
fi
echo ""

# 9. Check assetlinks.json configuration
echo "9️⃣  Checking Digital Asset Links configuration..."
if [ -f ".well-known/assetlinks.json" ]; then
    if grep -q "REPLACE_WITH_YOUR" ".well-known/assetlinks.json"; then
        echo -e "${YELLOW}⚠${NC} assetlinks.json contains placeholder fingerprint"
        echo "   Update with your actual SHA-256 fingerprint from:"
        echo "   keytool -list -v -keystore android.keystore -alias android"
        echo "   Format: Remove colons from SHA-256 (e.g., AB:CD:EF... becomes ABCDEF...)"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓${NC} assetlinks.json appears to be configured"
    fi
fi
echo ""

# 10. Check if GitHub Pages could serve assetlinks
echo "🔟 Checking GitHub Pages configuration..."
if [ -f ".nojekyll" ]; then
    echo -e "${GREEN}✓${NC} .nojekyll file exists (ensures .well-known is served)"
else
    echo -e "${YELLOW}⚠${NC} .nojekyll file missing"
    echo "   Create it to ensure GitHub Pages serves .well-known directory:"
    echo "   touch .nojekyll"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "========================================================"
echo "📊 Validation Summary"
echo "========================================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to build.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. npm run android:build"
    echo "  2. Upload app-release-bundle.aab to Play Console"
    echo ""
    echo "For detailed instructions, see QUICKSTART_PLAY_STORE.md"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup is mostly ready, but there are $WARNINGS warning(s).${NC}"
    echo "Review the warnings above and address them if needed."
    echo ""
    echo "You can proceed with building, but some features may not work correctly."
else
    echo -e "${RED}✗ Setup is incomplete. Found $ERRORS error(s) and $WARNINGS warning(s).${NC}"
    echo "Please fix the errors above before proceeding."
    echo ""
    echo "For help, see TROUBLESHOOTING.md"
fi

exit $ERRORS

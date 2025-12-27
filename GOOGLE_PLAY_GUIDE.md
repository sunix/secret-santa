# Google Play Store Publishing Guide for Secret Santa

This guide explains how to publish the Secret Santa PWA to the Google Play Store using Trusted Web Activity (TWA).

## Prerequisites

1. **Google Play Console Account**: You need a Google Play Developer account ($25 one-time fee)
2. **Android Development Tools**: 
   - Java JDK 8 or higher
   - Android SDK (can be installed via Android Studio)
3. **Node.js and npm**: For running Bubblewrap CLI

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure the Android App

The TWA configuration is already set up in `twa-manifest.json`. Key settings:

- **Package ID**: `io.github.sunix.secretsanta`
- **App Name**: Secret Santa
- **Host**: sunix.github.io
- **Start URL**: /secret-santa/
- **Theme Color**: #c41e3a (Christmas red)
- **Orientation**: portrait

### 3. Generate Android Keystore (First Time Only)

Create a keystore file for signing your app:

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

**Important**: 
- Save the keystore password and alias password securely
- Never commit the keystore file to version control (it's in .gitignore)
- Back up your keystore file - if you lose it, you cannot update your app on Play Store

### 4. Get Your App's Signing Fingerprint

After creating the keystore, get the SHA-256 fingerprint:

```bash
keytool -list -v -keystore android.keystore -alias android
```

Copy the SHA-256 fingerprint and update `.well-known/assetlinks.json`:

```json
{
  "sha256_cert_fingerprints": [
    "YOUR_SHA256_FINGERPRINT_HERE"
  ]
}
```

### 5. Deploy assetlinks.json

The `.well-known/assetlinks.json` file must be accessible at:
```
https://sunix.github.io/secret-santa/.well-known/assetlinks.json
```

This file establishes the link between your website and Android app. Ensure it's deployed with your GitHub Pages site.

## Building the Android App

### Option 1: Build Locally

1. **Initialize the Android project** (first time only):
```bash
npm run android:init
```

2. **Build the APK/AAB**:
```bash
npm run android:build
```

This will generate:
- `app-release-signed.apk` - For direct installation or testing
- `app-release-bundle.aab` - For uploading to Play Store (recommended)

### Option 2: Use GitHub Actions (Automated)

A GitHub Actions workflow can be set up to automatically build the Android app. See `.github/workflows/build-android.yml` for the automated build configuration.

## Preparing for Play Store Submission

### 1. App Information

- **App Name**: Secret Santa
- **Short Description**: Organize your Secret Santa gift exchange with friends
- **Full Description**: 
```
Secret Santa is a Progressive Web App that helps you organize gift exchanges with your friends and family during the holiday season!

Features:
🎲 Easy participant management
🎁 Sequential drawing process
💑 Couple management to prevent matching partners
🔄 Ability to restart draws
📱 Works offline as a PWA
🎨 Festive Christmas-themed interface
🌐 Available in French and English
```

- **Category**: Entertainment or Lifestyle
- **Content Rating**: Everyone

### 2. Required Assets

You'll need to prepare the following:

#### App Icons
✅ Already configured:
- 192x192 icon (icon-192.png)
- 512x512 icon (icon-512.png)

#### Screenshots (Required)
Prepare at least 2 screenshots (up to 8):
- Minimum dimension: 320px
- Maximum dimension: 3840px
- Recommended: 1080x1920 (portrait) or 1920x1080 (landscape)

Screenshots should show:
1. Participant entry screen
2. Drawing in progress
3. Final results

#### Feature Graphic (Required)
- Size: 1024x500 pixels
- Shows at the top of your Play Store listing

#### Promotional Video (Optional)
- YouTube video URL showing app features

### 3. Privacy Policy

You must provide a privacy policy URL. Key points to cover:
- No personal data is collected
- All data stays on the user's device
- No third-party analytics or tracking

Example: Create a `PRIVACY_POLICY.md` file and host it on GitHub Pages.

### 4. Store Listing Languages

The app supports:
- French (fr) - Primary language
- English (en)

Provide store listing translations in both languages.

## Uploading to Play Console

### 1. Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details
4. Select "App" (not Game)
5. Choose "Free" (or "Paid" if charging)

### 2. Upload App Bundle

1. Go to "Production" → "Create new release"
2. Upload the `app-release-bundle.aab` file
3. Fill in release notes
4. Review and roll out

### 3. Complete Store Listing

Fill in all required information:
- App name
- Short description
- Full description
- Screenshots
- Feature graphic
- App icon (will be extracted from AAB)
- Privacy policy URL
- Contact email

### 4. Content Rating

Complete the content rating questionnaire:
- Select "No" for violence, mature content, etc.
- The app should receive an "Everyone" rating

### 5. Target Audience

- Age group: All ages
- No ads (unless you add them)

### 6. Submit for Review

Once everything is complete, submit your app for review. The review process typically takes 1-3 days.

## Updating the App

When you need to release an update:

1. **Update version in twa-manifest.json**:
```json
{
  "appVersionCode": 2,
  "appVersionName": "1.0.1"
}
```

2. **Build new bundle**:
```bash
npm run android:build
```

3. **Upload to Play Console**:
- Go to "Production" → "Create new release"
- Upload new AAB file
- Add release notes describing changes
- Submit for review

## Testing Before Publication

### Test on Device

```bash
# Install directly on connected Android device
npm run android:install
```

### Internal Testing

Use Play Console's internal testing track to distribute to a small group before going live:
1. Go to "Internal testing" in Play Console
2. Create release
3. Add testers by email
4. Share the opt-in URL with testers

## Troubleshooting

### Digital Asset Links Not Verified

If the app opens in browser instead of native:
1. Verify assetlinks.json is accessible at the correct URL
2. Check that SHA-256 fingerprint matches your keystore
3. Use [Asset Links Testing Tool](https://developers.google.com/digital-asset-links/tools/generator)

### Build Failures

- Ensure Android SDK is properly installed
- Check that Java JDK is version 8 or higher
- Verify twa-manifest.json has no syntax errors

### App Rejected

Common reasons:
- Missing privacy policy
- Incomplete store listing
- App crashes on launch
- Digital Asset Links not working

## Additional Resources

- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA Quick Start Guide](https://developers.google.com/web/android/trusted-web-activity/quick-start)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [PWA to Play Store Guide](https://web.dev/using-a-pwa-in-your-android-app/)

## Security Notes

⚠️ **Never commit these files to git**:
- `android.keystore` - Your signing key
- Keystore passwords
- Play Console credentials

✅ **These files are already in .gitignore**:
- `*.keystore`
- `*.jks`
- `android/`
- `node_modules/`

## Support

If you encounter issues:
1. Check the [Bubblewrap issues](https://github.com/GoogleChromeLabs/bubblewrap/issues)
2. Review [TWA documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
3. Contact Google Play Console support for store-specific issues

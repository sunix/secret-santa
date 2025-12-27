# Quick Start: Publishing to Google Play Store

This is a quick reference guide. For detailed instructions, see [GOOGLE_PLAY_GUIDE.md](GOOGLE_PLAY_GUIDE.md).

## Prerequisites Checklist

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] Java JDK 8+ installed
- [ ] Android SDK installed (via Android Studio or standalone)
- [ ] Node.js and npm installed

## Step-by-Step Quick Setup

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Generate Signing Key (2 minutes)

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

**Save these securely:**
- Keystore password
- Key alias password (can be same as keystore password)

### 3. Get SHA-256 Fingerprint (1 minute)

```bash
keytool -list -v -keystore android.keystore -alias android
```

Copy the SHA-256 fingerprint (looks like: `AB:CD:EF:12:34:...`)

### 4. Update Digital Asset Links (2 minutes)

Edit `.well-known/assetlinks.json`:

```json
{
  "sha256_cert_fingerprints": [
    "YOUR_SHA256_FINGERPRINT_WITHOUT_COLONS"
  ]
}
```

Commit and push to deploy on GitHub Pages.

Verify it's accessible at:
https://sunix.github.io/secret-santa/.well-known/assetlinks.json

### 5. Build the App (5 minutes)

```bash
npm run android:build
```

This creates:
- `app-release-signed.apk` - For testing
- `app-release-bundle.aab` - For Play Store upload ⭐

### 6. Test Locally (Optional)

```bash
# Connect Android device via USB with USB debugging enabled
npm run android:install
```

### 7. Upload to Play Console (15 minutes)

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill basic information
4. Go to "Production" → "Create release"
5. Upload `app-release-bundle.aab`
6. Complete store listing:
   - App name: Secret Santa
   - Short description
   - Full description
   - Screenshots (at least 2)
   - Feature graphic (1024x500)
   - App icon (auto-extracted from AAB)
   - Privacy policy URL
7. Complete content rating questionnaire
8. Submit for review

### 8. Wait for Approval (1-3 days)

Google will review your app. You'll receive an email when:
- ✅ App is approved and published
- ❌ App needs changes

## Updating the App

When releasing an update:

1. Edit `twa-manifest.json`:
```json
{
  "appVersionCode": 2,  // Increment by 1
  "appVersionName": "1.0.1"  // Your version
}
```

2. Build:
```bash
npm run android:build
```

3. Upload new AAB to Play Console → Production → Create release

## Common Issues

### "App opens in browser instead of native"
→ Check assetlinks.json is accessible and fingerprint matches

### "Build failed"
→ Ensure Android SDK and Java JDK are installed and in PATH

### "Keystore not found"
→ Make sure android.keystore is in the project root (not committed to git)

## Automated Builds (Optional)

Set up GitHub Actions for automated builds:

1. Encode your keystore:
```bash
base64 android.keystore > keystore.base64
```

2. Add GitHub secrets:
- `KEYSTORE_BASE64` → content of keystore.base64
- `KEYSTORE_PASSWORD` → your keystore password
- `KEY_PASSWORD` → your key alias password

3. Push a tag to trigger build:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Resources

- 📖 [Full Documentation](GOOGLE_PLAY_GUIDE.md)
- 🔧 [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- 🎮 [Play Console](https://play.google.com/console)
- 🔗 [TWA Quick Start](https://developers.google.com/web/android/trusted-web-activity/quick-start)

## Need Help?

1. Check [GOOGLE_PLAY_GUIDE.md](GOOGLE_PLAY_GUIDE.md) for detailed troubleshooting
2. Review [Bubblewrap issues](https://github.com/GoogleChromeLabs/bubblewrap/issues)
3. Check [TWA documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)

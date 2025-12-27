# Troubleshooting Guide

Common issues and solutions when publishing Secret Santa to Google Play Store.

## Build Issues

### "bubblewrap: command not found"

**Problem:** Bubblewrap CLI is not installed or not in PATH.

**Solution:**
```bash
npm install
# or
npm install -g @bubblewrap/cli
```

### "keytool: command not found"

**Problem:** Java JDK is not installed or not in PATH.

**Solution:**
- Install Java JDK 8 or higher
- On Ubuntu/Debian: `sudo apt install openjdk-11-jdk`
- On macOS: `brew install openjdk@11`
- On Windows: Download from Oracle or use OpenJDK

Verify: `java -version`

### "Android SDK not found"

**Problem:** Android SDK is not installed or ANDROID_HOME not set.

**Solution:**
1. Install Android Studio or standalone Android SDK
2. Set environment variable:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```
3. Add to `.bashrc` or `.zshrc` for persistence

### Build fails with "Gradle error"

**Problem:** Gradle build issues, often related to Android SDK versions.

**Solution:**
1. Update Android SDK: Open Android Studio → SDK Manager → Update all
2. Accept licenses: `$ANDROID_HOME/tools/bin/sdkmanager --licenses`
3. Clear Gradle cache: `rm -rf ~/.gradle/caches/`
4. Try build again

### "Error: Invalid keystore format"

**Problem:** Keystore file is corrupted or wrong format.

**Solution:**
1. Regenerate keystore:
   ```bash
   keytool -genkey -v -keystore android.keystore -alias android \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Ensure you're using the correct password
3. Verify keystore:
   ```bash
   keytool -list -v -keystore android.keystore
   ```

## Digital Asset Links Issues

### App opens in browser instead of native view

**Problem:** Digital Asset Links verification failed.

**Symptoms:**
- App opens URL in Chrome Custom Tabs instead of fullscreen
- Browser UI visible at bottom

**Solutions:**

1. **Verify assetlinks.json is accessible:**
   ```bash
   curl https://sunix.github.io/secret-santa/.well-known/assetlinks.json
   ```
   Should return JSON with your package name and fingerprint.

2. **Verify fingerprint matches:**
   ```bash
   keytool -list -v -keystore android.keystore -alias android | grep SHA256
   ```
   Compare with fingerprint in assetlinks.json (remove colons).

3. **Check package name matches:**
   - In `twa-manifest.json`: `"packageId": "io.github.sunix.secretsanta"`
   - In `assetlinks.json`: `"package_name": "io.github.sunix.secretsanta"`
   - In built APK: Check with `aapt dump badging app-release-signed.apk | grep package`

4. **Use Google's verification tool:**
   - Visit: https://developers.google.com/digital-asset-links/tools/generator
   - Enter: `https://sunix.github.io` and package name
   - Check if verification passes

5. **Wait for propagation:**
   - After updating assetlinks.json, wait 5-10 minutes
   - Clear app data and reinstall

6. **Check GitHub Pages deployment:**
   - Ensure `.well-known` directory is deployed
   - Check GitHub Pages settings
   - May need to add `.nojekyll` file if using custom directories

### "Deployment of .well-known failed"

**Problem:** GitHub Pages not serving `.well-known` directory.

**Solution:**
1. Create `.nojekyll` file in repo root:
   ```bash
   touch .nojekyll
   git add .nojekyll
   git commit -m "Enable .well-known directory"
   git push
   ```
2. Wait for GitHub Pages to redeploy (~1 minute)
3. Verify: `curl https://sunix.github.io/secret-santa/.well-known/assetlinks.json`

## Play Store Issues

### "Your app doesn't meet device policy requirements"

**Problem:** APK/AAB doesn't meet minimum requirements.

**Solution:**
1. Ensure minimum SDK version is appropriate (API 21+ recommended)
2. Check `twa-manifest.json` for correct configuration
3. Rebuild with updated settings

### "App rejected: Privacy policy missing"

**Problem:** Privacy policy URL not provided or not accessible.

**Solution:**
1. Upload `PRIVACY_POLICY.md` as HTML to GitHub Pages
2. Add URL to Play Console: Settings → App content → Privacy policy
3. Ensure URL is publicly accessible (not requiring login)

### "Missing screenshots"

**Problem:** Insufficient or incorrect screenshots uploaded.

**Solution:**
- Upload at least 2 screenshots
- Check resolution requirements:
  - Minimum: 320px on shortest side
  - Maximum: 3840px on longest side
- Use PNG or JPEG format
- No alpha channel

### "Feature graphic doesn't meet requirements"

**Problem:** Feature graphic wrong size or format.

**Solution:**
- Must be exactly 1024x500 pixels
- PNG or JPEG format
- No transparency
- Recreate or resize graphic

### "App signing error"

**Problem:** Issues with app signing in Play Console.

**Solution:**
1. Enroll in Google Play App Signing (recommended)
2. Upload signed AAB (not APK)
3. Google will manage signing keys
4. Update Digital Asset Links with Play Store signing certificate SHA-256

To get Play Store SHA-256:
1. Play Console → Setup → App signing
2. Copy SHA-256 certificate fingerprint
3. Add to assetlinks.json

### "Version code must be higher"

**Problem:** Trying to upload AAB with same or lower version code.

**Solution:**
1. Edit `twa-manifest.json`:
   ```json
   {
     "appVersionCode": 2,  // Increment this
     "appVersionName": "1.0.1"
   }
   ```
2. Rebuild: `npm run android:build`
3. Upload new AAB

## Installation Issues

### "App not installed"

**Problem:** APK installation failed on device.

**Solutions:**
1. Enable "Install from unknown sources" in device settings
2. Uninstall previous version first
3. Check device has sufficient storage
4. Ensure APK is for correct architecture (use AAB for universal)
5. Check minimum Android version requirement

### "Parse error: There is a problem parsing the package"

**Problem:** APK is corrupted or incompatible.

**Solution:**
1. Re-download APK (may have corrupted during transfer)
2. Rebuild APK: `npm run android:build`
3. Check Android version compatibility
4. Try installing via ADB:
   ```bash
   adb install app-release-signed.apk
   ```

## Testing Issues

### Can't test on emulator

**Problem:** Want to test without physical device.

**Solution:**
1. Install Android Studio
2. Create Android Virtual Device (AVD)
3. Start emulator
4. Install APK:
   ```bash
   adb install app-release-signed.apk
   ```

### Digital Asset Links not working in development

**Problem:** Testing TWA with localhost or test domain.

**Solution:**
- Digital Asset Links require HTTPS and public domain
- For testing, the app will fall back to Custom Tabs (browser view)
- Must test with production domain (sunix.github.io) for full TWA experience
- Or use internal testing track in Play Console

## CI/CD Issues (GitHub Actions)

### "KEYSTORE_BASE64 secret not found"

**Problem:** GitHub Actions can't find keystore secret.

**Solution:**
1. Encode keystore:
   ```bash
   base64 android.keystore > keystore.base64
   ```
2. Add to GitHub: Settings → Secrets → Actions → New secret
3. Name: `KEYSTORE_BASE64`
4. Value: Contents of keystore.base64

### "GitHub Actions build fails"

**Problem:** Automated build not working.

**Solution:**
1. Check workflow file syntax: `.github/workflows/build-android.yml`
2. Verify all secrets are set:
   - KEYSTORE_BASE64
   - KEYSTORE_PASSWORD
   - KEY_PASSWORD
3. Check workflow run logs for specific error
4. Test build locally first: `npm run android:build`

### "Artifacts not uploaded"

**Problem:** Build succeeds but files not available.

**Solution:**
1. Check if files exist after build:
   - `app-release-signed.apk`
   - `app-release-bundle.aab`
2. Verify artifact upload step in workflow
3. Check retention days setting (default 30 days)

## Runtime Issues

### App crashes on startup

**Problem:** App crashes immediately after launch.

**Debugging:**
1. Check Android logs:
   ```bash
   adb logcat | grep -i "secret santa"
   ```
2. Test PWA directly in browser
3. Verify manifest.json is correct
4. Check if webManifestUrl in twa-manifest.json is accessible

### Features not working

**Problem:** Some features broken in TWA but work in browser.

**Solution:**
1. Verify web app is fully functional in browser first
2. Check if feature requires permissions (camera, location, etc.)
3. Test with Chrome browser on Android to isolate TWA vs web issue
4. Review Chrome DevTools console for JavaScript errors

## Getting Help

If issues persist:

1. **Review documentation:**
   - [GOOGLE_PLAY_GUIDE.md](GOOGLE_PLAY_GUIDE.md)
   - [QUICKSTART_PLAY_STORE.md](QUICKSTART_PLAY_STORE.md)

2. **Check official resources:**
   - [Bubblewrap Issues](https://github.com/GoogleChromeLabs/bubblewrap/issues)
   - [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
   - [Play Console Help](https://support.google.com/googleplay/android-developer)

3. **Search for similar issues:**
   - Stack Overflow: `[trusted-web-activity]` tag
   - GitHub issues in Bubblewrap repository

4. **Create detailed bug report:**
   - Include error messages
   - List steps to reproduce
   - Provide environment details (OS, versions, etc.)
   - Share relevant configuration files (twa-manifest.json, etc.)

## Preventive Measures

To avoid issues:

- ✅ Always backup your keystore file
- ✅ Test locally before submitting to Play Store
- ✅ Keep documentation updated with your specific setup
- ✅ Use version control for all configuration files
- ✅ Document any non-standard setup steps
- ✅ Test Digital Asset Links before publishing updates
- ✅ Keep Android SDK and tools updated
- ✅ Follow Play Store policies carefully

# Google Play Store Publishing Checklist

Use this checklist to track your progress when publishing the Secret Santa app to the Google Play Store.

## Pre-Publishing Setup

### Development Environment
- [ ] Node.js and npm installed
- [ ] Java JDK 8+ installed and configured
- [ ] Android SDK installed (via Android Studio or standalone)
- [ ] Git installed and configured
- [ ] Bubblewrap dependencies installed (`npm install`)

### Google Play Account
- [ ] Google Play Developer account created ($25 fee paid)
- [ ] Developer profile completed
- [ ] Payment profile set up (if planning paid apps)
- [ ] Two-factor authentication enabled (recommended)

## Build Setup

### Keystore Generation
- [ ] Android keystore generated (`keytool -genkey ...`)
- [ ] Keystore password saved securely (password manager)
- [ ] Key alias password saved securely
- [ ] Keystore file backed up to secure location
- [ ] Keystore file added to .gitignore (already done)

### Digital Asset Links
- [ ] SHA-256 fingerprint extracted from keystore
- [ ] `.well-known/assetlinks.json` updated with fingerprint
- [ ] assetlinks.json committed to git
- [ ] assetlinks.json deployed to GitHub Pages
- [ ] assetlinks.json accessible at: https://sunix.github.io/secret-santa/.well-known/assetlinks.json
- [ ] Digital Asset Links verified using Google's testing tool

## Build Process

### First Build
- [ ] TWA configuration reviewed (`twa-manifest.json`)
- [ ] App version set correctly (appVersionCode: 1, appVersionName: 1.0.0)
- [ ] Package ID confirmed: `io.github.sunix.secretsanta`
- [ ] Build executed successfully (`npm run android:build`)
- [ ] APK generated: `app-release-signed.apk`
- [ ] AAB generated: `app-release-bundle.aab`

### Local Testing
- [ ] APK installed on test device
- [ ] App launches without crashes
- [ ] App links to website work correctly (opens in app, not browser)
- [ ] All features work as expected
- [ ] Offline functionality verified
- [ ] Multi-language support tested

## Play Store Assets

### Required Graphics
- [ ] App icon verified (512x512, already exists)
- [ ] Feature graphic created (1024x500)
- [ ] At least 2 screenshots captured (minimum)
- [ ] Screenshots edited/formatted for Play Store
- [ ] All graphics reviewed for quality

### Optional Graphics
- [ ] Promotional video created
- [ ] Promotional video uploaded to YouTube
- [ ] YouTube video URL noted
- [ ] Additional screenshots (up to 8 total)

## Store Listing Content

### English Listing
- [ ] App name: "Secret Santa"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] What's new / Release notes
- [ ] Screenshots uploaded (2-8 images)
- [ ] Feature graphic uploaded
- [ ] Promotional video URL (optional)

### French Listing (if applicable)
- [ ] App name: "Secret Santa"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] What's new / Release notes
- [ ] Screenshots uploaded (2-8 images)
- [ ] Feature graphic uploaded

## Privacy & Legal

### Privacy Policy
- [ ] Privacy policy reviewed (`PRIVACY_POLICY.md`)
- [ ] Privacy policy uploaded to GitHub Pages as HTML
- [ ] Privacy policy URL accessible: https://sunix.github.io/secret-santa/PRIVACY_POLICY.html
- [ ] Privacy policy URL added to Play Console

### Legal Information
- [ ] Developer contact email added
- [ ] Developer website URL added
- [ ] Physical address added (required by Google)
- [ ] App complies with all policies reviewed

## Play Console Setup

### App Creation
- [ ] New app created in Play Console
- [ ] App name set: "Secret Santa"
- [ ] Default language set (English or French)
- [ ] App type selected: App (not Game)
- [ ] App category selected: Lifestyle or Entertainment

### Store Listing
- [ ] Store listing section completed
- [ ] Graphics uploaded
- [ ] Privacy policy URL added
- [ ] Developer contact info added
- [ ] Short and full descriptions added
- [ ] Store listing preview reviewed

### Content Rating
- [ ] Content rating questionnaire completed
- [ ] All questions answered accurately
- [ ] Rating certificate received
- [ ] Expected rating: Everyone/PEGI 3

### Target Audience
- [ ] Target age groups selected: All ages
- [ ] Store presence in target countries selected
- [ ] Age requirements confirmed

### App Content
- [ ] Ads declaration: No ads
- [ ] In-app purchases declaration: No purchases
- [ ] App access: Not restricted
- [ ] Content guidelines compliance confirmed

### Pricing & Distribution
- [ ] App set as Free
- [ ] Countries/regions selected for distribution
- [ ] Device categories: Phone and Tablet
- [ ] Android version: Minimum API level confirmed

## Production Release

### First Release
- [ ] Production release track opened
- [ ] AAB file uploaded (`app-release-bundle.aab`)
- [ ] Release name: "1.0.0" or similar
- [ ] Release notes added (What's new)
- [ ] App signing enrolled (recommended: Google Play App Signing)

### Pre-Submission Review
- [ ] All dashboard sections showing "Complete" (green checks)
- [ ] No errors or warnings in dashboard
- [ ] Store listing preview looks correct
- [ ] Test device install successful
- [ ] Digital Asset Links working correctly

### Submission
- [ ] "Review release" clicked
- [ ] Final review completed
- [ ] "Start rollout to Production" clicked
- [ ] Confirmation email received
- [ ] Submission status noted

## Post-Submission

### Review Process
- [ ] Initial automated checks passed (usually immediate)
- [ ] Submitted for human review (1-3 days typically)
- [ ] Review status checked daily
- [ ] Approval notification received

### After Approval
- [ ] App live on Play Store verified
- [ ] Play Store listing checked
- [ ] App installable from Play Store
- [ ] Digital Asset Links working in production
- [ ] App shared with team/friends for testing

### Documentation
- [ ] Play Store URL documented
- [ ] Release notes saved
- [ ] Keystore backup verified
- [ ] Passwords saved securely
- [ ] Update process documented

## Optional: Automated CI/CD

### GitHub Actions Setup
- [ ] Keystore encoded to base64
- [ ] GitHub secrets configured:
  - [ ] `KEYSTORE_BASE64`
  - [ ] `KEYSTORE_PASSWORD`
  - [ ] `KEY_PASSWORD`
- [ ] GitHub Actions workflow tested
- [ ] Automated build verified
- [ ] Tag-based releases configured

## Future Updates

### Version Management
- [ ] Version tracking system established
- [ ] Changelog maintained
- [ ] Release schedule planned

### Update Process Template
- [ ] Code changes made and tested
- [ ] Version numbers incremented in `twa-manifest.json`
- [ ] AAB built with new version
- [ ] Release notes written
- [ ] New release created in Play Console
- [ ] New AAB uploaded
- [ ] Release submitted for review

## Notes

Use this space to record any specific information:

**Play Store URL:**
_______________________________________

**First Release Date:**
_______________________________________

**Keystore Location (secure backup):**
_______________________________________

**Important Decisions/Notes:**
_______________________________________
_______________________________________
_______________________________________

## Quick Reference Links

- Play Console: https://play.google.com/console
- Asset Links Tool: https://developers.google.com/digital-asset-links/tools/generator
- TWA Documentation: https://developer.chrome.com/docs/android/trusted-web-activity/
- Bubblewrap GitHub: https://github.com/GoogleChromeLabs/bubblewrap
- Play Store Policies: https://play.google.com/about/developer-content-policy/

## Status Legend

- [ ] Not started
- [x] Completed
- [~] In progress
- [!] Blocked/Issue

---

**Last Updated:** [Date]
**Updated By:** [Name]

# Firebase Cloud Messaging (FCM) Setup Guide for Android

This guide will walk you through setting up Firebase Cloud Messaging (FCM) for Android push notifications in your Expo React Native app.

## Prerequisites

- A Google account
- An Expo account
- Expo CLI installed (`npm install -g expo-cli`)
- Android device or emulator for testing

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. **Create a New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `SevApp` (or your preferred name)
   - Disable Google Analytics (optional, you can enable later)
   - Click "Create project"

3. **Wait for project creation** (takes a few seconds)

## Step 2: Add Android App to Firebase

1. **In Firebase Console**, click the Android icon (or "Add app" → Android)

2. **Register your Android app**:
   - **Android package name**: `com.sevapp.app` (from your `app.json`)
   - **App nickname** (optional): `SevApp Android`
   - **Debug signing certificate SHA-1** (optional for now, needed for production)
   - Click "Register app"

3. **Download `google-services.json`**:
   - Click "Download google-services.json"
   - **IMPORTANT**: Save this file - you'll need it later

4. **Skip the next steps** in Firebase console (we'll configure via Expo)

## Step 3: Get FCM Server Key

1. **In Firebase Console**, go to:
   - Project Settings (gear icon) → Cloud Messaging tab

2. **Find "Cloud Messaging API (Legacy)"**:
   - If you see "Cloud Messaging API (Legacy)" section, note the **Server key**
   - If not visible, you may need to enable it:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Select your Firebase project
     - Go to "APIs & Services" → "Library"
     - Search for "Firebase Cloud Messaging API"
     - Click "Enable"

3. **Copy the Server Key**:
   - It looks like: `AAAAxxxxxxx:APA91bHxxxxxxx...`
   - Save this key securely

## Step 4: Configure Expo for FCM

### Option A: Using Expo EAS (Recommended for Production)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure your project**:
   ```bash
   eas build:configure
   ```

4. **Add FCM credentials**:
   ```bash
   eas credentials
   ```
   - Select your project
   - Select "Android"
   - Select "Push Notifications"
   - Choose "Set up a new FCM key"
   - Paste your FCM Server Key when prompted

### Option B: Using Expo Classic Build (Legacy)

1. **Install Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

2. **Login to Expo**:
   ```bash
   expo login
   ```

3. **Configure credentials**:
   ```bash
   expo build:android
   ```
   - When prompted, choose to configure credentials
   - Enter your FCM Server Key

## Step 5: Update app.json

Your `app.json` should already have the notification plugin configured. Verify it looks like this:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "android": {
      "package": "com.sevapp.app",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

**Note**: For Expo managed workflow, you typically don't need to manually add `google-services.json`. Expo handles this during the build process.

## Step 6: Add google-services.json (For Bare Workflow Only)

If you're using **Expo bare workflow** or have ejected:

1. **Place `google-services.json`** in your project root:
   ```
   SevApp/
   ├── google-services.json  ← Place it here
   ├── app.json
   └── ...
   ```

2. **Update `android/app/build.gradle`** (if using bare workflow):
   ```gradle
   // Add at the bottom of the file
   apply plugin: 'com.google.gms.google-services'
   ```

3. **Update `android/build.gradle`**:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
   }
   ```

## Step 7: Test Push Notifications

### Test with Expo Push Notification Tool

1. **Get your Expo push token** (from your app logs or code):
   ```typescript
   import * as Notifications from 'expo-notifications';
   const token = await Notifications.getExpoPushTokenAsync();
   console.log('Push token:', token.data);
   ```

2. **Send a test notification**:
   - Visit [https://expo.dev/notifications](https://expo.dev/notifications)
   - Or use the Expo CLI:
     ```bash
     expo send-notification --to YOUR_EXPO_PUSH_TOKEN --title "Test" --body "Hello from FCM!"
     ```

### Test with Firebase Console

1. **In Firebase Console**, go to:
   - Cloud Messaging → "Send test message"

2. **Enter your FCM token** (different from Expo push token):
   - You'll need to get this from your app
   - Or use Expo's push token (Expo handles the conversion)

3. **Send test notification**

## Step 8: Production Setup

### Get SHA-1 Certificate Fingerprint

For production builds, you need to add your app's SHA-1 fingerprint to Firebase:

1. **Get your keystore SHA-1**:
   ```bash
   keytool -list -v -keystore your-keystore.jks -alias your-key-alias
   ```

2. **Add SHA-1 to Firebase**:
   - Firebase Console → Project Settings → Your Android App
   - Click "Add fingerprint"
   - Paste your SHA-1

### Build Production APK/AAB

```bash
# Using EAS Build
eas build --platform android --profile production

# Or using Expo Classic
expo build:android -t app-bundle  # For Play Store
expo build:android -t apk          # For direct install
```

## Troubleshooting

### "FCM token not received"

1. **Check permissions**:
   - Ensure notification permissions are granted
   - Check `app.json` has notification plugin configured

2. **Verify FCM Server Key**:
   - Make sure the key is correctly set in Expo credentials
   - Key should start with `AAAA...`

3. **Check device connection**:
   - Ensure device has internet connection
   - Try on a physical device (emulators may have issues)

### "Notifications not appearing"

1. **Check notification channel** (Android 8+):
   - Ensure notification channel is created
   - Check channel importance settings

2. **Verify app is in foreground/background**:
   - Test both scenarios
   - Check notification handler in `App.tsx`

3. **Check logs**:
   ```bash
   npx expo start
   # Check console for errors
   ```

### "Build fails with FCM error"

1. **Verify google-services.json**:
   - Ensure package name matches `app.json`
   - Check file is in correct location

2. **Clear build cache**:
   ```bash
   expo start --clear
   ```

3. **Check Expo SDK version**:
   - Ensure you're using a compatible Expo SDK version
   - Update if necessary: `expo upgrade`

## Alternative: Using Expo's Push Notification Service

If you don't want to set up FCM directly, Expo provides a managed push notification service:

1. **No FCM setup required**
2. **Use Expo push tokens** (already implemented in your code)
3. **Send via Expo API**:
   ```bash
   curl -H "Content-Type: application/json" \
        -X POST https://exp.host/--/api/v2/push/send \
        -d '{
          "to": "ExponentPushToken[xxxxx]",
          "title": "Hello",
          "body": "World"
        }'
   ```

**Note**: Expo's service is great for development and small apps, but FCM is recommended for production apps with high notification volume.

## Quick Reference

### Important Files/Keys:
- **FCM Server Key**: Firebase Console → Project Settings → Cloud Messaging
- **Package Name**: `com.sevapp.app` (from `app.json`)
- **google-services.json**: Downloaded from Firebase Console

### Useful Commands:
```bash
# Check Expo credentials
eas credentials

# Build Android app
eas build --platform android

# Test push notification
expo send-notification --to TOKEN --title "Test" --body "Message"

# View logs
npx expo start
```

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Get FCM Server Key
3. ✅ Configure in Expo
4. ✅ Test notifications
5. ✅ Build production app
6. ✅ Deploy to Google Play Store

## Additional Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Push Notification Tool](https://expo.dev/notifications)

---

**Need Help?**
- Check Expo forums: [forums.expo.dev](https://forums.expo.dev)
- Firebase Support: [firebase.google.com/support](https://firebase.google.com/support)




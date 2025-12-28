# Quick FCM Setup - Correct Path

## ⚠️ Important: You're in the Wrong Place!

The screenshot shows you're in **Google Cloud Console** creating **OAuth 2.0 credentials**. This is for authentication, NOT for FCM push notifications.

## ✅ Correct Path for FCM:

### Step 1: Go to Firebase Console (Not Google Cloud Console)

1. **Visit Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. **Select your project** (or create one if you haven't):
   - If you already created "SevApp" project, select it
   - If not, click "Add project" and create it

### Step 2: Add Android App to Firebase

1. **In Firebase Console**, click the **Android icon** (or "Add app" → Android)

2. **Register your Android app**:
   - **Android package name**: `com.sevapp.app` ✅ (you have this correct)
   - **App nickname** (optional): `SevApp Android`
   - **Debug signing certificate SHA-1** (optional for now)
   - Click **"Register app"**

3. **Download `google-services.json`**:
   - Click "Download google-services.json"
   - **Save this file** (you won't need to manually add it for Expo managed workflow)

4. **Click "Next"** through the remaining steps (you can skip adding the SDK manually)

### Step 3: Get FCM Server Key

1. **In Firebase Console** (still in your project):
   - Click the **gear icon** (⚙️) next to "Project Overview"
   - Select **"Project settings"**

2. **Go to "Cloud Messaging" tab**:
   - Scroll down to find **"Cloud Messaging API (Legacy)"** section
   - Copy the **"Server key"** (looks like: `AAAAxxxxxxx:APA91bHxxxxxxx...`)

3. **If you don't see the Server key**:
   - You may need to enable the API first:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Go to "APIs & Services" → "Library"
   - Search for "Firebase Cloud Messaging API"
   - Click "Enable"

### Step 4: Configure FCM Key in Expo

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure credentials**:
   ```bash
   eas credentials
   ```
   - Select your project
   - Select **"Android"**
   - Select **"Push Notifications"**
   - Choose **"Set up a new FCM key"**
   - **Paste your FCM Server Key** when prompted

## Summary:

❌ **Wrong**: Google Cloud Console → Create credentials → OAuth 2.0 Client
✅ **Correct**: Firebase Console → Add Android App → Get FCM Server Key → Configure in Expo

## What You Need:

1. ✅ Package name: `com.sevapp.app` (you have this)
2. ⏳ FCM Server Key from Firebase Console (not OAuth credentials)
3. ⏳ Configure it in Expo using `eas credentials`

## Quick Checklist:

- [ ] Go to Firebase Console (not Google Cloud Console)
- [ ] Add Android app with package name `com.sevapp.app`
- [ ] Download google-services.json (optional for Expo)
- [ ] Get FCM Server Key from Project Settings → Cloud Messaging
- [ ] Run `eas credentials` and add the FCM key

---

**Note**: The OAuth credentials you're creating in Google Cloud Console are for Google Sign-In, not for push notifications. You can skip that for now if you're only setting up FCM.




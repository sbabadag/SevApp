# Getting FCM Server Key - Step by Step

## Current Situation:
✅ You're in the correct place: Firebase Console → Project Settings → Cloud Messaging
✅ Firebase Cloud Messaging API (V1) is enabled
❌ Cloud Messaging API (Legacy) is disabled (we need this for Expo)

## Step 1: Enable Legacy API (If Needed)

**Note**: Expo's EAS Build can work with either:
- **Legacy Server Key** (easier, single key)
- **Service Account** (more secure, for production)

For simplicity, let's get the Legacy Server Key:

### Option A: Enable Legacy API in Firebase

1. **In the "Cloud Messaging API (Legacy)" section** you see:
   - It says "Disabled"
   - There's a deprecation notice

2. **Click "Learn more"** or look for an "Enable" button
   - If you see an "Enable" button, click it
   - If not, you may need to enable it via Google Cloud Console

3. **Alternative: Enable via Google Cloud Console**:
   - Click the link to Google Cloud Console (or go to [console.cloud.google.com](https://console.cloud.google.com))
   - Select your Firebase project "SevApp"
   - Go to "APIs & Services" → "Library"
   - Search for "Firebase Cloud Messaging API"
   - Click "Enable"

### Option B: Use Service Account (Recommended for Production)

If you can't enable Legacy API, use Service Account instead:

1. **In the "Firebase Cloud Messaging API (V1)" section**:
   - Click "Manage Service Accounts" link

2. **Create or select a service account**:
   - Click "Create Service Account" or select existing one
   - Give it a name like "fcm-service-account"
   - Grant it "Firebase Cloud Messaging Admin" role
   - Click "Done"

3. **Create a key**:
   - Click on the service account you created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the JSON file (keep it secure!)

4. **Use with EAS**:
   ```bash
   eas credentials
   # Select Android → Push Notifications
   # Choose "Upload service account JSON"
   # Upload the downloaded JSON file
   ```

## Step 2: Get Legacy Server Key (If Enabled)

If you enabled the Legacy API:

1. **Scroll down** on the Cloud Messaging page
2. **Look for "Cloud Messaging API (Legacy)" section**
3. **Find "Server key"** - it should now be visible
4. **Copy the Server key** (looks like: `AAAAxxxxxxx:APA91bHxxxxxxx...`)

## Step 3: Configure in Expo

### Using Legacy Server Key:

```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login to Expo
eas login

# Configure credentials
eas credentials

# Follow the prompts:
# 1. Select your project
# 2. Select "Android"
# 3. Select "Push Notifications"
# 4. Choose "Set up a new FCM key"
# 5. Paste your Server key when prompted
```

### Using Service Account JSON:

```bash
eas credentials

# Follow the prompts:
# 1. Select your project
# 2. Select "Android"
# 3. Select "Push Notifications"
# 4. Choose "Upload service account JSON"
# 5. Select the downloaded JSON file
```

## What You Have Now:

✅ **Sender ID**: `977869536520` (you can see this)
⏳ **Server Key**: Need to enable Legacy API or use Service Account

## Quick Decision:

- **For Development/Testing**: Try Expo's managed push service first (no FCM setup needed)
- **For Production**: Use Service Account (more secure, future-proof)

## Next Steps:

1. **Try to enable Legacy API** (if you see an Enable button)
2. **OR use Service Account** (recommended)
3. **Configure in Expo** using `eas credentials`

---

**Note**: The deprecation notice says Legacy API is deprecated, but Expo still supports it. For long-term, consider using Service Account with V1 API.




# EAS Credentials Setup - Step by Step

## ✅ What's Done:
- ✅ `eas.json` file created
- ✅ EAS project linked: `@sbabadag/sevapp`
- ✅ Service account JSON file downloaded: `sevapp-d979d-e86b9bfed8b3.json`

## 📋 Next Steps:

### 1. Run the credentials command interactively:

```bash
eas credentials
```

### 2. Follow the prompts:

When you run `eas credentials`, you'll see prompts like:

```
? Select platform › Android
? What do you want to do? › Set up a new FCM key
```

**OR** if it asks about service account:

```
? What do you want to do? › Upload service account JSON
```

### 3. Choose the correct option:

**Option A: Upload Service Account JSON** (Recommended)
- Select "Upload service account JSON"
- Navigate to and select: `sevapp-d979d-e86b9bfed8b3.json`
- This is the file you downloaded from Firebase

**Option B: Enter FCM Server Key** (If available)
- Select "Set up a new FCM key"
- Paste your FCM Server Key (if you have it)

### 4. Complete the setup:

After uploading/entering the credentials, EAS will:
- ✅ Validate the credentials
- ✅ Store them securely
- ✅ Use them for future Android builds

## 🔍 Troubleshooting:

### If you get "Select platform" error:
- Make sure you're running the command in an interactive terminal
- Don't run it from a script or non-interactive environment

### If you can't find the JSON file:
- The file should be in your project root: `C:\Users\lenovo\Documents\SOFTWARE_WORKSHOP\SevApp\sevapp-d979d-e86b9bfed8b3.json`
- Make sure the file exists and is readable

### If you need to re-run:
```bash
eas credentials
# Select Android
# Choose your action
```

## ✅ Verification:

After successful setup, you should see:
```
✔ Successfully set up FCM credentials for Android
```

## 📝 Notes:

- The service account JSON file is now in `.gitignore` (won't be committed)
- Your credentials are stored securely by Expo
- You can update them anytime with `eas credentials`

## 🚀 Next Steps After Setup:

1. **Test push notifications**:
   ```bash
   # Get your Expo push token from app logs
   # Then test with:
   expo send-notification --to YOUR_TOKEN --title "Test" --body "Hello"
   ```

2. **Build your app**:
   ```bash
   eas build --platform android
   ```

3. **Test on device**:
   - Install the built APK
   - Grant notification permissions
   - Test receiving notifications

---

**Ready?** Run `eas credentials` in your terminal and follow the prompts!


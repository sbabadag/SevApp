# Building Production APK for Phone Installation

## Quick Steps

### 1. Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Build Production APK
```bash
eas build --platform android --profile production
```

This will:
- Build a production APK file
- Upload it to EAS servers
- Give you a download link

### 4. Install on Phone

**Option A: Download from EAS Dashboard**
- After build completes, you'll get a URL
- Open the URL on your phone
- Download and install the APK

**Option B: Direct Download**
- Check your email for the build completion notification
- Click the download link
- Install on your phone

**Option C: Using ADB (if phone is connected)**
```bash
# Download APK first, then:
adb install path/to/your-app.apk
```

## Important Notes

### Environment Variables
Make sure your `.env` file has:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

EAS will automatically use these during the build.

### Build Time
- First build: ~15-20 minutes
- Subsequent builds: ~10-15 minutes

### Build Status
You can check build status:
```bash
eas build:list
```

Or visit: https://expo.dev/accounts/[your-account]/projects/sevapp/builds

## Troubleshooting

### Build Fails
1. Check EAS credentials: `eas credentials`
2. Verify app.json is valid
3. Check EAS build logs in dashboard

### APK Won't Install
1. Enable "Install from Unknown Sources" in Android settings
2. Make sure you're downloading the APK (not AAB)
3. Check if your phone architecture matches (arm64-v8a, armeabi-v7a, x86_64)

### App Crashes After Install
1. Check logs: `adb logcat | grep ReactNativeJS`
2. Verify environment variables are set correctly
3. Check Supabase connection

## Alternative: Local Build (Faster, but requires setup)

If you want to build locally (faster, but requires Android SDK):

```bash
# Install Android build tools first
eas build --platform android --profile production --local
```

This requires:
- Android SDK
- Java JDK
- More setup time initially

## What's Included in Production Build

✅ All your code bundled and optimized
✅ Supabase configuration
✅ Notification setup (FCM credentials)
✅ All assets and images
✅ Production-ready app

## After Installation

1. **Test Login**: Make sure authentication works
2. **Test Notifications**: Verify push notifications work
3. **Test Real-time**: Create a notification in Supabase, should appear instantly
4. **Test All Features**: Browse products, add to cart, etc.

---

**Ready to build?** Run:
```bash
eas build --platform android --profile production
```



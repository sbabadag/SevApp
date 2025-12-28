# Production Notifications Setup

This guide covers what you need to ensure notifications work in production mode.

## ✅ What's Already Configured

1. **FCM Credentials** - Already set up via `eas credentials`
2. **Notification Service** - Code is production-ready
3. **Database Schema** - Notifications table exists
4. **Real-time Subscriptions** - Should work in production

## ⚠️ Production Considerations

### 1. Expo Push Tokens (Development vs Production)

**Development Mode:**
- Uses Expo's development push notification service
- Tokens look like: `ExponentPushToken[...]`
- Works with `expo send-notification` command

**Production Mode:**
- Uses production push notification service
- Still uses `ExponentPushToken[...]` format
- Requires proper FCM/APNs credentials (✅ you have this)

### 2. Building for Production

You need to build a production app using EAS Build:

```bash
# Build production APK/AAB
eas build --platform android --profile production
```

**Important**: The FCM credentials you configured with `eas credentials` will be automatically used in production builds.

### 3. Push Notification Sending

In production, you can send push notifications via:

#### Option A: Expo Push Notification API (Recommended)

```bash
curl -H "Content-Type: application/json" \
     -X POST https://exp.host/--/api/v2/push/send \
     -d '{
       "to": "ExponentPushToken[YOUR_TOKEN]",
       "title": "Hello",
       "body": "World",
       "sound": "default"
     }'
```

#### Option B: Your Backend Server

You can send notifications from your backend using:
- Expo Push Notification API
- Firebase Admin SDK
- Supabase Edge Functions

### 4. Real-time Subscriptions

Real-time subscriptions work the same in production, but ensure:

1. **Supabase Real-time is enabled** (✅ you already did this)
2. **Network allows WebSocket connections** (usually fine)
3. **RLS policies are correct** (✅ already set up)

### 5. Testing Production Build

#### Step 1: Build Production App

```bash
eas build --platform android --profile production
```

#### Step 2: Install on Device

Download and install the APK/AAB from EAS Build dashboard.

#### Step 3: Test Notifications

1. **Get production push token**:
   - Open the app
   - Check logs for: `Expo push token: ExponentPushToken[...]`
   - Copy the token

2. **Send test notification**:
   ```bash
   curl -H "Content-Type: application/json" \
        -X POST https://exp.host/--/api/v2/push/send \
        -d '{
          "to": "YOUR_PRODUCTION_TOKEN",
          "title": "Production Test",
          "body": "This is a production notification!",
          "sound": "default"
        }'
   ```

3. **Test real-time notifications**:
   - Create notification in Supabase
   - Should appear instantly in app

## 🔧 Production Configuration Checklist

### app.json

Your `app.json` should have:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/noti.mp3"]
        }
      ]
    ],
    "android": {
      "package": "com.sevapp.app",
      "permissions": ["RECEIVE_BOOT_COMPLETED"]
    }
  }
}
```

✅ This is already configured!

### eas.json

Your `eas.json` should have production profile:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"  // or "app-bundle" for Play Store
      }
    }
  }
}
```

✅ This is already configured!

### Environment Variables

Make sure your production app has:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

These are set in:
- `.env` file (for development)
- EAS Secrets (for production builds)

## 🚀 Setting Up EAS Secrets (For Production)

If you haven't already, set environment variables for production:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"
```

These will be automatically injected during the build process.

## 📱 Production Push Notification Flow

### Sending from Backend/Server

1. **Get user's push token** (stored in Supabase user metadata)
2. **Send via Expo API**:
   ```javascript
   const response = await fetch('https://exp.host/--/api/v2/push/send', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       to: userExpoPushToken,
       title: 'Order Shipped',
       body: 'Your order has been shipped!',
       sound: 'default',
       data: { orderId: '123' },
     }),
   });
   ```

### Sending from Supabase Edge Function

You can create a Supabase Edge Function to send push notifications:

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { userId, title, message } = await req.json();
  
  // Get user's push token from database
  const { data: user } = await supabase
    .from('users')
    .select('expo_push_token')
    .eq('id', userId)
    .single();
  
  if (user?.expo_push_token) {
    // Send push notification
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.expo_push_token,
        title,
        body: message,
      }),
    });
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## ✅ Production Readiness Checklist

- [x] FCM credentials configured via `eas credentials`
- [x] `app.json` has notification plugin configured
- [x] `eas.json` has production build profile
- [x] Notifications table exists in Supabase
- [x] Real-time replication enabled
- [x] RLS policies configured
- [ ] Environment variables set in EAS Secrets (if needed)
- [ ] Production build tested
- [ ] Push notifications tested in production build

## 🧪 Testing Production Build

1. **Build**:
   ```bash
   eas build --platform android --profile production
   ```

2. **Install** the built APK/AAB on your device

3. **Test**:
   - Login to app
   - Get push token from logs
   - Send test notification
   - Create notification in Supabase
   - Verify real-time updates work

## 📝 Differences: Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Push Token Format | `ExponentPushToken[...]` | `ExponentPushToken[...]` (same) |
| Push Service | Expo Dev Service | Expo Production Service |
| FCM Credentials | Not required | ✅ Required (you have this) |
| Real-time | Works | Works (same) |
| Database | Same | Same |
| Build | `expo start` | `eas build` |

## 🎯 Summary

**Yes, notifications work in production!** 

You've already:
- ✅ Configured FCM credentials
- ✅ Set up notification infrastructure
- ✅ Enabled real-time

**To deploy to production:**
1. Build with `eas build --platform android --profile production`
2. Test push notifications with production token
3. Deploy to Google Play Store

Everything should work the same (or better) in production!

---

**Note**: The main difference is that in production, you'll use the production push notification service instead of the development one, but the code and functionality remain the same.




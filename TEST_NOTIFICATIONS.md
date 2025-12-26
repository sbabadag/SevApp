# Testing Push Notifications

This guide will help you test push notifications in your SevApp.

## Prerequisites

✅ FCM credentials configured (already done!)
✅ App running on device or emulator
✅ User logged in (for token registration)

## Method 1: Get Token from App Logs (Recommended)

### Step 1: Start your app

```bash
npm start
# or
npx expo start
```

### Step 2: Open app on device/emulator

- Make sure you're logged in
- Check the console/terminal for the push token

You should see logs like:
```
✅ Push notification token registered: ExponentPushToken[xxxxxxxxxxxxx]
📋 Copy this token to test notifications:
   node scripts/testNotification.js ExponentPushToken[xxxxxxxxxxxxx]
```

### Step 3: Copy the token

Copy the entire token (including `ExponentPushToken[...]`)

### Step 4: Send test notification

```bash
node scripts/testNotification.js ExponentPushToken[xxxxxxxxxxxxx]
```

Replace `ExponentPushToken[xxxxxxxxxxxxx]` with your actual token.

## Method 2: Add Token Display in App (For Easy Copying)

You can temporarily add a button in your app to display and copy the token.

### Add to HomeScreen or ProfileScreen:

```typescript
import { useNotifications } from '../hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import { Clipboard, Alert } from 'react-native';

// In your component:
const getPushToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    Clipboard.setString(token.data);
    Alert.alert('Token Copied!', `Token: ${token.data}\n\nCopied to clipboard!`);
    console.log('Push token:', token.data);
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

// Add a button to call getPushToken()
```

## Method 3: Test via Expo's Web Tool

1. **Get your push token** (from app logs or Method 2)

2. **Visit Expo's Push Notification Tool**:
   - Go to: https://expo.dev/notifications
   - Or use: https://expo.dev/notifications/send

3. **Enter your token and send**

## Method 4: Test Local Notification (No Token Needed)

You can test local notifications directly in your app:

```typescript
import { sendLocalNotification } from './src/utils/notifications';

// In your component or test function:
await sendLocalNotification(
  'Test Notification',
  'This is a local test notification!',
  { test: true }
);
```

## Expected Results

### ✅ Success:
- You should see: `✅ Notification sent successfully!`
- Notification appears on your device
- Notification sound plays (if enabled)
- Badge count updates (if configured)

### ❌ Common Issues:

**"Invalid token" error:**
- Make sure you copied the entire token
- Token should start with `ExponentPushToken[`
- Check if app is running and user is logged in

**"No notification received":**
- Check notification permissions are granted
- Verify app is running (foreground or background)
- Check device is connected to internet
- Try restarting the app

**"Token not registered":**
- Make sure user is logged in
- Check console for registration errors
- Verify FCM credentials are configured

## Testing Different Notification Types

### Test Order Notification:
```bash
node scripts/testNotification.js YOUR_TOKEN --title "Order Shipped" --body "Your order #12345 has been shipped"
```

### Test Promotion Notification:
```bash
node scripts/testNotification.js YOUR_TOKEN --title "New Sale!" --body "Check out our summer collection - 50% off!"
```

## Testing Real-time Notifications from Supabase

1. **Create a test notification in Supabase**:
   ```sql
   INSERT INTO notifications (user_id, title, message, type, data)
   VALUES (
     'YOUR_USER_ID',
     'Test from Supabase',
     'This notification came from the database!',
     'general',
     '{"test": true}'::jsonb
   );
   ```

2. **Check your app** - notification should appear via real-time subscription

## Testing Order Status Notifications

1. **Create an order** in your app
2. **Update order status** in Supabase:
   ```sql
   UPDATE orders 
   SET status = 'shipped' 
   WHERE id = 'YOUR_ORDER_ID';
   ```
3. **Notification should be created automatically** by the database trigger

## Debugging

### Check Token Registration:
```typescript
// Add to App.tsx or any component
import * as Notifications from 'expo-notifications';

const checkToken = async () => {
  const token = await Notifications.getExpoPushTokenAsync();
  console.log('Current token:', token.data);
};
```

### Check Permissions:
```typescript
const { status } = await Notifications.getPermissionsAsync();
console.log('Notification permission:', status);
```

### Check Notification Handler:
The notification handler in `App.tsx` should log when notifications are received.

## Next Steps

After successful testing:
1. ✅ Remove debug logs (optional)
2. ✅ Test with real order status changes
3. ✅ Test with promotional notifications
4. ✅ Build production app: `eas build --platform android`

---

**Quick Test Command:**
```bash
# 1. Start app and get token from logs
npm start

# 2. Copy token from console

# 3. Send test notification
node scripts/testNotification.js YOUR_TOKEN
```


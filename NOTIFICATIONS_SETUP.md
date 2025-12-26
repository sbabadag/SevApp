# Notifications Setup Guide

This guide explains how to set up and use the notifications system in the SevApp.

## Features

✅ **Real-time notifications** from Supabase
✅ **Push notifications** via Expo Notifications
✅ **Unread count badge** on HomeScreen
✅ **Mark as read** functionality
✅ **Automatic notifications** for order status changes

## Database Setup

1. **Run the SQL schema** in your Supabase SQL Editor:
   - The notifications table and triggers are included in `supabase-schema.sql`
   - This creates:
     - `notifications` table
     - Automatic notifications when order status changes
     - Real-time subscriptions

2. **Verify the table was created**:
   ```sql
   SELECT * FROM notifications LIMIT 5;
   ```

## Push Notifications Setup

### 1. Install Dependencies

The `expo-notifications` package is already installed. If you need to reinstall:

```bash
npm install expo-notifications
```

### 2. Configure app.json

The `app.json` has been updated with notification plugin configuration. For production, you may need to:

- Add notification sounds to `assets/` folder
- Configure iOS push notification certificates
- Configure Android FCM (Firebase Cloud Messaging)

### 3. Request Permissions

The app automatically requests notification permissions when a user logs in. The permission request happens in `App.tsx`.

### 4. Get Expo Push Token

When a user logs in, the app:
1. Requests notification permissions
2. Gets the Expo push token
3. Saves it to the user's metadata in Supabase

## How It Works

### Real-time Notifications

1. **Database Trigger**: When an order status changes, a trigger automatically creates a notification
2. **Real-time Subscription**: The app subscribes to new notifications via Supabase real-time
3. **UI Update**: New notifications appear instantly in the NotificationsScreen

### Push Notifications

1. **Token Registration**: User's device gets an Expo push token
2. **Token Storage**: Token is saved in user metadata
3. **Sending Notifications**: You can send push notifications via:
   - Expo Push Notification API
   - Your backend server
   - Supabase Edge Functions

## Usage

### Viewing Notifications

- Navigate to **Notifications** from the Profile screen or Home screen
- Unread notifications show a badge with count on the Home screen
- Tap a notification to mark it as read

### Marking as Read

- Tap on an unread notification to mark it as read
- Use "Mark all read" button to mark all notifications as read

### Creating Notifications Programmatically

```typescript
import { notificationService } from './src/services/notificationService';

// Create a notification
await notificationService.createNotification({
  userId: 'user-uuid',
  title: 'New Promotion',
  message: 'Check out our summer sale!',
  type: 'promotion',
  data: { promotionId: 123 }
});
```

### Sending Push Notifications

```typescript
import { createAndSendNotification } from './src/utils/notifications';

await createAndSendNotification(
  'user-uuid',
  'Order Shipped',
  'Your order #12345 has been shipped',
  'order',
  { orderId: '12345' }
);
```

## Automatic Notifications

The system automatically creates notifications when:

- **Order status changes** to:
  - `processing` → "Order Processing"
  - `shipped` → "Order Shipped"
  - `delivered` → "Order Delivered"
  - `cancelled` → "Order Cancelled"

These are handled by the database trigger `create_order_notification_trigger`.

## Testing

### Test Local Notifications

```typescript
import { sendLocalNotification } from './src/utils/notifications';

await sendLocalNotification(
  'Test Notification',
  'This is a test notification',
  { test: true }
);
```

### Test Database Notifications

1. Create an order in Supabase
2. Update the order status
3. Check the notifications table
4. The notification should appear in the app

## Production Setup

### iOS

1. **Apple Developer Account**: Required for push notifications
2. **APNs Certificate**: Generate and upload to Expo
3. **App Store**: Submit with push notification capability enabled

### Android

1. **Firebase Project**: Create a Firebase project
2. **FCM Server Key**: Add to Expo project settings
3. **Google Play**: Configure in Play Console

### Expo Configuration

1. Run `expo build:configure` to set up push notification credentials
2. Update `app.json` with production notification settings
3. Test with Expo's push notification tool

## Troubleshooting

### Notifications not appearing

1. Check if user is logged in
2. Verify Supabase connection
3. Check browser console for errors
4. Verify RLS policies allow user to read notifications

### Push notifications not working

1. Check notification permissions are granted
2. Verify Expo push token is saved in user metadata
3. Check device is connected to internet
4. Test with Expo's push notification tool

### Real-time not updating

1. Verify Supabase real-time is enabled
2. Check network connection
3. Verify user is authenticated
4. Check Supabase dashboard for subscription status

## API Reference

### NotificationService

- `getNotifications(limit?)` - Get all notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `createNotification(data)` - Create new notification
- `deleteNotification(id)` - Delete notification
- `subscribeToNotifications(callback)` - Subscribe to real-time updates

### useNotifications Hook

```typescript
const {
  notifications,      // Array of notifications
  unreadCount,       // Number of unread notifications
  loading,          // Loading state
  markAsRead,        // Function to mark as read
  markAllAsRead,     // Function to mark all as read
  refreshNotifications // Function to refresh
} = useNotifications();
```

## Next Steps

1. **Add notification sounds** to `assets/` folder
2. **Set up production push notification credentials**
3. **Create admin panel** to send promotional notifications
4. **Add notification preferences** in Settings screen
5. **Implement notification categories** and filtering


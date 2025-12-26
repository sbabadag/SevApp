import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { notificationService } from '../services/notificationService';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const content = notification.request.content;
    console.log('NotificationHandler: Received notification:', {
      title: content.title,
      body: content.body,
      sound: content.sound,
      data: content.data,
    });
    
    // Explicitly play sound for foreground notifications
    // On Android, we need to ensure the channel allows sound
    return {
      shouldShowAlert: true,
      shouldPlaySound: true, // Play sound even in foreground
      shouldSetBadge: true,
    };
  },
});

/**
 * Register for push notifications and get the Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  try {
    console.log('🔔 registerForPushNotificationsAsync: Starting permission request...');
    
    // Check current permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('🔔 registerForPushNotificationsAsync: Current permission status:', existingStatus);
    
    let finalStatus = existingStatus;

    // Request permissions if not already granted
    if (existingStatus !== 'granted') {
      console.log('🔔 registerForPushNotificationsAsync: Requesting permissions...');
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      finalStatus = status;
      console.log('🔔 registerForPushNotificationsAsync: Permission request result:', status);
    } else {
      console.log('✅ registerForPushNotificationsAsync: Permissions already granted');
    }

    if (finalStatus !== 'granted') {
      console.error('❌ registerForPushNotificationsAsync: Permissions denied! Status:', finalStatus);
      console.error('❌ User needs to enable notifications in device settings');
      return null;
    }
    
    console.log('✅ registerForPushNotificationsAsync: Permissions granted, getting token...');

    // Get the Expo push token
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);

    // Save token to Supabase (you might want to create a user_tokens table)
    const { data: { user } } = await supabase.auth.getUser();
    if (user && token) {
      // Update user metadata with push token
      await supabase.auth.updateUser({
        data: { expo_push_token: token },
      });
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
      // Delete existing channel if it exists to recreate with new settings
      try {
        await Notifications.deleteNotificationChannelAsync('default');
        console.log('NotificationService: Deleted existing channel to recreate');
      } catch (e) {
        // Channel might not exist, that's okay
      }
      
      const channelId = await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        description: 'Default notification channel for SevApp',
        importance: Notifications.AndroidImportance.MAX, // MAX importance ensures sound plays
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        enableVibrate: true,
        showBadge: true,
        sound: 'default', // Explicitly set default sound for the channel
      });
      
      console.log('NotificationService: Android notification channel configured:', channelId);
      
      // Verify channel was created correctly
      const channel = await Notifications.getNotificationChannelAsync('default');
      console.log('NotificationService: Channel details:', JSON.stringify(channel, null, 2));
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Set up notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationTapped: (response: Notifications.NotificationResponse) => void
) {
  // Listener for notifications received while app is in foreground
  const receivedListener = Notifications.addNotificationReceivedListener(onNotificationReceived);

  // Listener for when user taps on a notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationTapped);

  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}

/**
 * Send a local notification (for testing or app-triggered notifications)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    console.log('sendLocalNotification: Sending notification with sound:', { title, body });
    
    // Ensure we have permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      console.warn('sendLocalNotification: Permissions not granted, requesting...');
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.error('sendLocalNotification: Permissions denied');
        return;
      }
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true, // Use default system sound (more reliable)
        priority: 'high', // High priority ensures sound plays on Android
      },
      trigger: null, // Show immediately
    });
    
    console.log('sendLocalNotification: ✅ Notification scheduled with ID:', notificationId);
    console.log('sendLocalNotification: Sound should play now');
  } catch (error) {
    console.error('sendLocalNotification: ❌ Error sending notification:', error);
    throw error;
  }
}

/**
 * Create a notification in Supabase and send push notification
 */
export async function createAndSendNotification(
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'promotion' | 'general' | 'system' = 'general',
  data?: Record<string, any>
): Promise<void> {
  try {
    // Create notification in database
    const { data: notification, error } = await notificationService.createNotification({
      userId,
      title,
      message,
      type,
      data,
    });

    if (error) {
      console.error('Error creating notification:', error);
      return;
    }

    // Get user's push token from Supabase
    const { data: userData } = await supabase
      .from('auth.users')
      .select('raw_user_meta_data')
      .eq('id', userId)
      .single();

    const pushToken = userData?.raw_user_meta_data?.expo_push_token;

    if (pushToken) {
      // Send push notification via Expo's push notification service
      // In production, you would send this from your backend
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: pushToken,
          sound: 'default', // Use default system sound
          title,
          body: message,
          data: { notificationId: notification?.id, ...data },
        }),
      });
    }
  } catch (error) {
    console.error('Error creating and sending notification:', error);
  }
}


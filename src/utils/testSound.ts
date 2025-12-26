/**
 * Test notification sound directly
 * Call this function to test if notification sounds work
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function testNotificationSound(): Promise<void> {
  console.log('Testing notification sound...');
  
  try {
    // Check permissions first
    const { status } = await Notifications.getPermissionsAsync();
    console.log('Notification permission status:', status);
    
    if (status !== 'granted') {
      console.warn('Notification permissions not granted!');
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log('Requested permission, new status:', newStatus);
    }

    // Get current channel settings (Android)
    if (Platform.OS === 'android') {
      const channel = await Notifications.getNotificationChannelAsync('default');
      console.log('Current notification channel:', channel);
    }

    // Send a test notification with explicit sound
    // Try multiple approaches to ensure sound plays
    console.log('Sending test notification 1 with sound: true');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔊 Sound Test 1',
        body: 'If you hear this, notification sounds are working!',
        sound: true, // Explicitly enable sound
        data: { test: 'sound1' },
        priority: 'high', // High priority for Android
      },
      trigger: null, // Show immediately
    });

    console.log('✅ Test notification 1 sent!');
    
    // Wait a bit and send another with different sound config
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Sending test notification 2 with sound: default');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔊 Sound Test 2',
        body: 'Second test - check device volume!',
        sound: 'default', // Use default system sound
        data: { test: 'sound2' },
        priority: 'high',
      },
      trigger: null,
    });
    
    console.log('✅ Test notification 2 sent!');
    console.log('📱 IMPORTANT: Check your device settings:');
    console.log('   1. Make sure device is NOT in silent/Do Not Disturb mode');
    console.log('   2. Check app notification settings in Android Settings');
    console.log('   3. Ensure "Default" notification channel has sound enabled');
    
  } catch (error) {
    console.error('Error testing notification sound:', error);
  }
}


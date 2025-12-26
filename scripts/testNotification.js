/**
 * Test Push Notification Script
 * 
 * Usage:
 * 1. Get your Expo push token from the app (check console logs)
 * 2. Run: node scripts/testNotification.js YOUR_EXPO_PUSH_TOKEN
 * 
 * Example:
 * node scripts/testNotification.js ExponentPushToken[xxxxxxxxxxxxx]
 */

const token = process.argv[2];

if (!token) {
  console.error('❌ Error: Expo push token is required');
  console.log('\nUsage: node scripts/testNotification.js YOUR_EXPO_PUSH_TOKEN');
  console.log('\nTo get your token:');
  console.log('1. Run your app: npm start');
  console.log('2. Check the console logs for "Expo push token:"');
  console.log('3. Copy the token and run this script');
  process.exit(1);
}

const message = {
  to: token,
  sound: 'default', // Use default system sound (more reliable)
  title: '🎉 Test Notification',
  body: 'This is a test notification from SevApp!',
  data: { 
    test: true,
    timestamp: new Date().toISOString()
  },
  priority: 'high',
};

console.log('📤 Sending test notification...');
console.log('Token:', token);
console.log('Message:', JSON.stringify(message, null, 2));
console.log('\n');

fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(message),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.data && data.data.status === 'ok') {
      console.log('✅ Notification sent successfully!');
      console.log('Check your device for the notification.');
    } else {
      console.error('❌ Error sending notification:');
      console.error(JSON.stringify(data, null, 2));
    }
  })
  .catch((error) => {
    console.error('❌ Failed to send notification:', error.message);
  });


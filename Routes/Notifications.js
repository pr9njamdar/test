const { Expo } = require('expo-server-sdk');

// Create a new Expo instance
const expo = new Expo();

const sendPushNotification = async (pushToken, title, body) => {
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('Invalid push token');
    return;
  }

  // Construct the notification payload
  const message = {
    to: pushToken,
    sound: 'default',
    title: title || 'Notification Title',
    body: body || 'Notification Body',
    data: { someData: 'optional data' },
  };

  // Send the notification
  try {
    const response = await expo.sendPushNotificationsAsync([message]);
    console.log('Expo push notification response:', response);
  } catch (error) {
    console.error('Error sending Expo push notification:', error);
  }
};

module.exports=sendPushNotification;

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      // include for compatibility on some SDK typings
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFCC00',
    });
  }
}

export async function getExpoPushTokenSafe() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Notification permission not granted');

  const projectId =
    // SDK 49+: use expoConfig.extra.eas.projectId during dev or build-time injected
    // Also consider Constants.easConfig.projectId during EAS
    (Constants as any)?.expoConfig?.extra?.eas?.projectId ??
    (Constants as any)?.easConfig?.projectId;

  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  return token.data;
}

export async function testLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Test lokal', body: 'Hello from MandorPro' },
    trigger: null,
  });
}

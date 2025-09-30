
// Dynamic import to avoid errors if modules are missing (e.g., web build)
let Device: any, Notifications: any;
try {
  Device = require('expo-device');
  Notifications = require('expo-notifications');
} catch {}
import { Platform } from 'react-native';


export async function getPushToken() {
  // Remote push di Expo Go Android SDK 53 tidak didukung – pakai dev build.
  if (!Device?.isDevice) return null;

  const settings = await Notifications?.getPermissionsAsync?.();
  let granted = settings?.granted || settings?.ios?.status === Notifications?.IosAuthorizationStatus?.PROVISIONAL;
  if (!granted) {
    const ask = await Notifications?.requestPermissionsAsync?.();
    granted = ask?.granted || ask?.ios?.status === Notifications?.IosAuthorizationStatus?.PROVISIONAL;
  }
  if (!granted) return null;

  if (Platform.OS === 'android') {
    await Notifications?.setNotificationChannelAsync?.('default', {
      name: 'default',
      importance: Notifications?.AndroidImportance?.MAX,
    });
  }

  const token = (await Notifications?.getExpoPushTokenAsync?.())?.data;
  return token;
}

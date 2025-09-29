import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    
    return status === 'granted';
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
}

export async function scheduleDailyReminder(
  id: string,
  hour: number,
  minute: number,
  title: string,
  body: string
): Promise<string> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });
    
    return identifier;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    throw error;
  }
}

export async function scheduleSuperviseorDailyReminders(): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return;
    }
    
    // Cancel existing reminders first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule daily reminders for supervisor
    await scheduleDailyReminder(
      'rem-0700',
      7,
      0,
      'Apel Pagi',
      'Rencanakan target & bagi tugas hari ini'
    );
    
    await scheduleDailyReminder(
      'rem-1000',
      10,
      0,
      'Cek Material',
      'Update stok material & progress siang'
    );
    
    await scheduleDailyReminder(
      'rem-1200',
      12,
      0,
      'Dokumentasi Siang',
      'Catat site diary shift siang'
    );
    
    await scheduleDailyReminder(
      'rem-1500',
      15,
      0,
      'QC Cepat',
      'Periksa item kritis & ambil foto bukti'
    );
    
    await scheduleDailyReminder(
      'rem-1700',
      17,
      0,
      'Tutup Hari',
      'Finalkan progres & sinkron ke Drive'
    );
    
    console.log('Supervisor daily reminders scheduled');
  } catch (error) {
    console.error('Failed to schedule supervisor reminders:', error);
  }
}

export async function scheduleWeeklyReport(dayOfWeek: number = 5, hour: number = 16): Promise<string> {
  try {
    return await Notifications.scheduleNotificationAsync({
      identifier: 'weekly-report',
      content: {
        title: 'Laporan Mingguan',
        body: 'Saatnya menyiapkan laporan mingguan proyek',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: dayOfWeek, // Friday
        hour,
        minute: 0,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });
  } catch (error) {
    console.error('Failed to schedule weekly report reminder:', error);
    throw error;
  }
}

export async function sendImmediateNotification(title: string, body: string): Promise<string> {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Failed to send immediate notification:', error);
    throw error;
  }
}

export async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}
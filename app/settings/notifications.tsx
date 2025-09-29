import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import PageContainer from '@/components/nav/PageContainer';
import { getExpoPushTokenSafe, testLocalNotification } from '@/src/services/push';

export default function SettingsNotifications() {
  const [permission, setPermission] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);

  const isDevice = Platform.OS === 'android' || Platform.OS === 'ios';

  const refreshPerm = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermission(status as any);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const requestPerm = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermission(status as any);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const fetchToken = useCallback(async () => {
    try {
      setError(null);
      const t = await getExpoPushTokenSafe();
      setToken(t);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const testLocal = useCallback(async () => {
    try {
      setError(null);
      await testLocalNotification();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const loadScheduled = useCallback(async () => {
    try {
      const all = await Notifications.getAllScheduledNotificationsAsync();
      setScheduled(all);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const cancelAll = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await loadScheduled();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, [loadScheduled]);

  useEffect(() => {
    refreshPerm();
    loadScheduled();
  }, [refreshPerm, loadScheduled]);

  const Button = useMemo(
    () =>
      ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
        <Pressable onPress={onPress} disabled={disabled} style={{
          backgroundColor: disabled ? '#cbd5e1' : '#2563eb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8,
        }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>{title}</Text>
        </Pressable>
      ),
    []
  );

  return (
    <PageContainer>
      <View style={{ gap: 12, padding: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Notifikasi (FCM/Expo)</Text>
        {!isDevice && (
          <Text style={{ color: '#b91c1c' }}>
            Token Expo hanya tersedia di perangkat fisik atau emulator Android dengan Google APIs. Web tidak mendukung push.
          </Text>
        )}

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>Permission: {permission}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Cek Permission" onPress={refreshPerm} />
            <Button title="Minta Permission" onPress={requestPerm} />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>Expo Push Token:</Text>
          <Text selectable style={{ color: token ? '#0f172a' : '#64748b' }}>{token ?? '— belum diambil —'}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Ambil Token" onPress={fetchToken} disabled={!isDevice} />
            <Button title="Test Lokal" onPress={testLocal} />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>Scheduled notifications: {scheduled.length}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Refresh List" onPress={loadScheduled} />
            <Button title="Batalkan Semua" onPress={cancelAll} />
          </View>
        </View>

        {!!error && (
          <Text style={{ color: '#b91c1c' }}>Error: {error}</Text>
        )}
      </View>
    </PageContainer>
  );
}

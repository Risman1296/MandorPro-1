import { Stack } from 'expo-router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { setupNotifications } from '@/src/services/push';
import { initDb } from '@/src/db/boot';
import { ensureDemoSeed } from '@/src/db/seed';

export default function RootLayout() {
  useEffect(() => {
    // fire-and-forget setup; errors are non-fatal
  setupNotifications().catch(() => {});
  initDb()
    .then(() => ensureDemoSeed(false))
    .catch(() => {});
  }, []);
  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="worker/management" />
        <Stack.Screen name="project/management" />
        <Stack.Screen name="progres/form" />
        <Stack.Screen name="material/usage" />
        <Stack.Screen name="material/stock" />
  <Stack.Screen name="material/management" />
        <Stack.Screen name="payroll/management" />
        <Stack.Screen name="gaji/weekly" />
        <Stack.Screen name="absensi/index" />
        <Stack.Screen name="harian/diary" />
        <Stack.Screen name="report/daily" />
        <Stack.Screen name="laporan/export" />
        <Stack.Screen name="admin/data" />
      </Stack>
    </Layout>
  );
}
import { Stack } from 'expo-router';
import Layout from '@/components/Layout';

export default function RootLayout() {
  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="worker/management" />
        <Stack.Screen name="project/management" />
        <Stack.Screen name="progres/form" />
        <Stack.Screen name="material/usage" />
        <Stack.Screen name="material/stock" />
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
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import SectionScreen from '@/components/nav/SectionScreen';

export default function SettingsSection() {
  const router = useRouter();
  return (
    <>
      <SectionScreen />
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Pengaturan Tambahan</Text>
        <Pressable
          onPress={() => router.push('/settings/notifications')}
          accessibilityRole="link"
          style={{ backgroundColor: '#eef2ff', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ fontWeight: '600', marginBottom: 4 }}>Notifikasi & FCM</Text>
          <Text style={{ color: '#475569' }}>
            Uji izin, ambil Expo Push Token, dan kirim notifikasi lokal.
          </Text>
        </Pressable>
      </View>
    </>
  );
}

import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>Halaman tidak ditemukan</Text>
      <Text style={{ color: '#64748b' }}>
        URL yang kamu akses tidak ada atau sudah dipindahkan.
      </Text>
      <Pressable onPress={() => router.push('/dashboard')} accessibilityRole="link">
        <Text style={{ color: '#2563eb', marginTop: 8 }}>← Kembali ke Dashboard</Text>
      </Pressable>
    </View>
  );
}

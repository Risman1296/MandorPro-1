import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>Halaman tidak ditemukan</Text>
      <Text style={{ color: '#64748b' }}>
        URL yang kamu akses tidak ada atau sudah dipindahkan.
      </Text>
      <Link href="/dashboard">
        <Text style={{ color: '#2563eb', marginTop: 8 }}>← Kembali ke Dashboard</Text>
      </Link>
    </View>
  );
}

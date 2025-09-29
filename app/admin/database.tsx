import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { getCounts, exportScopeAsJson, vacuum } from '@/src/db/database';
import { ensureDemoSeed, wipeDemoData } from '@/src/db/seed';
import { useRouter } from 'expo-router';

export default function DatabaseAdmin() {
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState<any>(null);
  const r = useRouter();

  const refresh = async () => {
    setBusy(true);
    setCounts(await getCounts('DEMO'));
    setBusy(false);
  };
  useEffect(() => { refresh(); }, []);

  async function onExport() {
    const json = await exportScopeAsJson('DEMO');
    const name = `db-DEMO-${dayjs().format('YYYY-MM-DD')}.json`;
    if (Platform.OS === 'web') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
    } else {
      const uri = (FileSystem as any).cacheDirectory + name;
      await FileSystem.writeAsStringAsync(uri, json);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/json' });
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, minWidth: 0, minHeight: 0 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Pengelola Database</Text>

      {busy ? <ActivityIndicator /> : counts && (
        <View style={{ gap: 6, marginBottom: 14 }}>
          <Text>Material: {counts.materials}</Text>
          <Text>Ledger: {counts.ledger}</Text>
          <Text>Pekerja: {counts.workers}</Text>
          <Text>Proyek: {counts.projects}</Text>
          <Text>Kehadiran: {counts.attendance}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Btn label="Isi Demo" onPress={async () => { setBusy(true); await ensureDemoSeed(true); await refresh(); setBusy(false); }} />
        <Btn label="Hapus Demo" danger onPress={() => {
          Alert.alert('Hapus data DEMO?', 'Tidak bisa dibatalkan.', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: async () => { setBusy(true); await wipeDemoData(); await refresh(); setBusy(false); } }
          ]);
        }} />
        <Btn label="VACUUM" onPress={async () => { setBusy(true); await vacuum(); setBusy(false); }} />
        <Btn label="Export JSON" onPress={onExport} />
        <Btn label="Refresh" onPress={refresh} />
      </View>

      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Editor Data</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Btn label="Pekerja" onPress={() => r.push('/worker/management')} />
        <Btn label="Proyek" onPress={() => r.push('/project/management')} />
        <Btn label="Material" onPress={() => r.push('/material/usage')} />
      </View>
    </View>
  );
}

function Btn({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10,
        borderWidth: 1, borderColor: danger ? '#ffb3b3' : '#dfe3ea',
        backgroundColor: danger ? '#ffecec' : 'white'
      }}>
      <Text style={{ fontWeight: '600', color: danger ? '#b00020' : '#222' }}>{label}</Text>
    </Pressable>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Modal, Platform } from 'react-native';
import { getMaterialStock } from '@/src/db/queries/materials';
import { run } from '@/src/db/adapters';
import { exportCsvTable, exportExcelTable } from '@/src/services/export';

type Row = {
  id: string;
  name: string;
  unit?: string;
  total_in: number;
  total_out: number;
  balance: number;
  scope: string;
};

export default function MaterialManagement() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const scope = 'DEMO';

  const load = async () => {
    setBusy(true);
    const data = await getMaterialStock(scope);
    setRows(data);
    setBusy(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(qq) || (r.unit || '').toLowerCase().includes(qq));
  }, [rows, q]);

  const onAdd = async () => {
    const n = name.trim();
    if (!n) return;
    const u = unit.trim() || null;
    const id = `MAT-${Math.random().toString(36).slice(2, 9)}`;
    try {
      await run(
        `INSERT OR IGNORE INTO materials (id,name,unit,total_in,total_out,scope) VALUES (?,?,?,?,?,?)`,
        [id, n, u, 0, 0, scope]
      );
      setShowAdd(false);
      setName(''); setUnit('');
      await load();
    } catch (e) {
      console.warn('Failed to add material:', e);
      setShowAdd(false);
    }
  };

  const onExportCsv = async () => {
    await exportCsvTable(filtered, 'materials', [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Nama' },
      { key: 'unit', header: 'Satuan' },
      { key: 'total_in', header: 'Masuk' },
      { key: 'total_out', header: 'Keluar' },
      { key: 'balance', header: 'Saldo' },
    ]);
  };

  const onExportXlsx = async () => {
    await exportExcelTable(filtered, 'materials', 'Materials', [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Nama' },
      { key: 'unit', header: 'Satuan' },
      { key: 'total_in', header: 'Masuk' },
      { key: 'total_out', header: 'Keluar' },
      { key: 'balance', header: 'Saldo' },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16, minWidth: 0, minHeight: 0 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Kelola Material</Text>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <TextInput
          placeholder="Cari nama/satuan..."
          value={q}
          onChangeText={setQ}
          style={{ borderWidth: 1, borderColor: '#dfe3ea', paddingHorizontal: 10, paddingVertical: Platform.OS === 'web' ? 6 : 10, borderRadius: 8, minWidth: 220 }}
        />
        <Btn label="Tambah" onPress={() => setShowAdd(true)} />
        <Btn label="Export CSV" onPress={onExportCsv} />
        <Btn label="Export Excel" onPress={onExportXlsx} />
        <Btn label={busy ? 'Muat...' : 'Refresh'} onPress={load} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef2f6' }}>
            <Text style={{ fontWeight: '600' }}>{item.name} <Text style={{ color: '#64748b' }}>({item.unit || '-'})</Text></Text>
            <Text style={{ color: '#475569', fontSize: 12 }}>Masuk: {item.total_in}  ·  Keluar: {item.total_out}  ·  Saldo: {item.balance}</Text>
          </View>
        )}
      />

      <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, width: 360, maxWidth: '90%' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Tambah Material</Text>
            <TextInput
              placeholder="Nama material"
              value={name}
              onChangeText={setName}
              style={{ borderWidth: 1, borderColor: '#dfe3ea', paddingHorizontal: 10, paddingVertical: Platform.OS === 'web' ? 6 : 10, borderRadius: 8, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Satuan (opsional)"
              value={unit}
              onChangeText={setUnit}
              style={{ borderWidth: 1, borderColor: '#dfe3ea', paddingHorizontal: 10, paddingVertical: Platform.OS === 'web' ? 6 : 10, borderRadius: 8, marginBottom: 12 }}
            />
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              <Btn label="Batal" onPress={() => setShowAdd(false)} />
              <Btn label="Simpan" onPress={onAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Btn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#dfe3ea', backgroundColor: 'white' }}>
      <Text style={{ fontWeight: '600', color: '#222' }}>{label}</Text>
    </Pressable>
  );
}

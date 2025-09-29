import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Modal, Platform, Alert } from 'react-native';
import { getMaterialStock } from '@/src/db/queries/materials';
import { all, get, run } from '@/src/db/adapters';
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
  const [showEdit, setShowEdit] = useState<null | Row>(null);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scope = 'DEMO';
  const schemaRef = useRef<{ hasScope: boolean; hasTotals: boolean } | null>(null);

  async function detectSchema() {
    if (schemaRef.current) return schemaRef.current;
    try {
  const cols = await all(`PRAGMA table_info(materials)`);
      const names = (cols || []).map((c: any) => String(c.name || ''));
      const hasScope = names.includes('scope');
      const hasTotals = names.includes('total_in') && names.includes('total_out');
      schemaRef.current = { hasScope, hasTotals };
      return schemaRef.current;
    } catch {
      schemaRef.current = { hasScope: false, hasTotals: false };
      return schemaRef.current;
    }
  }

  async function isDuplicateName(n: string, excludeId?: string) {
    const { hasScope } = await detectSchema();
    const nameNorm = n.trim().toLowerCase();
    const params: any[] = [nameNorm];
    let sql = `SELECT id FROM materials WHERE LOWER(name)=?`;
    if (hasScope) { sql += ` AND scope=?`; params.push(scope); }
  const rows = await all(sql, params);
    const ids = (rows || []).map((r: any) => r.id).filter(Boolean);
    if (!ids.length) return false;
    if (excludeId) return ids.some((id: string) => id !== excludeId);
    return true;
  }

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
    setError(null);
    const n = name.trim();
    const u = unit.trim() || null;
    if (!n) { setError('Nama wajib diisi.'); return; }
    if (n.length > 120) { setError('Nama terlalu panjang.'); return; }
    if (await isDuplicateName(n)) { setError('Nama material sudah ada.'); return; }
    const id = `MAT-${Math.random().toString(36).slice(2, 9)}`;
    try {
      const { hasScope, hasTotals } = await detectSchema();
      if (hasScope && hasTotals) {
        await run(
          `INSERT OR IGNORE INTO materials (id,name,unit,total_in,total_out,scope) VALUES (?,?,?,?,?,?)`,
          [id, n, u, 0, 0, scope]
        );
      } else {
        await run(
          `INSERT OR REPLACE INTO materials (id,name,unit,current_stock,unit_price,supplier,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`,
          [id, n, u, 0, 0, null, new Date().toISOString(), new Date().toISOString()]
        );
      }
      setShowAdd(false);
      setName(''); setUnit('');
      await load();
    } catch (e) {
      console.warn('Failed to add material:', e);
      setError('Gagal menambah material.');
    }
  };

  const onEditSave = async () => {
    if (!showEdit) return;
    setError(null);
    const n = name.trim();
    const u = unit.trim() || null;
    if (!n) { setError('Nama wajib diisi.'); return; }
    if (n.length > 120) { setError('Nama terlalu panjang.'); return; }
    if (await isDuplicateName(n, showEdit.id)) { setError('Nama material sudah ada.'); return; }
    try {
      const { hasScope, hasTotals } = await detectSchema();
      if (hasScope || hasTotals) {
        await run(`UPDATE materials SET name=?, unit=? WHERE id=?`, [n, u, showEdit.id]);
      } else {
        await run(`UPDATE materials SET name=?, unit=?, updated_at=? WHERE id=?`, [n, u, new Date().toISOString(), showEdit.id]);
      }
      setShowEdit(null);
      setName(''); setUnit('');
      await load();
    } catch (e) {
      console.warn('Failed to edit material:', e);
      setError('Gagal menyimpan perubahan.');
    }
  };

  const onDelete = async (row: Row) => {
    // Check ledger references
    try {
  const hasMatLedger = (await all(`SELECT name FROM sqlite_master WHERE type='table' AND name='material_ledger'`)).length > 0;
  const hasStockLedger = (await all(`SELECT name FROM sqlite_master WHERE type='table' AND name='stock_ledger'`)).length > 0;
      let count = 0;
      if (hasMatLedger) {
        const c = await get<{ c: number }>(`SELECT COUNT(*) c FROM material_ledger WHERE material_id=?`, [row.id]);
        count = Number(c?.c || 0);
      } else if (hasStockLedger) {
        const c = await get<{ c: number }>(`SELECT COUNT(*) c FROM stock_ledger WHERE material_id=?`, [row.id]);
        count = Number(c?.c || 0);
      }
      const doDelete = async (cascade: boolean) => {
        if (cascade) {
          if (hasMatLedger) await run(`DELETE FROM material_ledger WHERE material_id=?`, [row.id]);
          if (hasStockLedger) await run(`DELETE FROM stock_ledger WHERE material_id=?`, [row.id]);
        }
        await run(`DELETE FROM materials WHERE id=?`, [row.id]);
        await load();
      };
      if (count > 0) {
        Alert.alert(
          'Hapus Material?',
          `Material memiliki ${count} jejak di ledger. Hapus beserta ledger?`,
          [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => doDelete(true) },
          ]
        );
      } else {
        Alert.alert('Hapus Material?', `Hapus ${row.name}?`, [
          { text: 'Batal', style: 'cancel' },
          { text: 'Hapus', style: 'destructive', onPress: () => doDelete(false) },
        ]);
      }
    } catch (e) {
      console.warn('Failed to delete material:', e);
      Alert.alert('Gagal', 'Gagal menghapus material.');
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontWeight: '600' }}>{item.name} <Text style={{ color: '#64748b' }}>({item.unit || '-'})</Text></Text>
                <Text style={{ color: '#475569', fontSize: 12 }}>Masuk: {item.total_in}  ·  Keluar: {item.total_out}  ·  Saldo: {item.balance}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Btn label="Edit" onPress={() => { setShowEdit(item); setName(item.name); setUnit(item.unit || ''); setError(null); }} />
                <Pressable onPress={() => onDelete(item)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ffb3b3', backgroundColor: '#ffecec' }}>
                  <Text style={{ fontWeight: '600', color: '#b00020' }}>Hapus</Text>
                </Pressable>
              </View>
            </View>
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
            {error ? <Text style={{ color: '#b00020', marginBottom: 8 }}>{error}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              <Btn label="Batal" onPress={() => setShowAdd(false)} />
              <Btn label="Simpan" onPress={onAdd} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showEdit} transparent animationType="fade" onRequestClose={() => setShowEdit(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, width: 360, maxWidth: '90%' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Edit Material</Text>
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
            {error ? <Text style={{ color: '#b00020', marginBottom: 8 }}>{error}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              <Btn label="Batal" onPress={() => setShowEdit(null)} />
              <Btn label="Simpan" onPress={onEditSave} />
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

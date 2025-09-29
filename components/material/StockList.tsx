import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getMaterialStock } from '@/src/db/queries/materials';

type StockRow = {
  id: string;
  name: string;
  unit?: string;
  uom?: string;
  balance?: number;
};

export default function StockList() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMaterialStock('DEMO');
        if (!mounted) return;
        const mapped = (Array.isArray(data) ? data : []).map((m: any) => ({
          id: String(m.id ?? m.code ?? m.name),
          name: String(m.name ?? m.code ?? 'Material'),
          unit: m.unit,
          uom: m.uom ?? m.unit,
          balance: Number(m.balance ?? 0),
        }));
        setRows(mapped);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ padding: 12 }}>
        <Text style={{ color: '#64748b' }}>Memuat stok material…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 12 }}>
        <Text style={{ color: '#b91c1c' }}>Gagal memuat stok: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 12, gap: 8 }}>
      {rows.map((r) => (
        <View key={r.id} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 10, borderRadius: 8 }}>
          <View>
            <Text style={{ fontWeight: '600' }}>{r.name}</Text>
            <Text style={{ color: '#64748b', fontSize: 12 }}>Satuan: {r.uom || '-'}</Text>
          </View>
          <Text style={{ fontWeight: '700' }}>{Number(r.balance ?? 0).toLocaleString('id-ID')}</Text>
        </View>
      ))}
      {rows.length === 0 && (
        <Text style={{ color: '#64748b' }}>Belum ada data material.</Text>
      )}
    </View>
  );
}

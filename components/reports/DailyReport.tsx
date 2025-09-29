import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getCurrentDate, formatIndonesianDate } from '../../src/utils/time';
import { getMaterialStock } from '@/src/db/queries/materials';

type Summary = {
  date: string;
  totalMaterials: number;
  lowStock: number;
};

export default function DailyReport() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const today = getCurrentDate();
        // Snapshot ringkas dari stok sebagai bagian laporan harian
        const materials: any[] = await getMaterialStock('DEMO');
        if (!mounted) return;
        const low = (materials || []).filter((m: any) => Number(m.balance ?? 0) <= 5).length;
        setSummary({
          date: today,
          totalMaterials: (materials || []).length,
          lowStock: low,
        });
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat ringkasan harian');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={{ minWidth: 0, minHeight: 0 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Laporan Harian</Text>
      {loading && <Text style={{ color: '#64748b' }}>Memuat…</Text>}
      {error && !loading && <Text style={{ color: '#dc2626' }}>{error}</Text>}
      {!loading && !error && summary && (
        <View style={{ gap: 8 }}>
          <Text style={{ color: '#334155' }}>Tanggal: {formatIndonesianDate(summary.date)}</Text>
          <Text style={{ color: '#334155' }}>Total Material: {summary.totalMaterials}</Text>
          <Text style={{ color: summary.lowStock > 0 ? '#b45309' : '#16a34a' }}>
            Stok Menipis (≤5): {summary.lowStock}
          </Text>
          <Text style={{ color: '#64748b', marginTop: 8 }}>
            Untuk detail lengkap, buka halaman legacy /report?tab=daily atau gunakan fitur export mingguan.
          </Text>
        </View>
      )}
    </View>
  );
}

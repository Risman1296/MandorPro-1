import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";

type Row = { period: string; total: number; count: number };

async function loadWeekly(): Promise<Row[]> {
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    const rows = await all(
      `SELECT period, SUM(amount) as total, COUNT(*) as count
       FROM payroll_lines
       WHERE period LIKE '%-W%'
       GROUP BY period
       ORDER BY period DESC`
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

export default function GajiWeekly() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    loadWeekly().then(setRows);
  }, []);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Gaji Mingguan</Text>
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7, marginTop: 8 }}>
          Belum ada data payroll mingguan.
        </Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it) => it.period}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text>{item.period}</Text>
              <Text style={{ opacity: 0.7, fontSize: 12 }}>
                Total entri: {item.count} | Jumlah: Rp{item.total ?? 0}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

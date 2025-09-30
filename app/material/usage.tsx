import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";

type Row = {
  id?: number;
  material_id?: number;
  material_name?: string;
  qty?: number;
  type?: string;
  project_id?: string;
  created_at?: string;
};

async function loadUsage(): Promise<Row[]> {
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    // coba ledger standar: material_ledger
    const rows = await all(
      `SELECT ml.*, m.name as material_name
       FROM material_ledger ml
       LEFT JOIN materials m ON m.id = ml.material_id
       ORDER BY COALESCE(ml.created_at, ml.date) DESC LIMIT 200`
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

export default function MaterialUsage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    loadUsage().then(setRows);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Pemakaian Material
      </Text>
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7, marginTop: 8 }}>
          Belum ada transaksi pemakaian/masuk.
        </Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it, i) => String(it.id ?? i)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text>
                {item.material_name ?? `(id:${item.material_id})`} —{" "}
                {item.type ?? ""} — {item.qty ?? 0}
              </Text>
              <Text style={{ opacity: 0.7, fontSize: 12 }}>
                Proyek: {item.project_id ?? "-"} | {item.created_at ?? ""}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

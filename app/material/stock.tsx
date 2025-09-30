import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";

type StockRow = {
  id?: number | string;
  name: string;
  unit?: string;
  total_in?: number;
  total_out?: number;
  balance?: number;
};

async function loadStock(): Promise<StockRow[]> {
  // coba pakai query helper kalau ada
  try {
    const mod = await import("@/src/db/queries/materials").catch(
      () => null as any
    );
    if (mod?.getMaterialStock) return await mod.getMaterialStock("DEMO");
  } catch {}
  // fallback direct SQL
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    const rows = await all(
      `SELECT id, name, unit, total_in, total_out, balance FROM materials ORDER BY name`
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

export default function MaterialStock() {
  const [rows, setRows] = useState<StockRow[]>([]);
  useEffect(() => {
    loadStock().then(setRows);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Stok Material</Text>
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7, marginTop: 8 }}>Belum ada data stok.</Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it) => String(it.id ?? it.name)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text>
                {item.name} {item.unit ? `(${item.unit})` : ""}
              </Text>
              <Text style={{ opacity: 0.7, fontSize: 12 }}>
                IN: {item.total_in ?? 0} | OUT: {item.total_out ?? 0} | BAL:{" "}
                {item.balance ?? 0}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

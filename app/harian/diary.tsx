import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";

type Row = {
  id?: number;
  project_id?: string;
  title?: string;
  note?: string;
  created_at?: string;
  date?: string;
};

async function loadDiary(): Promise<Row[]> {
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    const rows = await all(
      `SELECT * FROM diary ORDER BY COALESCE(created_at, date) DESC LIMIT 200`
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

export default function HarianDiary() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    loadDiary().then(setRows);
  }, []);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Site Diary</Text>
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7, marginTop: 8 }}>
          Belum ada diary. Gunakan form Progres untuk menambah catatan/foto.
        </Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it, i) => String(it.id ?? i)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text>
                {item.title ?? "(Tanpa judul)"} — {item.project_id ?? "-"}
              </Text>
              <Text style={{ opacity: 0.7, fontSize: 12 }}>
                {item.note ?? ""} | {item.created_at ?? item.date ?? ""}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

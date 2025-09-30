import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";

type Row = Record<string, any>;
async function loadAttendance(): Promise<Row[]> {
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    // coba kolom umum: created_at / ts / date
    const rows = await all(
      `SELECT * FROM attendance ORDER BY COALESCE(created_at, ts, date) DESC LIMIT 200`
    );
    return (rows ?? []) as Row[];
  } catch {
    return [];
  }
}

export default function AbsensiRekap() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    loadAttendance().then(setRows);
  }, []);
  const filtered = useMemo(() => {
    const search = q.toLowerCase();
    if (!search) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search));
  }, [rows, q]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Rekap Absensi</Text>
      <TextInput
        placeholder="Cari (nama/pekerja/proyek/tanggal)"
        value={q}
        onChangeText={setQ}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginTop: 12,
          marginBottom: 8,
        }}
      />
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>
          Belum ada data absensi atau tabel tidak ada.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text>
                {item.worker_name ??
                  item.workerId ??
                  item.worker_id ??
                  "Pekerja"}
                {"  "}
                {item.project_name ??
                  item.projectId ??
                  item.project_id ??
                  "Proyek"}
              </Text>
              <Text style={{ opacity: 0.7, fontSize: 12 }}>
                {item.status ?? item.type ?? ""} |{" "}
                {item.created_at ?? item.ts ?? item.date ?? ""}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

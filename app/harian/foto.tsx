import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList } from "react-native";

type PhotoRow = {
  id?: number | string;
  uri?: string;
  path?: string;
  note?: string;
  created_at?: string;
};

async function loadPhotos(): Promise<PhotoRow[]> {
  try {
    const { all } = (await import("@/src/db/adapters")) as any;
    // tabel kemungkinan: progress_photos (dipakai di progres/form)
    const rows = await all(
      `SELECT id, uri, path, note, created_at FROM progress_photos ORDER BY created_at DESC LIMIT 200`
    );
    return rows ?? [];
  } catch {
    // fallback: kalau service tersedia (opsional)
    try {
      const svc = (await import("@/src/services/photos")) as any;
      if (svc?.listSavedPhotos) return await svc.listSavedPhotos();
    } catch {}
    return [];
  }
}

export default function HarianFoto() {
  const [rows, setRows] = useState<PhotoRow[]>([]);
  useEffect(() => {
    loadPhotos().then(setRows);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Dokumentasi Foto</Text>
      {rows.length === 0 ? (
        <Text style={{ opacity: 0.7, marginTop: 8 }}>
          Belum ada foto yang tersimpan.
        </Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it, i) => String(it.id ?? it.path ?? it.uri ?? i)}
          numColumns={2}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 8, paddingTop: 12 }}
          renderItem={({ item }) => {
            const src =
              item.uri ?? (item.path ? `file://${item.path}` : undefined);
            return (
              <View
                style={{
                  flex: 1,
                  gap: 6,
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                {src ? (
                  <Image
                    source={{ uri: src }}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 6 }}
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text>(tanpa gambar)</Text>
                  </View>
                )}
                <Text numberOfLines={2} style={{ fontSize: 12, opacity: 0.8 }}>
                  {item.note ?? ""}
                </Text>
                <Text style={{ fontSize: 11, opacity: 0.6 }}>
                  {item.created_at ?? ""}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

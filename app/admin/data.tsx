import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";

type C = { label: string; table: string; count: number };

async function getCount(table: string): Promise<number> {
  try {
    const mod = await import("@/src/db/adapters"); // { all, get }
    const { get } = mod as any;
    const row = await get(`SELECT COUNT(*) c FROM ${table}`);
    return row?.c ?? 0;
  } catch {
    return 0;
  }
}

export default function AdminData() {
  const [items, setItems] = useState<C[]>([]);
  useEffect(() => {
    (async () => {
      const tables = [
        { label: "Projects", table: "projects" },
        { label: "Workers", table: "workers" },
        { label: "Materials", table: "materials" },
        { label: "Tasks", table: "tasks" },
        { label: "Attendance", table: "attendance" },
        { label: "Payroll Lines", table: "payroll_lines" },
      ];
      const withCounts: C[] = [];
      for (const t of tables)
        withCounts.push({ ...t, count: await getCount(t.table) });
      setItems(withCounts);
    })();
  }, []);

  const handleExportDemo = async () => {
    try {
      const dbApi = await import("@/src/db/database").catch(() => null as any);
      if (dbApi?.exportScopeAsJson) {
        await dbApi.exportScopeAsJson("DEMO");
        Alert.alert(
          "Export",
          "JSON DEMO berhasil dibuat (cek share/download)."
        );
      } else {
        Alert.alert("Export", "Fungsi exportScopeAsJson tidak tersedia.");
      }
    } catch (e: any) {
      Alert.alert("Export gagal", String(e?.message ?? e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        Data Overview
      </Text>
      {items.map((it) => (
        <View
          key={it.table}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 8,
            borderBottomWidth: 1,
          }}
        >
          <Text>{it.label}</Text>
          <Text>{it.count}</Text>
        </View>
      ))}
      <View style={{ height: 12 }} />
      <Pressable
        onPress={handleExportDemo}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          alignSelf: "flex-start",
        }}
      >
        <Text>Export DEMO JSON</Text>
      </Pressable>
    </View>
  );
}

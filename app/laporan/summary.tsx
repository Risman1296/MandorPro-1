import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

type KPI = { label: string; value: number };

async function count(table: string): Promise<number> {
  try {
    const { get } = (await import("@/src/db/adapters")) as any;
    const row = (await get(`SELECT COUNT(*) c FROM ${table}`)) as
      | { c: number }
      | undefined;
    return row?.c ?? 0;
  } catch {
    return 0;
  }
}

export default function LaporanSummary() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  useEffect(() => {
    (async () => {
      setKpis([
        { label: "Total Projects", value: await count("projects") },
        { label: "Total Workers", value: await count("workers") },
        {
          label: "Open Tasks",
          value: await (async () => {
            try {
              const { get } = (await import("@/src/db/adapters")) as any;
              const r = (await get(
                `SELECT COUNT(*) c FROM tasks WHERE status IS NULL OR status IN ('TODO','DOING')`
              )) as { c: number } | undefined;
              return r?.c ?? 0;
            } catch {
              return 0;
            }
          })(),
        },
        { label: "Progress Entries", value: await count("unit_progress") },
        {
          label: "Attendance Today",
          value: await (async () => {
            try {
              const { get } = (await import("@/src/db/adapters")) as any;
              const r = (await get(
                `SELECT COUNT(*) c FROM attendance WHERE date(date)=date('now')`
              )) as { c: number } | undefined;
              return r?.c ?? 0;
            } catch {
              return 0;
            }
          })(),
        },
      ]);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        Ringkasan
      </Text>
      {kpis.map((k) => (
        <View
          key={k.label}
          style={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{k.label}</Text>
          <Text>{k.value}</Text>
        </View>
      ))}
    </View>
  );
}

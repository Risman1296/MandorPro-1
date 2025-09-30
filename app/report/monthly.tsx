import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";

async function count(sql: string, params: any[] = []): Promise<number> {
  try {
    const { get } = (await import("@/src/db/adapters")) as any;
    const r = (await get(sql, params)) as { c: number } | undefined;
    return r?.c ?? 0;
  } catch {
    return 0;
  }
}

export default function ReportMonthly() {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState<string>(defaultMonth);
  const [att, setAtt] = useState(0);
  const [prog, setProg] = useState(0);
  const [mat, setMat] = useState(0);

  useEffect(() => {
    const y = month.slice(0, 4);
    const m = month.slice(5, 7);
    (async () => {
      setAtt(
        await count(
          `SELECT COUNT(*) c FROM attendance WHERE strftime('%Y', date)=? AND strftime('%m', date)=?`,
          [y, m]
        )
      );
      setProg(
        await count(
          `SELECT COUNT(*) c FROM unit_progress WHERE strftime('%Y', date)=? AND strftime('%m', date)=?`,
          [y, m]
        )
      );
      setMat(
        await count(
          `SELECT COUNT(*) c FROM material_ledger WHERE strftime('%Y', date)=? AND strftime('%m', date)=?`,
          [y, m]
        )
      );
    })();
  }, [month]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Laporan Bulanan</Text>
      <Text style={{ marginTop: 8 }}>Bulan (YYYY-MM)</Text>
      <TextInput
        value={month}
        onChangeText={setMonth}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginTop: 6,
          width: 160,
        }}
      />
      <View style={{ marginTop: 16 }}>
        <Text>Absensi (entri): {att}</Text>
        <Text>Progres (entri): {prog}</Text>
        <Text>Material (transaksi): {mat}</Text>
      </View>
    </View>
  );
}

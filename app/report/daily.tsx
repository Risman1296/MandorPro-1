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

export default function ReportDaily() {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [att, setAtt] = useState(0);
  const [prog, setProg] = useState(0);
  const [mat, setMat] = useState(0);

  useEffect(() => {
    (async () => {
      setAtt(
        await count(
          `SELECT COUNT(*) c FROM attendance WHERE date(date)=date(?)`,
          [date]
        )
      );
      setProg(
        await count(
          `SELECT COUNT(*) c FROM unit_progress WHERE date(date)=date(?)`,
          [date]
        )
      );
      setMat(
        await count(
          `SELECT COUNT(*) c FROM material_ledger WHERE date(date)=date(?)`,
          [date]
        )
      );
    })();
  }, [date]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Laporan Harian</Text>
      <Text style={{ marginTop: 8 }}>Tanggal (YYYY-MM-DD)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginTop: 6,
          width: 180,
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

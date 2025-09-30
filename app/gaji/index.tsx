import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

type PayrollRow = {
  id?: number;
  worker_id?: number;
  worker_name?: string;
  amount?: number;
  period?: string;
};
type WorkerRow = { id: number; name: string };

// --- Helpers ---
function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function currentIsoWeek(): string {
  const d = new Date();
  // ISO week: Thursday-based
  const dayNr = (d.getDay() + 6) % 7;
  const thursday = new Date(d);
  thursday.setDate(d.getDate() - dayNr + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const firstThursdayDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstThursdayDayNr + 3);
  const weekNo =
    1 + Math.round(((+thursday - +firstThursday) / 86400000 - 3) / 7);
  const year = thursday.getFullYear();
  return `${year}-W${pad2(weekNo)}`;
}

export default function GajiLegacyScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<string>(currentIsoWeek());
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [open, setOpen] = useState(false);
  const [workerId, setWorkerId] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [loading, setLoading] = useState(true);

  // Load workers list (for hints / validation)
  const loadWorkers = async () => {
    try {
      const mod = await import("@/src/db/queries/workers").catch(
        () => null as any
      );
      if (mod?.getAllWorkers) {
        const list = await mod.getAllWorkers();
        // map minimal
        setWorkers((list ?? []).map((w: any) => ({ id: w.id, name: w.name })));
        return;
      }
    } catch {}
    try {
      const { all } = (await import("@/src/db/adapters")) as any;
      const list = (await all(
        `SELECT id, name FROM workers ORDER BY name`
      )) as any[];
      setWorkers((list ?? []).map((w) => ({ id: w.id, name: w.name })));
    } catch {
      setWorkers([]);
    }
  };

  const loadRows = async (p: string) => {
    try {
      const { all } = (await import("@/src/db/adapters")) as any;
      const list = (await all(
        `SELECT pl.id, pl.worker_id, w.name as worker_name, pl.amount, pl.period
				 FROM payroll_lines pl
				 JOIN workers w ON w.id = pl.worker_id
				 WHERE pl.period = ?
				 ORDER BY w.name`,
        [p]
      )) as any[];
      setRows(list ?? []);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadWorkers(), loadRows(period)]);
      setLoading(false);
    })();
  }, []); // first mount

  useEffect(() => {
    loadRows(period);
  }, [period]);

  const totalAmount = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [rows]
  );

  const handleSubmit = async () => {
    const wid = Number(workerId);
    const amt = Number(amount);
    if (!wid || isNaN(wid)) {
      Alert.alert("Validasi", "Masukkan workerId yang valid.");
      return;
    }
    if (isNaN(amt)) {
      Alert.alert("Validasi", "Amount harus angka.");
      return;
    }
    try {
      // pakai query helper jika tersedia
      const q = await import("@/src/db/queries/payroll").catch(
        () => null as any
      );
      if (q?.insertPayrollLine) {
        await q.insertPayrollLine({ workerId: wid, period, amount: amt });
      } else {
        // fallback direct SQL
        const { run } = (await import("@/src/db/adapters")) as any;
        await run(
          `INSERT INTO payroll_lines (worker_id, period, amount) VALUES (?, ?, ?)`,
          [wid, period, amt]
        );
      }
      setOpen(false);
      setWorkerId("");
      setAmount("0");
      await loadRows(period);
    } catch (e: any) {
      Alert.alert("Gagal", String(e?.message ?? e));
    }
  };

  const deleteEntry = async (id?: number) => {
    if (!id) return;
    try {
      const { run } = (await import("@/src/db/adapters")) as any;
      await run(`DELETE FROM payroll_lines WHERE id = ?`, [id]);
      await loadRows(period);
    } catch (e: any) {
      Alert.alert("Hapus gagal", String(e?.message ?? e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Gaji (Legacy)</Text>
        <Pressable
          onPress={() => setOpen(true)}
          style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
        >
          <Text>+ Payroll Entry</Text>
        </Pressable>
      </View>

      {/* Period picker */}
      <Text>Periode (ISO week, contoh: 2025-W40)</Text>
      <TextInput
        value={period}
        onChangeText={setPeriod}
        placeholder="YYYY-Www"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginTop: 6,
          marginBottom: 12,
          width: 160,
        }}
      />

      {/* Summary */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text>Total entri: {rows.length}</Text>
        <Text>Total jumlah: Rp{totalAmount}</Text>
      </View>

      {/* List */}
      {loading ? (
        <Text style={{ opacity: 0.7 }}>Memuat…</Text>
      ) : rows.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>
          Belum ada data gaji untuk periode ini.
        </Text>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text>{item.worker_name ?? `Worker#${item.worker_id}`}</Text>
                <Text style={{ fontSize: 12, opacity: 0.7 }}>
                  {item.period}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text>Rp{item.amount ?? 0}</Text>
                <Pressable
                  onPress={() => deleteEntry(item.id)}
                  style={{ padding: 4 }}
                >
                  <Text style={{ fontSize: 12, opacity: 0.7 }}>Hapus</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal tambah */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0008",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{ backgroundColor: "white", borderRadius: 12, padding: 16 }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
              Tambah Payroll
            </Text>

            <Text>Worker ID</Text>
            <TextInput
              value={workerId}
              onChangeText={setWorkerId}
              keyboardType="numeric"
              placeholder="mis. 1"
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            />
            <Text style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              ID tersedia (contoh):{" "}
              {workers
                .slice(0, 6)
                .map((w) => w.id)
                .join(", ")}
              {workers.length > 6 ? "…" : ""}
            </Text>

            <Text>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            />

            <Text>Periode</Text>
            <TextInput
              value={period}
              onChangeText={setPeriod}
              placeholder="YYYY-Www"
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                onPress={() => setOpen(false)}
                style={{ paddingVertical: 8, paddingHorizontal: 12 }}
              >
                <Text>Batal</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text>Simpan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer actions */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <Pressable
          onPress={() => router.push("/gaji/weekly" as any)}
          style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
        >
          <Text>Lihat Rekap Mingguan</Text>
        </Pressable>
      </View>
    </View>
  );
}

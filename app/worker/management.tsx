import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import dayjs from "dayjs";
import { getAllWorkers, deleteWorker } from "@/src/db/queries/workers";
import { exportCsvTable, exportExcelTable } from "@/src/services/export";

type WorkerRow = {
  id: string;
  name: string;
  skill?: string;
  daily_wage?: number;
};

export default function WorkerManagement() {
  const [rows, setRows] = useState<WorkerRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "rate">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const raw = await getAllWorkers();
        if (!ok) return;
        const data: WorkerRow[] = (raw ?? []).map((w: any) => ({
          id: String(w.id),
          name: w.name,
          skill: w.role ?? undefined,
          daily_wage: w.rate ?? undefined,
        }));
        setRows(data);
      } catch (e: any) {
        if (!ok) return;
        setErr(e?.message ?? "Failed to load workers");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = (rows ?? []).slice();
    const ql = q.trim().toLowerCase();
    const visible = list.filter(
      (w) =>
        !ql ||
        w.name?.toLowerCase().includes(ql) ||
        w.skill?.toLowerCase().includes(ql)
    );
    visible.sort((a, b) => {
      if (sortKey === "rate") {
        const A = a.daily_wage ?? 0,
          B = b.daily_wage ?? 0;
        return sortDir === "asc" ? A - B : B - A;
      }
      const A = a.name ?? "",
        B = b.name ?? "";
      return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });
    return visible;
  }, [rows, q, sortKey, sortDir]);

  function resetControls() {
    setQ("");
    setSortKey("name");
    setSortDir("asc");
  }

  async function onExportCSV() {
    const base = `workers-${dayjs().format("YYYY-MM-DD")}`;
    await exportCsvTable(filtered, base, [
      { key: "name", header: "Name" },
      { key: "skill", header: "Role" },
      { key: "daily_wage", header: "Rate" },
    ]);
  }
  async function onExportXLSX() {
    const base = `workers-${dayjs().format("YYYY-MM-DD")}`;
    await exportExcelTable(filtered, base, "Workers", [
      { key: "name", header: "Name" },
      { key: "skill", header: "Role" },
      { key: "daily_wage", header: "Rate" },
    ]);
  }

  async function onDelete(id: string) {
    Alert.alert("Hapus pekerja", "Yakin ingin menghapus data ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await deleteWorker(id);
          setRows((prev) => (prev ?? []).filter((w) => w.id !== id));
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={S.center}>
        <ActivityIndicator />
        <Text>Memuat pekerja…</Text>
      </View>
    );
  }
  if (err) {
    return (
      <View style={S.center}>
        <Text style={{ color: "#b00020" }}>{err}</Text>
      </View>
    );
  }

  return (
    <View style={S.root}>
      {/* Toolbar */}
      <View style={S.toolbar}>
        <TextInput
          placeholder="Cari nama/role…"
          value={q}
          onChangeText={setQ}
          style={S.input}
          inputMode="search"
        />
        <Pressable
          onPress={() => setSortKey("name")}
          style={sortKey === "name" ? { ...S.btn, ...S.btnActive } : S.btn}
        >
          <Text
            style={
              sortKey === "name" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt
            }
          >
            Sort: Nama
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSortKey("rate")}
          style={sortKey === "rate" ? { ...S.btn, ...S.btnActive } : S.btn}
        >
          <Text
            style={
              sortKey === "rate" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt
            }
          >
            Sort: Rate
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          style={S.btn}
        >
          <Text style={S.btnTxt}>{sortDir === "asc" ? "↑ Asc" : "↓ Desc"}</Text>
        </Pressable>
        <Pressable onPress={resetControls} style={S.btn}>
          <Text style={{ ...S.btnTxt, fontWeight: "600" }}>Reset</Text>
        </Pressable>
        <Pressable onPress={onExportCSV} style={S.btn}>
          <Text style={{ ...S.btnTxt, fontWeight: "600" }}>Export CSV</Text>
        </Pressable>
        <Pressable onPress={onExportXLSX} style={S.btn}>
          <Text style={{ ...S.btnTxt, fontWeight: "600" }}>Export Excel</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={S.row}>
            <Text style={S.title}>{item.name}</Text>
            <Text style={S.meta}>Role: {item.skill ?? "-"}</Text>
            <Text style={S.meta}>Rate: {item.daily_wage ?? 0}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => {
                  /* open edit form (future) */
                }}
                style={S.smallBtn}
              >
                <Text style={S.smallTxt}>Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => onDelete(item.id)}
                style={{
                  ...S.smallBtn,
                  backgroundColor: "#ffe8e8",
                  borderColor: "#ffd0d0",
                }}
              >
                <Text style={{ ...S.smallTxt, color: "#b00020" }}>Hapus</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={S.center}>
            <Text>Tidak ada data pekerja.</Text>
          </View>
        }
      />
    </View>
  );
}

const S = {
  root: { flex: 1 as const, minWidth: 0 as const, minHeight: 0 as const },
  center: {
    flex: 1 as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 16,
  },
  toolbar: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "center" as const,
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  input: {
    flexGrow: 1 as const,
    minWidth: 220,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e3e3e7",
    borderRadius: 8,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e7",
  },
  btnActive: { backgroundColor: "#e8f0ff", borderColor: "#b6ccff" },
  btnTxt: { opacity: 0.85 },
  btnTxtActive: { opacity: 1, fontWeight: "600" as const },
  row: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "600" as const },
  meta: { fontSize: 14 },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e7",
    backgroundColor: "#f7f7fa",
  },
  smallTxt: { fontSize: 13, opacity: 0.9 },
} as const;

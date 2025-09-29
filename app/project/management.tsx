import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import dayjs from "dayjs";
import { getAllProjects } from "@/src/db/queries/projects";
import { exportCsvTable, exportExcelTable } from "@/src/services/export";

type ProjectRow = {
  id: string;
  code?: string;
  name: string;
  status?: "active" | "paused" | "done";
};

export default function ProjectManagement() {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "paused" | "done">("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
  const data = (await getAllProjects()) as ProjectRow[];
        if (!ok) return;
        setRows(data ?? []);
      } catch (e: any) {
        if (!ok) return;
        setErr(e?.message ?? "Failed to load projects");
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
    const visible = list.filter((p) => {
      const byQ = !ql || p.name?.toLowerCase().includes(ql) || p.code?.toLowerCase().includes(ql);
      const byS = status === "all" ? true : (p.status ?? "active") === status;
      return byQ && byS;
    });
    visible.sort((a, b) => {
      const A = a.name ?? "",
        B = b.name ?? "";
      return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });
    return visible;
  }, [rows, q, status, sortDir]);

  function resetControls() {
    setQ("");
    setStatus("all");
    setSortDir("asc");
  }

  async function onExportCSV() {
    const base = `projects-${dayjs().format("YYYY-MM-DD")}`;
    await exportCsvTable(filtered, base, [
      { key: "code", header: "Code" },
      { key: "name", header: "Name" },
      { key: "status", header: "Status" },
    ]);
  }
  async function onExportXLSX() {
    const base = `projects-${dayjs().format("YYYY-MM-DD")}`;
    await exportExcelTable(filtered, base, "Projects", [
      { key: "code", header: "Code" },
      { key: "name", header: "Name" },
      { key: "status", header: "Status" },
    ]);
  }

  if (loading)
    return (
      <View style={S.center}>
        <ActivityIndicator />
        <Text>Memuat proyek…</Text>
      </View>
    );
  if (err)
    return (
      <View style={S.center}>
        <Text style={{ color: "#b00020" }}>{err}</Text>
      </View>
    );

  return (
    <View style={S.root}>
      <View style={S.toolbar}>
        <TextInput placeholder="Cari nama/kode…" value={q} onChangeText={setQ} style={S.input} inputMode="search" />
        <Pressable onPress={() => setStatus("all")} style={status === "all" ? { ...S.btn, ...S.btnActive } : S.btn}>
          <Text style={status === "all" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt}>Semua</Text>
        </Pressable>
        <Pressable onPress={() => setStatus("active")} style={status === "active" ? { ...S.btn, ...S.btnActive } : S.btn}>
          <Text style={status === "active" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt}>Aktif</Text>
        </Pressable>
        <Pressable onPress={() => setStatus("paused")} style={status === "paused" ? { ...S.btn, ...S.btnActive } : S.btn}>
          <Text style={status === "paused" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt}>Pause</Text>
        </Pressable>
        <Pressable onPress={() => setStatus("done")} style={status === "done" ? { ...S.btn, ...S.btnActive } : S.btn}>
          <Text style={status === "done" ? { ...S.btnTxt, ...S.btnTxtActive } : S.btnTxt}>Selesai</Text>
        </Pressable>

        <Pressable onPress={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} style={S.btn}>
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

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={S.row}>
            <Text style={S.title}>{item.name}</Text>
            <Text style={S.meta}>Kode: {item.code ?? "-"}</Text>
            <Text style={S.meta}>Status: {item.status ?? "active"}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={S.center}>
            <Text>Tidak ada proyek.</Text>
          </View>
        }
      />
    </View>
  );
}

const S = {
  root: { flex: 1 as const, minWidth: 0 as const, minHeight: 0 as const },
  center: { flex: 1 as const, alignItems: "center" as const, justifyContent: "center" as const, padding: 16 },
  toolbar: { flexDirection: "row" as const, flexWrap: "wrap" as const, alignItems: "center" as const, gap: 8, paddingHorizontal: 12, paddingTop: 12 },
  input: { flexGrow: 1 as const, minWidth: 220, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#e3e3e7", borderRadius: 8 },
  btn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e3e3e7" },
  btnActive: { backgroundColor: "#e8f0ff", borderColor: "#b6ccff" },
  btnTxt: { opacity: 0.85 },
  btnTxtActive: { opacity: 1, fontWeight: "600" as const },
  row: { padding: 12, borderRadius: 12, backgroundColor: "white", borderWidth: 1, borderColor: "#eee", marginBottom: 10, gap: 6 },
  title: { fontSize: 16, fontWeight: "600" as const },
  meta: { fontSize: 14 },
} as const;
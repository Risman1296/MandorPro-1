import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View, Platform } from "react-native";
import * as FileSystem from "expo-file-system"; // retained for type references in native path
import * as Sharing from "expo-sharing"; // retained for type references in native path
import { exportCsvTable, exportExcelTable } from '@/src/services/export';
import { getMaterialStock } from '@/src/db/queries/materials';

type Item = {
  id?: string;
  name: string;
  unit?: string;
  total_out?: number;
  balance?: number;
};

export default function UsageList() {
  const [data, setData] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [q, setQ] = useState("");
  const [minUsage, setMinUsage] = useState<number>(0);
  const [sortKey, setSortKey] = useState<"out" | "name">("out");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  function resetControls() {
    setQ("");
    setMinUsage(0);
    setSortKey("out");
    setSortDir("desc");
  }

  async function exportCsv(rows: Item[]) {
    const baseName = `usage-${new Date().toISOString().slice(0, 10)}`;
    await exportCsvTable(rows, baseName, [
      { key: 'name', header: 'Name' },
      { key: 'total_out', header: 'Usage' },
      { key: 'unit', header: 'Unit' },
      { key: 'balance', header: 'Balance' },
    ]);
  }

  async function exportXlsx(rows: Item[]) {
    const baseName = `usage-${new Date().toISOString().slice(0, 10)}`;
    await exportExcelTable(rows, baseName, 'Usage', [
      { key: 'name', header: 'Name' },
      { key: 'total_out', header: 'Usage' },
      { key: 'unit', header: 'Unit' },
      { key: 'balance', header: 'Balance' },
    ]);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows: any[] = await getMaterialStock("DEMO");
        if (!mounted) return;
        setData(rows ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load material usage");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const rows = (data ?? []).slice();

    // filter query + minUsage
    const qlower = q.trim().toLowerCase();
    const byQuery = (it: Item) =>
      !qlower || it.name?.toLowerCase().includes(qlower);

    const byMin = (it: Item) =>
      (it.total_out ?? 0) >= (Number.isFinite(minUsage) ? minUsage : 0);

    // jika semua total_out 0, biarkan tampil semua (seperti logika awal)
    const hasAnyUsage = rows.some((r) => (r.total_out ?? 0) > 0);
    const predicate = (it: Item) =>
      (!hasAnyUsage || byMin(it)) && byQuery(it);

    const visible = rows.filter(predicate);

    // sort
    visible.sort((a, b) => {
      if (sortKey === "out") {
        const A = a.total_out ?? 0;
        const B = b.total_out ?? 0;
        return sortDir === "desc" ? B - A : A - B;
      }
      // name
      const A = (a.name ?? "").localeCompare(b.name ?? "");
      return sortDir === "desc" ? -A : A;
    });

    return visible;
  }, [data, q, minUsage, sortKey, sortDir]);

  if (loading) {
    return (
      <View style={S.center}>
        <ActivityIndicator />
        <Text style={S.muted}>Memuat data pemakaian…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={S.center}>
        <Text style={S.error}>Gagal memuat: {error}</Text>
      </View>
    );
  }
  if (!data?.length) {
    return (
      <View style={S.center}>
        <Text style={S.muted}>Tidak ada data material.</Text>
      </View>
    );
  }

  return (
    <View style={S.root}>
      {/* Controls */}
      <View style={S.toolbar}>
        <TextInput
          placeholder="Cari material…"
          value={q}
          onChangeText={setQ}
          style={S.input}
          inputMode="search"
        />
        <View style={S.segment}>
          <SegmentBtn
            label="Sort: Pemakaian"
            active={sortKey === "out"}
            onPress={() => setSortKey("out")}
          />
          <SegmentBtn
            label="Sort: Nama"
            active={sortKey === "name"}
            onPress={() => setSortKey("name")}
          />
        </View>
        <View style={S.segment}>
          <SegmentBtn
            label="↓ Desc"
            active={sortDir === "desc"}
            onPress={() => setSortDir("desc")}
          />
          <SegmentBtn
            label="↑ Asc"
            active={sortDir === "asc"}
            onPress={() => setSortDir("asc")}
          />
        </View>
        <TextInput
          placeholder="Min pemakaian"
          value={String(minUsage || "")}
          onChangeText={(t) => setMinUsage(Number(t) || 0)}
          style={{ ...S.input, width: 140 }}
          inputMode="numeric"
        />

        <Pressable
          onPress={resetControls}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e3e3e7" }}
        >
          <Text style={{ fontWeight: "600" }}>Reset</Text>
        </Pressable>

        <Pressable
          onPress={() => exportCsv(filtered)}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e3e3e7" }}
        >
          <Text style={{ fontWeight: "600" }}>Export CSV</Text>
        </Pressable>

        <Pressable
          onPress={() => exportXlsx(filtered)}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e3e3e7" }}
        >
          <Text style={{ fontWeight: "600" }}>Export Excel</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        data={filtered}
        keyExtractor={(it, i) => `${it.id ?? it.name ?? "row"}-${i}`}
        renderItem={({ item }) => (
          <View style={S.row}>
            <Text style={S.title}>{item.name}</Text>
            <Text style={S.meta}>
              Keluar: <Text style={S.strong}>{item.total_out ?? 0}</Text>{" "}
              {item.unit ?? ""}
            </Text>
            {typeof item.balance === "number" && (
              <Text style={S.metaDim}>Sisa: {item.balance}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={S.center}>
            <Text style={S.muted}>Tidak ada yang cocok dengan filter.</Text>
          </View>
        }
      />
    </View>
  );
}

function SegmentBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const btnStyle = active ? { ...S.segBtn, ...S.segBtnActive } : S.segBtn;
  const txtStyle = active ? { ...S.segText, ...S.segTextActive } : S.segText;
  return (
    <Pressable onPress={onPress} style={btnStyle}>
      <Text style={txtStyle}>{label}</Text>
    </Pressable>
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
  error: { color: "#b00020" },
  muted: { opacity: 0.7 },
  strong: { fontWeight: "600" as const },
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
  segment: {
    flexDirection: "row" as const,
    gap: 6,
  },
  segBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e7",
  },
  segBtnActive: {
    backgroundColor: "#e8f0ff",
    borderColor: "#b6ccff",
  },
  segText: { opacity: 0.8 },
  segTextActive: { opacity: 1, fontWeight: "600" as const },
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
  metaDim: { fontSize: 12, opacity: 0.7 },
} as const;

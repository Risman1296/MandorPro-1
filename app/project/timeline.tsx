// app/project/timeline.tsx

import TimelineView from "@/src/timeline/TimelineView";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function TimelinePage() {
  const db = useSQLiteContext();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const [rows, setRows] = useState<any[]>([]);
  const [deps, setDeps] = useState<any[]>([]);
  const [miles, setMiles] = useState<any[]>([]);
  const originalRowsRef = useRef<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const r = await db.getAllAsync(
        `SELECT id,title,start_at as startAt,due_at as dueAt,status,progress FROM tasks
         WHERE project_id = COALESCE(?, project_id) AND start_at IS NOT NULL AND due_at IS NOT NULL
         ORDER BY start_at ASC`,
        [projectId ?? null]
      );
      setRows(r);
      setDeps([]);
      setMiles([]);
      originalRowsRef.current = r;
    })();
  }, [db, projectId]);

  // Util: geser tanggal ISO ke +/- N hari
  function shiftDateStr(
    d: string | null | undefined,
    deltaDays: number
  ): string | null | undefined {
    if (!d) return d;
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(d);
    const base = new Date(d);
    if (Number.isNaN(base.getTime())) return d;
    base.setDate(base.getDate() + deltaDays);
    if (isDateOnly) {
      const y = base.getFullYear();
      const m = String(base.getMonth() + 1).padStart(2, "0");
      const day = String(base.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    return base.toISOString();
  }

  // Toolbar demo
  const shiftAll = (days: number) => {
    setRows((prev) =>
      prev.map((it) => ({
        ...it,
        startAt: shiftDateStr(it.startAt, days),
        dueAt: shiftDateStr(it.dueAt, days),
      }))
    );
  };

  const resetAll = () => {
    if (originalRowsRef.current) {
      setRows(originalRowsRef.current);
    }
  };

  // Simpan snapshot pertama kali rows terisi
  useEffect(() => {
    if (rows.length > 0 && !originalRowsRef.current) {
      originalRowsRef.current = rows;
    }
  }, [rows]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", margin: 12 }}>
        Timeline
      </Text>
      {/* Toolbar demo resize */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 12,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => shiftAll(-1)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
          }}
          accessibilityLabel="Shift semua item -1 hari"
        >
          <Text>-1 day</Text>
        </Pressable>
        <Pressable
          onPress={() => shiftAll(1)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
          }}
          accessibilityLabel="Shift semua item +1 hari"
        >
          <Text>+1 day</Text>
        </Pressable>
        <Pressable
          onPress={resetAll}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
          }}
          accessibilityLabel="Kembalikan ke data awal"
        >
          <Text>Reset</Text>
        </Pressable>
      </View>
      <TimelineView
        rows={rows}
        deps={deps}
        milestones={miles}
        prefs={{ zoom: "day", tz: "Asia/Jakarta", locale: "id" }}
      />
    </View>
  );
}

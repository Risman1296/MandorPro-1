import React from "react";
import { View, Text, Pressable, Alert } from "react-native";

export default function LaporanExport() {
  const doExport = async () => {
    try {
      const mod = await import("@/src/db/database").catch(() => null as any);
      if (mod?.exportScopeAsJson) {
        await mod.exportScopeAsJson("DEMO");
        Alert.alert("Export", "Berhasil export JSON (scope DEMO).");
      } else {
        Alert.alert("Export", "Fungsi exportScopeAsJson tidak ditemukan.");
      }
    } catch (e: any) {
      Alert.alert("Export gagal", String(e?.message ?? e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        Export
      </Text>
      <Pressable
        onPress={doExport}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          alignSelf: "flex-start",
        }}
      >
        <Text>Export JSON (DEMO)</Text>
      </Pressable>
    </View>
  );
}

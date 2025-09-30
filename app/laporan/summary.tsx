import { View, Text } from "react-native";

export default function LaporanSummaryScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Ringkasan Laporan</Text>
      <Text style={{ opacity: 0.7, marginTop: 8 }}>
        TODO: kartu KPI & quick export (PDF/Excel).
      </Text>
    </View>
  );
}

import { View, Text } from "react-native";

export default function ReportMonthlyScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Laporan Bulanan</Text>
      <Text style={{ opacity: 0.7, marginTop: 8 }}>
        TODO: ringkas progres, biaya, dan absensi per bulan.
      </Text>
    </View>
  );
}

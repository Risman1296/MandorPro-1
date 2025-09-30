import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    // redirect cepat ke dashboard
    router.replace("/dashboard");
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ActivityIndicator />
      <Text style={{ marginTop: 12 }}>Mengarahkan ke Dashboard…</Text>
    </View>
  );
}

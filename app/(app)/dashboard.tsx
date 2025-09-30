import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getPushToken } from "@/lib/notifications";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await getPushToken(); // butuh dev build
        setToken(t ?? null);
      } catch (e) {
        console.warn("Push token error:", e);
      }
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Text>Dashboard</Text>
      <Text selectable style={{ marginTop: 12 }}>
        Push token: {token ?? "(dev build required)"}
      </Text>
    </View>
  );
}

import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Admin() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 24 }}>
        Admin Panel
      </Text>
      <Pressable
        onPress={() => router.push("/admin/data")}
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16 }}>Data Overview</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/admin/database")}
        style={{ padding: 16, borderWidth: 1, borderRadius: 10 }}
      >
        <Text style={{ fontSize: 16 }}>Database</Text>
      </Pressable>
    </View>
  );
}

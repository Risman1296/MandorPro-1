import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";

export default function Worker() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  const handleAdd = async () => {
    // TODO: Integrasi ke DB, misal: await db.insertWorker({ name, rate });
    setShowModal(false);
    setName("");
    setRate("");
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Worker List</Text>
        <Pressable
          onPress={() => setShowModal(true)}
          style={{ padding: 8, borderRadius: 8, backgroundColor: "#3B82F6" }}
        >
          <Text style={{ color: "#fff" }}>+ Worker</Text>
        </Pressable>
      </View>
      {/* ...list worker (bisa integrasi SectionScreen di bawah jika ingin) ... */}
      <Modal visible={showModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0008",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: 300,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Add Worker
            </Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1,
                marginBottom: 8,
                borderRadius: 6,
                padding: 8,
              }}
            />
            <TextInput
              placeholder="Rate"
              value={rate}
              onChangeText={setRate}
              style={{
                borderWidth: 1,
                marginBottom: 8,
                borderRadius: 6,
                padding: 8,
              }}
            />
            <Pressable
              onPress={handleAdd}
              style={{
                backgroundColor: "#3B82F6",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowModal(false)}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: "#888", textAlign: "center" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

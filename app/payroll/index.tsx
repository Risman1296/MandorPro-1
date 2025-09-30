import SectionScreen from "@/components/nav/SectionScreen";
import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";

export default function Payroll() {
  const [showModal, setShowModal] = useState(false);
  const [workerId, setWorkerId] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = async () => {
    // TODO: Integrasi ke DB, misal: await db.insertPayroll({ workerId, period, amount });
    setShowModal(false);
    setWorkerId("");
    setPeriod("");
    setAmount("");
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
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Payroll</Text>
        <Pressable
          onPress={() => setShowModal(true)}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "#3B82F6",
          }}
        >
          <Text style={{ color: "#fff" }}>+ Payroll</Text>
        </Pressable>
      </View>
      {/* ...list payroll... */}
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
              Add Payroll
            </Text>
            <TextInput
              placeholder="Worker ID"
              value={workerId}
              onChangeText={setWorkerId}
              style={{
                borderWidth: 1,
                marginBottom: 8,
                borderRadius: 6,
                padding: 8,
              }}
            />
            <TextInput
              placeholder="Period"
              value={period}
              onChangeText={setPeriod}
              style={{
                borderWidth: 1,
                marginBottom: 8,
                borderRadius: 6,
                padding: 8,
              }}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
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

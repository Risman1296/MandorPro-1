import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";
import SectionScreen from "@/components/nav/SectionScreen";

export default function Project() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = async () => {
    // TODO: Integrasi ke DB, misal: await db.insertProject({ name, status, startDate, dueDate });
    setShowModal(false);
    setName("");
    setStatus("");
    setStartDate("");
    setDueDate("");
  };

  return (
    <>
      <SectionScreen />
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: 12,
          }}
        >
          <Pressable
            onPress={() => setShowModal(true)}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: "#3B82F6",
            }}
          >
            <Text style={{ color: "#fff" }}>+ Project</Text>
          </Pressable>
        </View>
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
                Add Project
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
                placeholder="Status"
                value={status}
                onChangeText={setStatus}
                style={{
                  borderWidth: 1,
                  marginBottom: 8,
                  borderRadius: 6,
                  padding: 8,
                }}
              />
              <TextInput
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
                style={{
                  borderWidth: 1,
                  marginBottom: 8,
                  borderRadius: 6,
                  padding: 8,
                }}
              />
              <TextInput
                placeholder="Due Date (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
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
                <Text style={{ color: "#888", textAlign: "center" }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

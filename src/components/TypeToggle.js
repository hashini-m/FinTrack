import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function TypeToggle({ type, setType }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 16 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: type === "expense" ? "#fee2e2" : "#f1f5f9",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginRight: 8,
        }}
        onPress={() => setType("expense")}
      >
        <Text style={{ color: "#dc2626", fontWeight: "600" }}>Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: type === "income" ? "#dcfce7" : "#f1f5f9",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={() => setType("income")}
      >
        <Text style={{ color: "#16a34a", fontWeight: "600" }}>Income</Text>
      </TouchableOpacity>
    </View>
  );
}

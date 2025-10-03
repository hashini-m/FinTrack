import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ActionButton({ icon, label, color, bgColor, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: bgColor,
        borderRadius: 8,
        marginBottom: 10,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color}
        style={{ marginRight: 8 }}
      />
      <Text style={{ fontWeight: "600", color }}>{label}</Text>
    </TouchableOpacity>
  );
}

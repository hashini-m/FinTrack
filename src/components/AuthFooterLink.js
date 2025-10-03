import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AuthFooterLink({ text, linkText, onPress }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Text style={{ color: "#475569" }}>{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: "#0d9488", fontWeight: "700" }}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

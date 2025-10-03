import React from "react";
import { Text, TextInput, View } from "react-native";

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  ...props
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{
          borderWidth: 1,
          borderColor: "#cbd5e1",
          padding: 10,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
        {...props}
      />
    </View>
  );
}

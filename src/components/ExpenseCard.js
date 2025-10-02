import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseCard({
  id, // ✅ make sure we receive id
  type,
  amount,
  currency = "LKR",
  category,
  note,
  created_at,
  photo_uri,
  latitude,
  longitude,
  onDelete, // ✅ callback from parent
}) {
  const isExpense = type === "expense";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Top row: amount + date + delete */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: isExpense ? "red" : "green",
            }}
          >
            {isExpense ? "-" : "+"}
            {amount} {currency}
          </Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            {new Date(created_at).toLocaleString()}
          </Text>
        </View>

        {/* Trash icon */}
        <Pressable
          hitSlop={8}
          onPress={() => {
            console.log("Trash tapped, id =", id); // ✅ should log immediately
            onDelete?.(id);
          }}
        >
          <Ionicons name="trash-outline" size={22} color="gray" />
        </Pressable>
      </View>

      {/* Category & Note */}
      <Text style={{ fontSize: 14, marginTop: 4 }}>
        <Text style={{ fontWeight: "600" }}>{category}</Text>
        {note ? ` • ${note}` : ""}
      </Text>

      {/* Photo & Location */}
      <View
        style={{ flexDirection: "row", marginTop: 8, alignItems: "center" }}
      >
        {photo_uri ? (
          <Image
            source={{ uri: photo_uri }}
            style={{ width: 40, height: 40, borderRadius: 6, marginRight: 8 }}
          />
        ) : null}
        {latitude && longitude ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location" size={16} color="#2563eb" />
            <Text style={{ fontSize: 12, marginLeft: 4 }}>
              {latitude.toFixed(3)}, {longitude.toFixed(3)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

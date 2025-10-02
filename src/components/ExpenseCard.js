import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseCard({
  id,
  type,
  amount,
  currency = "LKR",
  category,
  note,
  created_at,
  photo_uri,
  latitude,
  longitude,
  address,
  onDelete,
}) {
  const isExpense = type === "expense";

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 14,
        borderRadius: 14,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
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
              fontSize: 20,
              fontWeight: "700",
              color: isExpense ? "#dc2626" : "#16a34a",
            }}
          >
            {isExpense ? "-" : "+"}
            {amount} {currency}
          </Text>
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            {new Date(created_at).toLocaleString()}
          </Text>
        </View>

        {/* Trash icon */}
        <Pressable
          hitSlop={12}
          onPress={() => onDelete?.(id)}
          style={{
            backgroundColor: "#f1f5f9",
            padding: 6,
            borderRadius: 8,
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#475569" />
        </Pressable>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "#f1f5f9",
          marginVertical: 10,
        }}
      />

      {/* Category & Note */}
      <Text style={{ fontSize: 15, marginBottom: 6 }}>
        <Text style={{ fontWeight: "600", color: "#0f172a" }}>{category}</Text>
        {note ? <Text style={{ color: "#475569" }}> • {note}</Text> : null}
      </Text>

      {/* Photo & Address */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {photo_uri ? (
          <Image
            source={{ uri: photo_uri }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              marginRight: 10,
            }}
          />
        ) : null}

        {address ? (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Ionicons name="location" size={16} color="#0d9488" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                marginLeft: 4,
                color: "#475569",
                flexShrink: 1,
              }}
            >
              {address}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

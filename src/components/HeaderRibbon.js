import React from "react";
import { View } from "react-native";
import { Text, Badge } from "react-native-paper";

export default function HeaderRibbon({ title, pendingCount = 0, isOnline }) {
  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#1e293b", // slate gray
      }}
    >
      {/* Left: Breadcrumbs */}
      <Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
          FinTrack
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "white",
          }}
        >
          {"  "}/ {title}
        </Text>
      </Text>

      {/* Right: Online Status + Pending Badge */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            marginRight: 12,
            color: isOnline ? "lightgreen" : "#f87171",
            fontWeight: "bold",
          }}
        >
          {isOnline ? "Online ✅" : "Offline ⚠️"}
        </Text>

        {pendingCount > 0 && (
          <Badge style={{ backgroundColor: "orange" }} size={20}>
            {pendingCount}
          </Badge>
        )}
      </View>
    </View>
  );
}

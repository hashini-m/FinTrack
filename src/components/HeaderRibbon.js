import React from "react";
import { View } from "react-native";
import { Text, Badge, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderRibbon({ title, pendingCount = 0, onSignOut }) {
  return (
    <View
      style={{
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        backgroundColor: "#334155", // slate gray (modern fintech feel)
      }}
    >
      {/* Breadcrumb text */}
      <Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
          FinTrack
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "400", color: "white" }}>
          {" "}
          / {title}
        </Text>
      </Text>

      {/* Right side: pending badge + logout */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {pendingCount > 0 && (
          <Badge
            style={{ marginRight: 12, backgroundColor: "orange" }}
            size={20}
          >
            {pendingCount}
          </Badge>
        )}
        <Button
          mode="text"
          textColor="white"
          icon={({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={onSignOut}
          labelStyle={{ fontSize: 14, color: "white" }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

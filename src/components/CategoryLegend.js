import React from "react";
import { View, Text } from "react-native";

export default function CategoryLegend({ data }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {data.map((d, idx) => (
        <View
          key={idx}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: d.color,
              borderRadius: 3,
              marginRight: 6,
            }}
          />
          <Text style={{ fontSize: 13, color: "#334155" }}>
            {d.name} ({d.amount})
          </Text>
        </View>
      ))}
    </View>
  );
}

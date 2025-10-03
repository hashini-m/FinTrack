import React from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-paper";

export default function AnalyticsCard({ title, subtitle, children }) {
  return (
    <Card
      style={{
        marginVertical: 12,
        borderRadius: 14,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        backgroundColor: "#fff",
      }}
    >
      {(title || subtitle) && (
        <Card.Title
          title={title}
          subtitle={subtitle}
          titleStyle={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}
          subtitleStyle={{ fontSize: 13, color: "#64748b" }}
        />
      )}
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function MonthNavigator({ selectedMonth, onPrev, onNext }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 12,
      }}
    >
      <Button mode="outlined" onPress={onPrev}>
        ◀ Prev
      </Button>

      <Text
        style={{
          marginHorizontal: 16,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {selectedMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </Text>

      <Button mode="outlined" onPress={onNext}>
        Next ▶
      </Button>
    </View>
  );
}

// src/components/PrimaryButton.js
import React from "react";
import { Button } from "react-native-paper";

export default function PrimaryButton({
  icon = "plus-circle-outline",
  label = "Click Me",
  onPress,
  style,
  ...props
}) {
  return (
    <Button
      mode="contained"
      // icon={icon}
      buttonColor="#0d9488" // teal green
      textColor="white"
      style={[
        {
          marginBottom: 16,
          borderRadius: 12,
          elevation: 4, // shadow on Android
        },
        style, // allow overrides
      ]}
      labelStyle={{
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
      }}
      contentStyle={{
        paddingVertical: 6, // makes it taller
      }}
      onPress={onPress}
      {...props}
    >
      {label}
    </Button>
  );
}

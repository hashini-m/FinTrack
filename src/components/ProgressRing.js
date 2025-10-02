import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function ProgressRing({
  radius = 50,
  strokeWidth = 12,
  progress = 0.5, // 0 → 1
  color = "#2563eb",
  backgroundColor = "#e5e7eb",
  label,
}) {
  const animated = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        {/* background circle */}
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* progress circle */}
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${halfCircle} ${halfCircle})`}
        />
      </Svg>
      {/* label inside ring */}
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {Math.round(progress * 100)}%
        </Text>
        {label && (
          <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
        )}
      </View>
    </View>
  );
}

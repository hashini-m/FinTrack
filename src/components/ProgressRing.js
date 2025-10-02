import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
  radius = 50,
  strokeWidth = 12,
  progress = 0.5,
  backgroundColor = "#e5e7eb",
  label,
  income = 0,
  expense = 0,
}) {
  const animated = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const getColor = () => {
    if (progress < 0.5) return "#22c55e";
    if (progress < 0.75) return "#facc15";
    return "#ef4444";
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <AnimatedCircle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${halfCircle} ${halfCircle})`}
        />
      </Svg>

      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          {Math.round(progress * 100)}%
        </Text>
        {label && (
          <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            {label}
          </Text>
        )}
        {income > 0 && (
          <Text style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
            {expense.toFixed(0)} / {income.toFixed(0)}
          </Text>
        )}
      </View>
    </View>
  );
}

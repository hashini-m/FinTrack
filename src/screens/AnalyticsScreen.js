import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import ProgressRing from "../components/ProgressRing";
import NetInfo from "@react-native-community/netinfo";
import {
  getTransactions,
  groupTransactionsByMonth,
} from "../services/transactionService";
import { auth } from "../firebase";
import HeaderRibbon from "../components/HeaderRibbon";
import { signOut } from "firebase/auth";
import { Card, Divider } from "react-native-paper";
import { StackedBarChart } from "react-native-chart-kit";

export default function AnalyticsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthData, setMonthData] = useState([]); // ✅ for bar chart
  const [isOnline, setIsOnline] = useState(true);

  const onSignOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const load = async () => {
      const data = await getTransactions(auth.currentUser.uid);
      setTransactions(data);

      // Group by month
      const grouped = groupTransactionsByMonth(data);

      // Build chart data: sum per month
      const monthTotals = Object.keys(grouped).map((key) => {
        const [year, month] = key.split("-");
        const monthName = new Date(year, month - 1).toLocaleString("default", {
          month: "short",
        });

        const income = grouped[key]
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0);

        const expense = grouped[key]
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0);

        return { month: `${monthName} ${year}`, income, expense };
      });

      setMonthData(monthTotals);
    };

    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await getTransactions(auth.currentUser.uid);
      setTransactions(data);

      // Totals
      const income = data
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expense = data
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      setTotals({ income, expense });

      // Group expenses by category
      const catMap = {};
      data
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        });

      const chartData = Object.keys(catMap).map((c, idx) => ({
        name: c,
        amount: catMap[c],
        color: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5],
        legendFontColor: "#333",
        legendFontSize: 14,
      }));

      setCategoryData(chartData);
    };

    load();
  }, []);

  const ratio = totals.income > 0 ? totals.expense / totals.income : 0;
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      // if (state.isConnected) {
      //   fullSync();
      // }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <HeaderRibbon
        title="Analytics"
        onSignOut={onSignOut}
        isOnline={isOnline}
      />

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {/* Totals Card */}
        <Card style={{ marginVertical: 12 }}>
          {/* <Card.Title title="Totals" /> */}
          <Card.Content>
            <Text style={{ fontSize: 16, color: "#059669", fontWeight: "600" }}>
              Income: {totals.income.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 16, color: "#dc2626", fontWeight: "600" }}>
              Expense: {totals.expense.toFixed(2)}
            </Text>
            <Divider style={{ marginVertical: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#334155" }}>
              Balance: {(totals.income - totals.expense).toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        {/* Progress Ring Card */}
        <Card style={{ marginVertical: 12 }}>
          <Card.Title title="Spent vs Income" />
          <Card.Content style={{ alignItems: "center", marginVertical: 10 }}>
            <ProgressRing
              radius={70}
              strokeWidth={14}
              progress={Math.min(ratio, 1)}
              color={ratio > 0.7 ? "red" : "#2563eb"}
              label="Spent vs Income"
            />
          </Card.Content>
        </Card>

        {/* Pie Chart Card */}
        <Card
          style={{
            marginVertical: 12,
            borderRadius: 14,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
          }}
        >
          <Card.Title
            title="Expenses by Category"
            titleStyle={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}
            subtitle="Distribution of your spending"
            subtitleStyle={{ fontSize: 13, color: "#64748b" }}
          />

          <Card.Content>
            {categoryData.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 20,
                  color: "#64748b",
                }}
              >
                No expenses yet
              </Text>
            ) : (
              <>
                {/* Chart */}
                <PieChart
                  data={categoryData.map((d) => ({
                    name: d.name,
                    population: d.amount,
                    color: d.color,
                  }))}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  hasLegend={false} // ✅ hides default legend
                  style={{
                    alignSelf: "center",
                    marginLeft: 150, // ✅ shift chart slightly right
                  }}
                />

                {/* Divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#e2e8f0",
                    marginVertical: 12,
                  }}
                />

                {/* Custom Legend */}
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {categoryData.map((d, idx) => (
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
              </>
            )}
          </Card.Content>
        </Card>

        {/* ✅ Bar Chart Card */}
        <Card style={{ marginVertical: 12 }}>
          <Card.Title title="Monthly Income vs Expense" />
          <Card.Content>
            {monthData.length === 0 ? (
              <Text>No data yet</Text>
            ) : (
              <StackedBarChart
                data={{
                  labels: monthData.map((m) => m.month),
                  legend: ["Income", "Expense"],
                  data: monthData.map((m) => [m.income, m.expense]),
                  barColors: ["#22c55e", "#ef4444"], // green = income, red = expense
                }}
                width={screenWidth - 48}
                height={250}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(51,65,85,${opacity})`,
                  labelColor: (opacity = 1) => `rgba(51,65,85,${opacity})`,
                }}
                style={{ borderRadius: 12 }}
              />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import NetInfo from "@react-native-community/netinfo";
import {
  getTransactions,
  groupTransactionsByMonth,
} from "../services/transactionService";
import { auth } from "../firebase";
import HeaderRibbon from "../components/HeaderRibbon";
import { signOut } from "firebase/auth";
import { Card, Divider, Button } from "react-native-paper";
import { StackedBarChart } from "react-native-chart-kit";

import ProgressRing from "../components/ProgressRing";
import AnalyticsCard from "../components/AnalyticsCard";
import CategoryLegend from "../components/CategoryLegend";
import MonthNavigator from "../components/MonthNavigator";

export default function AnalyticsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthData, setMonthData] = useState([]); // ✅ for bar chart
  const [isOnline, setIsOnline] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // default = current month

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

      // ✅ Get selected month/year
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();

      // ✅ Filter for selected month
      const income = data
        .filter((t) => {
          const d = new Date(t.created_at);
          return (
            t.type === "income" &&
            d.getFullYear() === year &&
            d.getMonth() === month
          );
        })
        .reduce((s, t) => s + t.amount, 0);

      const expense = data
        .filter((t) => {
          const d = new Date(t.created_at);
          return (
            t.type === "expense" &&
            d.getFullYear() === year &&
            d.getMonth() === month
          );
        })
        .reduce((s, t) => s + t.amount, 0);

      setTotals({ income, expense });

      // ✅ Category grouping also filtered here
      const catMap = {};
      data
        .filter((t) => {
          if (t.type !== "expense") return false;
          const d = new Date(t.created_at);
          return d.getFullYear() === year && d.getMonth() === month;
        })
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
  }, [selectedMonth]); // 🔑 Re-run when month changes

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
      <HeaderRibbon title="Analytics" isOnline={isOnline} />

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {/* Totals Card */}
        <AnalyticsCard
          title="Totals"
          subtitle={selectedMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        >
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
        </AnalyticsCard>

        {/* Progress Ring */}
        <AnalyticsCard
          title={`Spent vs Income — ${selectedMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}`}
        >
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <ProgressRing
              radius={70}
              strokeWidth={14}
              progress={Math.min(
                totals.income > 0 ? totals.expense / totals.income : 0,
                1
              )}
              color={
                totals.income > 0 && totals.expense / totals.income > 0.7
                  ? "red"
                  : "#2563eb"
              }
              label="Spent vs Income"
            />
          </View>
        </AnalyticsCard>

        {/* Pie Chart */}
        <AnalyticsCard
          title="Expenses by Category"
          subtitle="Distribution of your spending"
        >
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
                hasLegend={false}
              />

              <MonthNavigator
                selectedMonth={selectedMonth}
                onPrev={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(selectedMonth.getMonth() - 1);
                  setSelectedMonth(newDate);
                }}
                onNext={() => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(selectedMonth.getMonth() + 1);
                  setSelectedMonth(newDate);
                }}
              />

              <CategoryLegend data={categoryData} />
            </>
          )}
        </AnalyticsCard>

        {/* Bar Chart */}
        <AnalyticsCard
          title="Monthly Income vs Expense"
          subtitle="Track how your money flows each month"
        >
          {monthData.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                paddingVertical: 20,
                color: "#64748b",
              }}
            >
              No data yet
            </Text>
          ) : (
            <StackedBarChart
              data={{
                labels: monthData.map((m) => m.month),
                legend: ["Income", "Expense"],
                data: monthData.map((m) => [m.income, m.expense]),
                barColors: ["#22c55e", "#ef4444"],
              }}
              width={screenWidth - 64}
              height={260}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(15,23,42,${opacity})`,
                labelColor: (opacity = 1) => `rgba(71,85,105,${opacity})`,
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#e2e8f0",
                },
              }}
              style={{ marginTop: 10, borderRadius: 12 }}
            />
          )}
        </AnalyticsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

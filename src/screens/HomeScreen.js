import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  getTransactions,
  countPendingTransactions,
} from "../services/transactionService";
import { fullSync } from "../services/syncService";
import ProgressRing from "../components/ProgressRing";
import ExpenseCard from "../components/ExpenseCard";
import { Appbar, Badge, Card, Text, Button, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import HeaderRibbon from "../components/HeaderRibbon";
import { deleteTransaction } from "../services/transactionService";
import { Snackbar } from "react-native-paper";
import { Alert } from "react-native";

export default function HomeScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const loadData = async () => {
    const res = await getTransactions(auth.currentUser.uid);
    setTransactions(res);

    const count = await countPendingTransactions(auth.currentUser.uid);
    setPendingCount(count);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const ratio = income > 0 ? expenses / income : 0;
      setProgress(Math.min(ratio, 1));
    }
  }, [transactions]);

  useEffect(() => {
    const unsubscribeNav = navigation.addListener("focus", async () => {
      await fullSync();
      await loadData();
    });
    return unsubscribeNav;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        fullSync();
      }
    });
    return unsubscribe;
  }, []);

  const onSignOut = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderRibbon
        title="Home"
        pendingCount={pendingCount}
        onSignOut={onSignOut}
        isOnline={isOnline}
      />
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {/* Progress Ring */}
        <Card style={{ marginBottom: 12 }}>
          <Card.Content style={{ alignItems: "center" }}>
            {/* Current Month */}
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>

            {/* Progress Ring */}
            <ProgressRing
              radius={70}
              strokeWidth={14}
              progress={progress}
              color={progress > 0.7 ? "red" : "#2563eb"}
              label="Spent vs Income"
            />
          </Card.Content>
        </Card>

        {/* Add Transaction Button */}
        <Button
          mode="contained"
          icon="plus-circle-outline"
          buttonColor="#0d9488" // teal green
          textColor="white"
          style={{
            marginBottom: 16,
            borderRadius: 12,
            elevation: 4, // shadow on Android
          }}
          labelStyle={{
            fontSize: 16,
            fontWeight: "600",
            letterSpacing: 0.5,
          }}
          contentStyle={{
            paddingVertical: 6, // makes it taller
          }}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          Add Transaction
        </Button>

        <Divider style={{ marginBottom: 16 }} />

        {/* Transaction List (scrollable because wrapped in ScrollView) */}
        {transactions.map((item) => (
          <ExpenseCard
            key={item.id}
            id={item.id}
            type={item.type}
            amount={item.amount}
            currency={item.currency}
            category={item.category}
            note={item.note}
            created_at={item.created_at}
            photo_uri={item.photo_uri}
            latitude={item.latitude}
            longitude={item.longitude}
            address={item.address} // ✅ now passed
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMsg}
      </Snackbar>
    </SafeAreaView>
  );
}

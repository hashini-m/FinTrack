import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";

import { runMigrations } from "./src/storage/db";
import { auth } from "./src/firebase"; // initializes Firebase via src/firebase/index.js

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AddTransactionScreen from "./src/screens/AddTransactionScreen";
import NetInfo from "@react-native-community/netinfo";
import { syncPendingTransactions } from "./src/services/syncService";
import {
  registerForPushNotificationsAsync,
  scheduleDailyReminder,
} from "./src/utils/notifications";

import { Provider as PaperProvider } from "react-native-paper";

const AuthStackNav = createNativeStackNavigator();
const AppStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStackNav.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </AuthStackNav.Navigator>
  );
}

// Stack inside tab for hiding AddTransaction
function AddTransactionStack() {
  return (
    <AddStack.Navigator>
      <AddStack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </AddStack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      {/* AddTransaction screen is navigated programmatically, not in tab bar */}
      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionStack}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      await runMigrations();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const ok = await registerForPushNotificationsAsync();
      if (ok) {
        await scheduleDailyReminder(20, 0); // 8:00 PM daily
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncPendingTransactions();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  if (initializing) return null; // simple splash-less wait; keeps this step minimal

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}

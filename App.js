import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { runMigrations } from "./src/storage/db";
import { auth } from "./src/firebase";

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
const RootStack = createNativeStackNavigator();
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

// --- Bottom Tabs ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Logout") {
            iconName = focused ? "log-out" : "log-out-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0d9488",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />

      {/* Logout Tab */}
      <Tab.Screen
        name="Logout"
        component={HomeScreen} // dummy
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#dc2626" />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={async () => {
                await signOut(auth);
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- Root Stack (Tabs + AddTransaction) ---
function AppStack() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
      />
    </RootStack.Navigator>
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

  if (initializing) return null;

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}

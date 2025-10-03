import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function errorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Login failed. Please try again.";
  }
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (!email || !pw)
      return Alert.alert("Missing info", "Email and password are required.");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
    } catch (e) {
      Alert.alert("Error", errorMessage(e.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#f8fafc", // light background
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        Welcome Back
      </Text>
      <Text style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        Log in to continue tracking your expenses
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#cbd5e1",
          borderRadius: 10,
          padding: 14,
          marginBottom: 14,
          backgroundColor: "#fff",
        }}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        style={{
          borderWidth: 1,
          borderColor: "#cbd5e1",
          borderRadius: 10,
          padding: 14,
          marginBottom: 20,
          backgroundColor: "#fff",
        }}
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={onLogin}
        disabled={busy}
        style={{
          backgroundColor: busy ? "#94a3b8" : "#0d9488", // teal when active, gray when busy
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Log In
          </Text>
        )}
      </TouchableOpacity>

      {/* Footer Link */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#475569" }}>New here? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Signup")}>
          <Text style={{ color: "#0d9488", fontWeight: "700" }}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function errorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email.";
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Sign up failed. Please try again.";
  }
}

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const onSignup = async () => {
    if (!email || !pw)
      return Alert.alert("Missing info", "Email and password are required.");
    setBusy(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pw);
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
        backgroundColor: "#f8fafc",
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
        Create Account
      </Text>
      <Text style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        Sign up to start tracking your expenses
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
        placeholder="Password (min 6)"
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

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={onSignup}
        disabled={busy}
        style={{
          backgroundColor: busy ? "#94a3b8" : "#0d9488",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Sign Up
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
        <Text style={{ color: "#475569" }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={{ color: "#0d9488", fontWeight: "700" }}>Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

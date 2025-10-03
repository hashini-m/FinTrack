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

import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import AuthFooterLink from "../components/AuthFooterLink";

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
        Welcome Back
      </Text>
      <Text style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        Log in to continue tracking your expenses
      </Text>

      {/* Inputs */}
      <FormInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <FormInput
        placeholder="Password"
        value={pw}
        onChangeText={setPw}
        secureTextEntry
      />

      {/* Login Button */}
      <PrimaryButton label="Log In" onPress={onLogin} />

      {/* Footer Link */}
      <AuthFooterLink
        text="New here?"
        linkText="Create an account"
        onPress={() => navigation.replace("Signup")}
      />
    </KeyboardAvoidingView>
  );
}

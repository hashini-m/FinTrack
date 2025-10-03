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

import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import AuthFooterLink from "../components/AuthFooterLink";

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

      {/* Inputs */}
      <FormInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <FormInput
        placeholder="Password (min 6)"
        value={pw}
        onChangeText={setPw}
        secureTextEntry
      />

      {/* Sign Up Button */}
      <PrimaryButton label="Sign Up" onPress={onSignup} busy={busy} />

      {/* Footer Link */}
      <AuthFooterLink
        text="Already have an account?"
        linkText="Log in"
        onPress={() => navigation.replace("Login")}
      />
    </KeyboardAvoidingView>
  );
}

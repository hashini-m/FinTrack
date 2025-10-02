import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
      // onAuthStateChanged in App.js will switch stacks automatically
    } catch (e) {
      Alert.alert("Error", errorMessage(e.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20, justifyContent: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Welcome back
      </Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      <Button
        title={busy ? "Signing in..." : "Log in"}
        onPress={onLogin}
        disabled={busy}
      />

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <Text>New here? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Signup")}>
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
        Create account
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
        placeholder="Password (min 6)"
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
        title={busy ? "Creating..." : "Sign up"}
        onPress={onSignup}
        disabled={busy}
      />

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

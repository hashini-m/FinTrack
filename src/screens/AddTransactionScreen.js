import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { addTransaction } from "../services/transactionService";
import { auth } from "../firebase";

import { syncPendingTransactions } from "../services/syncService";

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("General");
  const [note, setNote] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null);

  const onTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission required", "Camera permission is needed.");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "Permission required",
        "Location permission is needed."
      );
    }

    const loc = await Location.getCurrentPositionAsync({});
    setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
    Alert.alert(
      "Location saved",
      `Lat: ${loc.coords.latitude}, Lon: ${loc.coords.longitude}`
    );
  };

  const onSave = async () => {
    if (!amount) return Alert.alert("Validation", "Amount is required");
    try {
      await addTransaction({
        user_id: auth.currentUser.uid,
        type,
        amount: parseFloat(amount),
        category,
        note,
        photo_uri: photoUri,
        latitude: coords?.lat,
        longitude: coords?.lon,
      });
      await syncPendingTransactions();

      Alert.alert("Success", "Transaction saved with photo/location!");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save transaction.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 20, marginBottom: 16 }}>Add Transaction</Text>

        <Text>Amount</Text>
        <TextInput
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{
            borderWidth: 1,
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
          }}
        />

        <Text>Type</Text>
        <View style={{ flexDirection: "row", marginVertical: 12 }}>
          <Button
            title="Expense"
            color={type === "expense" ? "red" : undefined}
            onPress={() => setType("expense")}
          />
          <View style={{ width: 10 }} />
          <Button
            title="Income"
            color={type === "income" ? "green" : undefined}
            onPress={() => setType("income")}
          />
        </View>

        <Text>Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          style={{
            borderWidth: 1,
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
          }}
        />

        <Text>Note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          style={{
            borderWidth: 1,
            marginBottom: 20,
            padding: 8,
            borderRadius: 6,
          }}
        />

        <Button title="Take Photo" onPress={onTakePhoto} />
        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={{ width: 120, height: 120, marginVertical: 10 }}
          />
        )}

        <Button title="Get Location" onPress={onGetLocation} />
        {coords && (
          <Text style={{ marginVertical: 8 }}>
            📍 {coords.lat}, {coords.lon}
          </Text>
        )}

        <Button title="Save Transaction" onPress={onSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

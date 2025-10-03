import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { addTransaction } from "../services/transactionService";
import { auth } from "../firebase";
import { syncPendingTransactions } from "../services/syncService";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import FormInput from "../components/FormInput";
import TypeToggle from "../components/TypeToggle";
import ActionButton from "../components/ActionButton";
import PrimaryButton from "../components/PrimaryButton";

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("General");
  const [note, setNote] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categoryOptions = [
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Shopping", value: "Shopping" },
    { label: "Bills", value: "Bills" },
    { label: "Health", value: "Health" },
    { label: "Other", value: "Other" },
  ];

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

    // Reverse geocode
    const [addr] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    const prettyAddress = `${addr.name || ""} ${addr.street || ""}, ${
      addr.city || addr.region || ""
    }, ${addr.country || ""}`;

    setAddress(prettyAddress);
    Alert.alert("Location saved", prettyAddress);
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
        address: address || null,
      });
      await syncPendingTransactions();

      Alert.alert("Success", "Transaction saved!");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save transaction.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 20,
            color: "#0f172a",
          }}
        >
          Add Transaction
        </Text>

        <FormInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
        <TypeToggle type={type} setType={setType} />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Category</Text>
        <Dropdown
          style={{
            borderWidth: 1,
            borderColor: "#cbd5e1",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#fff",
            marginBottom: 14,
          }}
          placeholderStyle={{ fontSize: 14, color: "#94a3b8" }}
          selectedTextStyle={{ fontSize: 14, color: "#0f172a" }}
          data={categoryOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={category}
          onChange={(item) => setCategory(item.value)}
        />

        <FormInput
          label="Note (optional)"
          value={note}
          onChangeText={setNote}
          placeholder="Add a note..."
        />

        <ActionButton
          icon="camera-outline"
          label="Take Photo"
          color="#0369a1"
          bgColor="#e0f2fe"
          onPress={onTakePhoto}
        />
        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              marginVertical: 10,
            }}
          />
        )}

        <ActionButton
          icon="location-outline"
          label="Get Location"
          color="#ca8a04"
          bgColor="#fef9c3"
          onPress={onGetLocation}
        />
        {coords && (
          <Text style={{ marginVertical: 8, fontSize: 13, color: "#475569" }}>
            📍 {address ? address : `${coords.lat}, ${coords.lon}`}
          </Text>
        )}

        <PrimaryButton label="Save Transaction" onPress={onSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

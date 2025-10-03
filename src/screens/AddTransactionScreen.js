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

        {/* Amount */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Amount</Text>
        <TextInput
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          style={{
            borderWidth: 1,
            borderColor: "#cbd5e1",
            marginBottom: 14,
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />

        {/* Type toggle */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Type</Text>
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: type === "expense" ? "#fee2e2" : "#f1f5f9",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              marginRight: 8,
            }}
            onPress={() => setType("expense")}
          >
            <Text style={{ color: "#dc2626", fontWeight: "600" }}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: type === "income" ? "#dcfce7" : "#f1f5f9",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => setType("income")}
          >
            <Text style={{ color: "#16a34a", fontWeight: "600" }}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
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
          data={[
            { label: "Food", value: "Food" },
            { label: "Transport", value: "Transport" },
            { label: "Shopping", value: "Shopping" },
            { label: "Bills", value: "Bills" },
            { label: "Health", value: "Health" },
            { label: "Other", value: "Other" },
          ]}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={category}
          onChange={(item) => setCategory(item.value)}
        />

        {/* Note */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Note (optional)
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add a note..."
          style={{
            borderWidth: 1,
            borderColor: "#cbd5e1",
            marginBottom: 20,
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />

        {/* Photo */}
        <TouchableOpacity
          onPress={onTakePhoto}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            backgroundColor: "#e0f2fe",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color="#0369a1"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontWeight: "600", color: "#0369a1" }}>
            Take Photo
          </Text>
        </TouchableOpacity>
        {photoUri && (
          <Image
            source={{ uri: photoUri }}
            style={{
              width: 120,
              height: 120,
              marginVertical: 10,
              borderRadius: 8,
            }}
          />
        )}

        {/* Location */}
        <TouchableOpacity
          onPress={onGetLocation}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            backgroundColor: "#fef9c3",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color="#ca8a04"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontWeight: "600", color: "#ca8a04" }}>
            Get Location
          </Text>
        </TouchableOpacity>
        {coords && (
          <Text style={{ marginVertical: 8, fontSize: 13, color: "#475569" }}>
            📍 {address ? address : `${coords.lat}, ${coords.lon}`}
          </Text>
        )}

        {/* Save */}
        <TouchableOpacity
          onPress={onSave}
          style={{
            backgroundColor: "#0d9488",
            padding: 14,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Save Transaction
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

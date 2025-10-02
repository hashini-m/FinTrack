import Constants from "expo-constants";

const extra =
  // dev (Expo Go)
  Constants?.expoConfig?.extra ??
  // classic manifest (fallback)
  Constants?.manifest?.extra ??
  // eas build runtime
  {};

export const firebaseConfig = extra?.firebase || {};

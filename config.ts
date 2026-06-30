import { Platform } from "react-native";
import * as Device from "expo-device";

function getDevApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "web") {
    return process.env.EXPO_PUBLIC_API_URL_DEV_WEB ?? "";
  }
  if (Platform.OS === "android" && !Device.isDevice) {
    return process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_EMULATOR ?? "";
  }
  if (Platform.OS === "android" && Device.isDevice) {
    return process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE ?? "";
  }
  if (Platform.OS === "ios" && !Device.isDevice) {
    return process.env.EXPO_PUBLIC_API_URL_DEV_IOS_SIMULATOR ?? "";
  }

  throw new Error(
    "Set EXPO_PUBLIC_API_URL or platform-specific env var in .env.local for real device development"
  );
}

export function getApiUrl(isDev: boolean): string {
  return isDev ? getDevApiUrl() : (process.env.EXPO_PUBLIC_API_URL_PRODUCTION ?? "");
}

export const config = {
  apiUrl: getApiUrl(__DEV__),
} as const;

import { useEffect } from "react";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import type { AuthCallbackHandler } from "@/types/hooks";

export function useAuthDeepLink(onCallback: AuthCallbackHandler): void {
  useEffect(() => {
    if (Platform.OS === "web") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        onCallback(`web://callback?token=${token}`);
        window.history.replaceState({}, "", window.location.pathname);
      }
      return;
    }

    const subscription = Linking.addEventListener("url", (event) => {
      if (event.url.includes("auth/callback")) {
        onCallback(event.url);
      }
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url?.includes("auth/callback")) {
          onCallback(url);
        }
      })
      .catch((error) => {
        console.error("Failed to get initial URL:", error);
      });

    return () => subscription.remove();
  }, [onCallback]);
}

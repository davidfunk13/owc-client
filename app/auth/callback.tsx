import type { FC } from "react";
import { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { storage } from "@/lib/storage";
import { useTheme } from "@/contexts/ThemeContext";

const AuthCallback: FC = () => {
  const { token, error } = useLocalSearchParams<{ token?: string; error?: string }>();
  const { theme } = useTheme();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const isWeb = Platform.OS === "web";

        if (error) {
          if (isWeb) {
            window.location.href = "/";
            return;
          }
          router.replace("/(auth)");
          return;
        }

        if (!token) {
          if (isWeb) {
            window.location.href = "/";
            return;
          }
          router.replace("/(auth)");
          return;
        }

        await storage.setToken(token);
        if (isWeb) {
          window.location.href = "/";
          return;
        }
        router.replace("/(tabs)");
      } catch (err) {
        console.error("Auth callback failed:", err);
        router.replace("/(auth)");
      }
    };

    handleCallback();
  }, [token, error]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
    </View>
  );
};

export default AuthCallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import type { FC } from "react";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useTheme } from "@/contexts/ThemeContext";

const AuthCallback: FC = () => {
  const { code, error } = useLocalSearchParams<{ code?: string; error?: string }>();
  const { theme } = useTheme();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        if (error || !code) {
          window.location.href = "/";
          return;
        }
        const { token } = await api.exchangeCode(code);
        await storage.setToken(token);
        window.location.href = "/";
      } catch (err) {
        console.error("Auth callback failed:", err);
        window.location.href = "/";
      }
    };

    void handleCallback();
  }, [code, error]);

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

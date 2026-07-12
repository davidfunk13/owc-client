import type { FC } from "react";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { errorMessage } from "@/lib/errors";

const AuthCallback: FC = () => {
  const { code, error } = useLocalSearchParams<{ code?: string; error?: string }>();
  const { completeAuth } = useAuth();
  const { theme } = useTheme();
  const { show } = useToast();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        if (error || !code) {
          show({ message: "Sign-in was cancelled or failed.", variant: "error" });
          router.replace("/(auth)");
          return;
        }
        await completeAuth(code);
      } catch (err) {
        show({ message: errorMessage(err), variant: "error" });
        router.replace("/(auth)");
      }
    };

    void handleCallback();
  }, [code, error, completeAuth, show]);

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

import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import { storage } from "@/lib/storage";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";

const AuthCallback: FC = () => {
  const { code, error } = useLocalSearchParams<{ code?: string; error?: string }>();
  const { theme } = useTheme();
  const [failure, setFailure] = useState<string | null>(null);

  const backToSignIn = useCallback((): void => {
    window.location.href = "/";
  }, []);

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        if (error || !code) {
          setFailure("Sign-in was cancelled or failed.");
          return;
        }
        const { token } = await api.exchangeCode(code);
        await storage.setToken(token);
        window.location.href = "/";
      } catch (err) {
        setFailure(errorMessage(err));
      }
    };

    void handleCallback();
  }, [code, error]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {failure ? (
        <Card>
          <EmptyState
            title="Sign-in failed"
            description={failure}
            action={<Button title="Back to sign in" onPress={backToSignIn} />}
          />
        </Card>
      ) : (
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      )}
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

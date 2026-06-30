import { useCallback, useState } from "react";
import type { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { KeyboardSafeView } from "@/components/KeyboardSafeView/KeyboardSafeView";
import { Screen } from "@/components/Screen/Screen";
import { Stat } from "@/components/Stat/Stat";

const LoginScreen: FC = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = useCallback(async (): Promise<void> => {
    setIsLoggingIn(true);
    try {
      await login();
    } finally {
      setIsLoggingIn(false);
    }
  }, [login]);

  return (
    <Screen edges={["top", "bottom"]} style={styles.container}>
      <KeyboardSafeView style={styles.keyboardSafe}>
        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <Stat style={[styles.title, { marginBottom: theme.spacing.sm }]}>OW2C</Stat>
          <Body muted style={[styles.subtitle, { fontSize: theme.font.lg }]}>
            Overwatch 2 Stats Tracker
          </Body>

          {isLoggingIn ? (
            <View
              style={[
                styles.loadingButton,
                {
                  backgroundColor: theme.colors.primary.main,
                  paddingHorizontal: theme.spacing.xl,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.radius.sm,
                },
              ]}>
              <ActivityIndicator color={theme.colors.text.primary} />
            </View>
          ) : (
            <Button title="Login with Battle.net" onPress={handleLogin} />
          )}
        </View>
      </KeyboardSafeView>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardSafe: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
  },
  subtitle: {
    marginBottom: 48,
  },
  loadingButton: {
    minWidth: 200,
    alignItems: "center",
    opacity: 0.7,
  },
});

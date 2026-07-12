import { useCallback, useState } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { Screen } from "@/components/Screen/Screen";
import { Stat } from "@/components/Stat/Stat";
import { errorMessage } from "@/lib/errors";

const LoginScreen: FC = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { show } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = useCallback((): void => {
    setIsLoggingIn(true);
    login()
      .catch((error) => {
        show({ message: errorMessage(error), variant: "error" });
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  }, [login, show]);

  return (
    <Screen edges={["top", "bottom"]} style={styles.container}>
      <View style={[styles.content, { padding: theme.spacing.lg }]}>
        <Stat style={[styles.title, { marginBottom: theme.spacing.sm }]}>OW2C</Stat>
        <Body muted style={[styles.subtitle, { fontSize: theme.font.lg }]}>
          Overwatch 2 Stats Tracker
        </Body>

        <Button loading={isLoggingIn} onPress={handleLogin} title="Login with Battle.net" />
      </View>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

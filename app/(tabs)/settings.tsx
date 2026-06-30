import type { FC } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { Screen } from "@/components/Screen/Screen";

const SettingsScreen: FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <Screen>
      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Appearance</Heading>
        <View style={styles.row}>
          <Body>Dark Mode</Body>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.text.disabled, true: theme.colors.primary.main }}
            thumbColor={theme.colors.text.primary}
          />
        </View>
      </Card>
    </Screen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

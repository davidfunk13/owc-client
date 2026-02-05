import type { FC } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Screen } from "@/components/Screen/Screen";
import { Card } from "@/components/Card/Card";
import { ThemedText } from "@/components/ThemedText/ThemedText";

const StatsScreen: FC = () => {
  const { theme } = useTheme();

  return (
    <Screen scroll>
      <Card>
        <ThemedText variant="title" style={{ marginBottom: theme.spacing.md }}>
          Statistics
        </ThemedText>
        <ThemedText variant="secondary" style={styles.placeholder}>
          No stats available yet.
        </ThemedText>
        <ThemedText variant="hint" style={[styles.placeholder, { marginTop: theme.spacing.sm }]}>
          Track games to see detailed statistics about your performance.
        </ThemedText>
      </Card>

      <Card>
        <ThemedText variant="title" style={{ marginBottom: theme.spacing.md }}>
          Heroes
        </ThemedText>
        <ThemedText variant="secondary" style={styles.placeholder}>
          No hero data yet.
        </ThemedText>
      </Card>

      <Card>
        <ThemedText variant="title" style={{ marginBottom: theme.spacing.md }}>
          Maps
        </ThemedText>
        <ThemedText variant="secondary" style={styles.placeholder}>
          No map data yet.
        </ThemedText>
      </Card>
    </Screen>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  placeholder: {
    textAlign: "center",
  },
});

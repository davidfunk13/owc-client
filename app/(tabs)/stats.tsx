import type { FC } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { Screen } from "@/components/Screen/Screen";

const StatsScreen: FC = () => {
  const { theme } = useTheme();

  return (
    <Screen scroll>
      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Statistics</Heading>
        <Body muted style={styles.placeholder}>
          No stats available yet.
        </Body>
        <Caption tiny style={[styles.placeholder, { marginTop: theme.spacing.sm }]}>
          Track games to see detailed statistics about your performance.
        </Caption>
      </Card>

      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Heroes</Heading>
        <Body muted style={styles.placeholder}>
          No hero data yet.
        </Body>
      </Card>

      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Maps</Heading>
        <Body muted style={styles.placeholder}>
          No map data yet.
        </Body>
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

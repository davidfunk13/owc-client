import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { Screen } from "@/components/Screen/Screen";
import { Stat } from "@/components/Stat/Stat";

const HomeOverview: FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <Screen scroll>
      <View
        style={[
          styles.banner,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.md,
          },
        ]}>
        <Body muted>Welcome back,</Body>
        <Heading size="lg">{user?.battletag || "Player"}</Heading>
      </View>

      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Quick Stats</Heading>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Stat>--</Stat>
            <Caption style={{ marginTop: theme.spacing.xs }}>Games</Caption>
          </View>
          <View style={styles.statItem}>
            <Stat>--</Stat>
            <Caption style={{ marginTop: theme.spacing.xs }}>Wins</Caption>
          </View>
          <View style={styles.statItem}>
            <Stat>--%</Stat>
            <Caption style={{ marginTop: theme.spacing.xs }}>Win Rate</Caption>
          </View>
        </View>
      </Card>

      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Recent Activity</Heading>
        <Body muted style={[styles.placeholder, { marginTop: theme.spacing.sm }]}>
          No games recorded yet.
        </Body>
        <Caption tiny style={[styles.placeholder, { marginTop: theme.spacing.xs }]}>
          Track your first game to see stats here!
        </Caption>
      </Card>
    </Screen>
  );
};

export default HomeOverview;

const styles = StyleSheet.create({
  banner: {},
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  placeholder: {
    textAlign: "center",
  },
});

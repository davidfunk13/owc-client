import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Heading } from "@/components/Heading/Heading";
import type { EmptyStateProps } from "@/types/components";

const EmptyStateComponent: FC<EmptyStateProps> = ({ title, description, action, style }) => {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.container,
        {
          padding: theme.spacing.xl,
          gap: theme.spacing.sm,
        },
        style,
      ]}>
      <Heading size="md" style={styles.text}>
        {title}
      </Heading>
      {description ? (
        <Body muted style={styles.text}>
          {description}
        </Body>
      ) : null}
      {action ? (
        <View style={[styles.action, { marginTop: theme.spacing.md }]}>{action}</View>
      ) : null}
    </View>
  );
};

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  action: {
    alignItems: "center",
  },
});

import { memo, useMemo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Caption } from "@/components/Caption/Caption";
import type { BadgeProps, BadgeTone } from "@/types/components";
import type { Theme } from "@/types/theme";

const toneColors = (tone: BadgeTone, theme: Theme): { background: string; text: string } => {
  if (tone === "primary") {
    return { background: theme.colors.primary.main, text: theme.colors.text.onAccent };
  }
  if (tone === "success") {
    return { background: theme.colors.success.main, text: theme.colors.text.onAccent };
  }
  if (tone === "warning") {
    return { background: theme.colors.error.main, text: theme.colors.text.onAccent };
  }
  if (tone === "error") {
    return { background: theme.colors.error.main, text: theme.colors.text.onAccent };
  }
  if (tone === "info") {
    return { background: theme.colors.info.main, text: theme.colors.text.onAccent };
  }
  return { background: theme.colors.background.paper, text: theme.colors.text.primary };
};

const BadgeComponent: FC<BadgeProps> = ({ label, tone = "neutral", style }) => {
  const { theme } = useTheme();
  const colors = useMemo(() => toneColors(tone, theme), [tone, theme]);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        styles.badge,
        {
          backgroundColor: colors.background,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.radius.full,
        },
        style,
      ]}>
      <Caption style={[styles.label, { color: colors.text }]}>{label}</Caption>
    </View>
  );
};

export const Badge = memo(BadgeComponent);

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "600",
  },
});

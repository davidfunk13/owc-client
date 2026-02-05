import { memo, useMemo } from "react";
import type { FC } from "react";
import { Text, type TextStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/theme";
import type { TextVariant, ThemedTextProps } from "@/types/components";

function getVariantStyle(variant: TextVariant, theme: Theme): TextStyle {
  switch (variant) {
    case "title":
      return {
        fontSize: theme.font.lg,
        fontWeight: "600",
        color: theme.colors.text.primary,
      };
    case "heading":
      return {
        fontSize: theme.font.xl,
        fontWeight: "bold",
        color: theme.colors.text.primary,
      };
    case "stat":
      return {
        fontSize: theme.font.xxl,
        fontWeight: "bold",
        color: theme.colors.primary.main,
      };
    case "body":
      return {
        fontSize: theme.font.md,
        color: theme.colors.text.primary,
      };
    case "secondary":
      return {
        fontSize: theme.font.md,
        color: theme.colors.text.secondary,
      };
    case "label":
      return {
        fontSize: theme.font.sm,
        color: theme.colors.text.secondary,
      };
    case "hint":
      return {
        fontSize: theme.font.xs,
        color: theme.colors.text.disabled,
      };
  }
}

const ThemedTextComponent: FC<ThemedTextProps> = ({ variant = "body", children, style }) => {
  const { theme } = useTheme();
  const variantStyle = useMemo(() => getVariantStyle(variant, theme), [variant, theme]);
  return <Text style={[variantStyle, style]}>{children}</Text>;
};

export const ThemedText = memo(ThemedTextComponent);

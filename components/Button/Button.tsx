import { memo } from "react";
import type { FC } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { ButtonProps } from "@/types/components";

const ButtonComponent: FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyle =
    variant === "primary"
      ? {
          backgroundColor: theme.colors.primary.main,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minWidth: 200,
        }
      : {
          backgroundColor: theme.colors.error.main,
          padding: theme.spacing.md,
          margin: theme.spacing.md,
        };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        { borderRadius: theme.radius.sm },
        variantStyle,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator color={theme.colors.text.onAccent} />
      ) : (
        <Text style={[styles.text, { color: theme.colors.text.onAccent, fontSize: theme.font.md }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: "600",
  },
});

import type { FC } from "react";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { ToastProps, ToastVariant } from "@/types/toast";
import type { Theme } from "@/types/theme";

const variantColor = (theme: Theme, variant: ToastVariant): string => {
  if (variant === "success") {
    return theme.colors.success.main;
  }
  if (variant === "error") {
    return theme.colors.error.main;
  }
  return theme.colors.info.main;
};

const ToastComponent: FC<ToastProps> = ({ toast, onDismiss }) => {
  const { theme } = useTheme();
  const variant = toast.variant ?? "info";
  const accent = variantColor(theme, variant);

  const handlePress = useCallback((): void => {
    onDismiss(toast.id);
  }, [onDismiss, toast.id]);

  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityLabel={toast.message}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.paper,
          borderColor: accent,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.sm,
        },
      ]}>
      <View
        style={[
          styles.bar,
          { backgroundColor: accent, borderRadius: theme.radius.sm, marginRight: theme.spacing.sm },
        ]}
      />
      <Text style={[styles.message, { color: theme.colors.text.primary, fontSize: theme.font.md }]}>
        {toast.message}
      </Text>
    </Pressable>
  );
};

export const Toast = memo(ToastComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
  },
  bar: {
    width: 4,
    alignSelf: "stretch",
  },
  message: {
    flex: 1,
    fontWeight: "500",
  },
});

import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Caption } from "@/components/Caption/Caption";
import type { FieldProps } from "@/types/components";

const FieldComponent: FC<FieldProps> = ({ label, hint, required = false, children, style }) => {
  const { theme } = useTheme();

  return (
    <View style={[{ gap: theme.spacing.xs }, style]}>
      {label ? <Caption style={styles.label}>{required ? `${label} *` : label}</Caption> : null}
      {children}
      {hint ? <Caption tiny>{hint}</Caption> : null}
    </View>
  );
};

export const Field = memo(FieldComponent);

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
});

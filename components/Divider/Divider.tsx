import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { DividerProps } from "@/types/components";

const DividerComponent: FC<DividerProps> = ({ style }) => {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="none"
      style={[styles.line, { backgroundColor: theme.colors.border.light }, style]}
    />
  );
};

export const Divider = memo(DividerComponent);

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: "100%",
  },
});

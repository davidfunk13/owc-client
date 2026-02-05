import { memo } from "react";
import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { ScreenProps } from "@/types/components";

const ScreenComponent: FC<ScreenProps> = ({ children, scroll = false, style }) => {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background.default },
    style,
  ];

  if (scroll) {
    return <ScrollView style={containerStyle}>{children}</ScrollView>;
  }
  return <View style={containerStyle}>{children}</View>;
};

export const Screen = memo(ScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

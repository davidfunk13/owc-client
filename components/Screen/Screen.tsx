import { memo, useMemo } from "react";
import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import type { SafeAreaEdge, ScreenProps } from "@/types/components";

const EMPTY_EDGES: SafeAreaEdge[] = [];

const ScreenComponent: FC<ScreenProps> = ({
  children,
  scroll = false,
  style,
  edges = EMPTY_EDGES,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const insetStyle = useMemo(
    () => ({
      paddingTop: edges.includes("top") ? insets.top : 0,
      paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
      paddingLeft: edges.includes("left") ? insets.left : 0,
      paddingRight: edges.includes("right") ? insets.right : 0,
    }),
    [edges, insets.top, insets.bottom, insets.left, insets.right]
  );

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background.default },
    insetStyle,
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

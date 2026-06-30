import { memo, useEffect, useRef } from "react";
import type { FC } from "react";
import { Animated, type DimensionValue, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { SkeletonProps } from "@/types/components";

const SHIMMER_DURATION_MS = 1200;
const MIN_OPACITY = 0.4;
const MAX_OPACITY = 0.85;

const SkeletonComponent: FC<SkeletonProps> = ({ shape = "rect", width, height, style }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: MAX_OPACITY,
          duration: SHIMMER_DURATION_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: SHIMMER_DURATION_MS / 2,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const resolvedHeight =
    height ?? (shape === "circle" ? 40 : shape === "text" ? theme.font.md : 16);
  const resolvedWidth: DimensionValue = width ?? (shape === "circle" ? resolvedHeight : "100%");
  const borderRadius = shape === "circle" ? resolvedHeight / 2 : theme.radius.sm;

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.background.paper,
          width: resolvedWidth,
          height: resolvedHeight,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const Skeleton = memo(SkeletonComponent);

const styles = StyleSheet.create({
  base: {},
});

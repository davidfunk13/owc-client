import { memo } from "react";
import type { FC } from "react";
import { Image, type ImageStyle } from "expo-image";
import { type StyleProp, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Stat } from "@/components/Stat/Stat";
import type { AvatarProps } from "@/types/components";

const DEFAULT_SIZE = 64;

const AvatarComponent: FC<AvatarProps> = ({ source, fallback, size = DEFAULT_SIZE, style }) => {
  const { theme } = useTheme();
  const dimensions = { width: size, height: size, borderRadius: size / 2 };
  const backgroundColor = theme.colors.background.paper;
  const initialStyle = { fontSize: size * 0.45 };

  if (source) {
    const imageStyle: StyleProp<ImageStyle> = [
      dimensions,
      { backgroundColor },
      style as StyleProp<ImageStyle>,
    ];
    return (
      <Image
        accessibilityLabel="Avatar"
        contentFit="cover"
        source={{ uri: source }}
        style={imageStyle}
      />
    );
  }

  const initial = fallback?.charAt(0).toUpperCase() ?? "?";

  return (
    <View
      accessibilityLabel="Avatar placeholder"
      style={[styles.placeholder, dimensions, { backgroundColor }, style]}>
      <Stat style={initialStyle}>{initial}</Stat>
    </View>
  );
};

export const Avatar = memo(AvatarComponent);

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});

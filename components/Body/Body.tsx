import { memo, useMemo } from "react";
import type { FC } from "react";
import { Text, type TextStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { BodyProps, BodySize } from "@/types/components";
import type { Theme } from "@/types/theme";

const sizeStyle = (size: BodySize, theme: Theme): TextStyle => {
  if (size === "sm") {
    return { fontSize: theme.font.sm };
  }
  return { fontSize: theme.font.md };
};

const BodyComponent: FC<BodyProps> = ({ size = "md", muted = false, children, style }) => {
  const { theme } = useTheme();
  const variantStyle = useMemo(() => sizeStyle(size, theme), [size, theme]);
  const color = muted ? theme.colors.text.secondary : theme.colors.text.primary;

  return <Text style={[variantStyle, { color }, style]}>{children}</Text>;
};

export const Body = memo(BodyComponent);

import { memo, useMemo } from "react";
import type { FC } from "react";
import { Text, type TextStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { HeadingProps, HeadingSize } from "@/types/components";
import type { Theme } from "@/types/theme";

const sizeStyle = (size: HeadingSize, theme: Theme): TextStyle => {
  if (size === "lg") {
    return { fontSize: theme.font.xl, fontWeight: "700" };
  }
  if (size === "sm") {
    return { fontSize: theme.font.md, fontWeight: "600" };
  }
  return { fontSize: theme.font.lg, fontWeight: "600" };
};

const HeadingComponent: FC<HeadingProps> = ({ size = "md", children, style }) => {
  const { theme } = useTheme();
  const variantStyle = useMemo(() => sizeStyle(size, theme), [size, theme]);

  return (
    <Text
      accessibilityRole="header"
      style={[variantStyle, { color: theme.colors.text.primary }, style]}>
      {children}
    </Text>
  );
};

export const Heading = memo(HeadingComponent);

import { memo } from "react";
import type { FC } from "react";
import { Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { CaptionProps } from "@/types/components";

const CaptionComponent: FC<CaptionProps> = ({ tiny = false, children, style }) => {
  const { theme } = useTheme();
  const fontSize = tiny ? theme.font.xs : theme.font.sm;
  const color = tiny ? theme.colors.text.disabled : theme.colors.text.secondary;

  return <Text style={[{ fontSize, color }, style]}>{children}</Text>;
};

export const Caption = memo(CaptionComponent);

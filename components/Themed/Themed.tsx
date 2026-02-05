import { memo } from "react";
import type { FC } from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { TextProps, ViewProps } from "@/types/components";

const TextComponent: FC<TextProps> = ({ style, lightColor, darkColor, ...otherProps }) => {
  const { theme, isDark } = useTheme();
  const color = isDark
    ? (darkColor ?? theme.colors.text.primary)
    : (lightColor ?? theme.colors.text.primary);

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
};

const ViewComponent: FC<ViewProps> = ({ style, lightColor, darkColor, ...otherProps }) => {
  const { theme, isDark } = useTheme();
  const backgroundColor = isDark
    ? (darkColor ?? theme.colors.background.default)
    : (lightColor ?? theme.colors.background.default);

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export const Text = memo(TextComponent);
export const View = memo(ViewComponent);

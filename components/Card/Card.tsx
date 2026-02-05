import { memo } from "react";
import type { FC } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { CardProps } from "@/types/components";

const CardComponent: FC<CardProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.background.paper,
          margin: theme.spacing.md,
          padding: theme.spacing.lg,
          borderRadius: theme.radius.md,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const Card = memo(CardComponent);

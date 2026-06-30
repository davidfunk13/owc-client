import { memo } from "react";
import type { FC } from "react";
import { Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { StatProps } from "@/types/components";

const StatComponent: FC<StatProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { fontSize: theme.font.xxl, fontWeight: "700", color: theme.colors.primary.main },
        style,
      ]}>
      {children}
    </Text>
  );
};

export const Stat = memo(StatComponent);

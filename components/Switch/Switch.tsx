import { memo } from "react";
import type { FC } from "react";
import { Switch as RNSwitch, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import type { SwitchProps } from "@/types/components";

const SwitchComponent: FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.row, style]}>
      {label ? <Body>{label}</Body> : null}
      <RNSwitch
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        onValueChange={onValueChange}
        thumbColor={theme.colors.text.primary}
        trackColor={{ false: theme.colors.text.disabled, true: theme.colors.primary.main }}
        value={value}
      />
    </View>
  );
};

export const Switch = memo(SwitchComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

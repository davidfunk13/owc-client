import { memo, useCallback } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import type { SelectOption, SelectProps, SelectValue } from "@/types/components";

const SelectComponent: FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.xs }, style]}>
      {label ? <Body size="sm">{label}</Body> : null}
      <View
        accessibilityRole="radiogroup"
        style={[styles.row, { gap: theme.spacing.xs, opacity: disabled ? 0.5 : 1 }]}>
        {options.map((option) => (
          <SelectOptionPill
            key={String(option.value)}
            disabled={disabled}
            onPress={onValueChange}
            option={option}
            selected={option.value === value}
          />
        ))}
      </View>
    </View>
  );
};

interface SelectOptionPillProps {
  option: SelectOption;
  selected: boolean;
  disabled: boolean;
  onPress: (value: SelectValue) => void;
}

const SelectOptionPill: FC<SelectOptionPillProps> = ({ option, selected, disabled, onPress }) => {
  const { theme } = useTheme();

  const handlePress = useCallback((): void => {
    onPress(option.value);
  }, [onPress, option.value]);

  const backgroundColor = selected ? theme.colors.primary.main : "transparent";
  const borderColor = selected ? theme.colors.primary.main : theme.colors.border.light;
  const textColor = selected ? theme.colors.text.onAccent : theme.colors.text.primary;

  return (
    <Pressable
      accessibilityLabel={option.label}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.pill,
        {
          backgroundColor,
          borderColor,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.radius.full,
        },
      ]}>
      <Body style={[styles.label, { color: textColor }]}>{option.label}</Body>
    </Pressable>
  );
};

export const Select = memo(SelectComponent);

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pill: {
    borderWidth: 1,
  },
  label: {},
});

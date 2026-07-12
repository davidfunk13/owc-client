import { memo, useCallback } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import type { ChipGroupProps, ChipOption, SelectValue } from "@/types/components";

const ChipGroupComponent: FC<ChipGroupProps> = ({
  values,
  onChange,
  options,
  primaryValue,
  showPrimaryBadge = false,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const primary = primaryValue ?? values[0] ?? null;

  const toggle = useCallback(
    (value: SelectValue): void => {
      const next = values.includes(value)
        ? values.filter((current) => current !== value)
        : [...values, value];
      onChange(next);
    },
    [values, onChange]
  );

  return (
    <View style={[styles.container, { gap: theme.spacing.xs }, style]}>
      {label ? <Caption>{label}</Caption> : null}
      <View style={[styles.row, { gap: theme.spacing.xs, opacity: disabled ? 0.5 : 1 }]}>
        {options.map((option) => (
          <Chip
            key={String(option.value)}
            disabled={disabled}
            isPrimary={showPrimaryBadge && option.value === primary}
            onToggle={toggle}
            option={option}
            selected={values.includes(option.value)}
          />
        ))}
      </View>
    </View>
  );
};

interface ChipProps {
  option: ChipOption;
  selected: boolean;
  isPrimary: boolean;
  disabled: boolean;
  onToggle: (value: SelectValue) => void;
}

const Chip: FC<ChipProps> = ({ option, selected, isPrimary, disabled, onToggle }) => {
  const { theme } = useTheme();

  const handlePress = useCallback((): void => {
    onToggle(option.value);
  }, [onToggle, option.value]);

  const backgroundColor = selected ? theme.colors.primary.main : "transparent";
  const borderColor = selected ? theme.colors.primary.main : theme.colors.border.light;
  const textColor = selected ? theme.colors.text.onAccent : theme.colors.text.primary;

  return (
    <Pressable
      accessibilityLabel={option.label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.chip,
        {
          backgroundColor,
          borderColor,
          gap: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.full,
        },
      ]}>
      {isPrimary ? <Body style={[styles.star, { color: textColor }]}>★</Body> : null}
      <Body style={[styles.label, { color: textColor }]}>{option.label}</Body>
    </Pressable>
  );
};

export const ChipGroup = memo(ChipGroupComponent);

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  label: {
    fontWeight: "600",
  },
  star: {
    fontWeight: "600",
  },
});

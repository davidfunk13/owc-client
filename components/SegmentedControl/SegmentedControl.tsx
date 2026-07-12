import { memo, useCallback } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import type { SegmentedControlProps, SegmentedOption, SelectValue } from "@/types/components";
import type { Theme } from "@/types/theme";

const accentFor = (tone: SegmentedOption["tone"], theme: Theme): string => {
  if (tone === "success") {
    return theme.colors.success.main;
  }
  if (tone === "error") {
    return theme.colors.error.main;
  }
  if (tone === "neutral") {
    return theme.colors.text.secondary;
  }
  return theme.colors.primary.main;
};

const SegmentedControlComponent: FC<SegmentedControlProps> = ({
  value,
  onChange,
  options,
  allowDeselect = false,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.xs }, style]}>
      {label ? <Caption>{label}</Caption> : null}
      <View
        accessibilityRole="radiogroup"
        style={[styles.row, { gap: theme.spacing.xs, opacity: disabled ? 0.5 : 1 }]}>
        {options.map((option) => (
          <Segment
            key={String(option.value)}
            allowDeselect={allowDeselect}
            disabled={disabled}
            onChange={onChange}
            option={option}
            selected={option.value === value}
          />
        ))}
      </View>
    </View>
  );
};

interface SegmentProps {
  option: SegmentedOption;
  selected: boolean;
  allowDeselect: boolean;
  disabled: boolean;
  onChange: (value: SelectValue | null) => void;
}

const Segment: FC<SegmentProps> = ({ option, selected, allowDeselect, disabled, onChange }) => {
  const { theme } = useTheme();
  const accent = accentFor(option.tone, theme);

  const handlePress = useCallback((): void => {
    onChange(selected && allowDeselect ? null : option.value);
  }, [onChange, selected, allowDeselect, option.value]);

  const backgroundColor = selected ? accent : "transparent";
  const borderColor = selected ? accent : theme.colors.border.light;
  const textColor = selected ? theme.colors.text.onAccent : theme.colors.text.primary;

  return (
    <Pressable
      accessibilityLabel={option.label}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.segment,
        {
          backgroundColor,
          borderColor,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.sm,
          borderRadius: theme.radius.md,
        },
      ]}>
      <Body style={[styles.label, { color: textColor }]}>{option.label}</Body>
    </Pressable>
  );
};

export const SegmentedControl = memo(SegmentedControlComponent);

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
  },
});

import { memo, useCallback } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import type { CounterProps } from "@/types/components";

const CounterComponent: FC<CounterProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  const decrement = useCallback((): void => {
    const next = value - step;
    onChange(next < min ? min : next);
  }, [value, step, min, onChange]);

  const increment = useCallback((): void => {
    const next = value + step;
    onChange(max !== undefined && next > max ? max : next);
  }, [value, step, max, onChange]);

  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  return (
    <View style={[styles.container, { gap: theme.spacing.sm }, style]}>
      {label ? <Caption>{label}</Caption> : null}
      <View style={[styles.row, { gap: theme.spacing.md }]}>
        <StepButton disabled={disabled || atMin} label="Decrease" onPress={decrement} symbol="–" />
        <Body style={styles.value}>{value}</Body>
        <StepButton disabled={disabled || atMax} label="Increase" onPress={increment} symbol="+" />
      </View>
    </View>
  );
};

interface StepButtonProps {
  label: string;
  symbol: string;
  disabled: boolean;
  onPress: () => void;
}

const StepButton: FC<StepButtonProps> = ({ label, symbol, disabled, onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          borderColor: theme.colors.border.light,
          borderRadius: theme.radius.md,
          opacity: disabled ? 0.4 : 1,
        },
      ]}>
      <Body style={styles.symbol}>{symbol}</Body>
    </Pressable>
  );
};

export const Counter = memo(CounterComponent);

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    fontWeight: "600",
  },
  value: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
  },
});

import { memo, useCallback } from "react";
import type { FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import type { CheckboxProps } from "@/types/components";

const CheckboxComponent: FC<CheckboxProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  const handlePress = useCallback((): void => {
    onValueChange(!value);
  }, [onValueChange, value]);

  const boxColor = value ? theme.colors.primary.main : "transparent";
  const borderColor = value ? theme.colors.primary.main : theme.colors.border.light;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.row, { gap: theme.spacing.sm, opacity: disabled ? 0.5 : 1 }, style]}>
      <View
        style={[
          styles.box,
          {
            backgroundColor: boxColor,
            borderColor,
            borderRadius: theme.radius.sm,
          },
        ]}>
        {value ? <FontAwesome name="check" size={14} color={theme.colors.text.onAccent} /> : null}
      </View>
      {label ? <Body>{label}</Body> : null}
    </Pressable>
  );
};

export const Checkbox = memo(CheckboxComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

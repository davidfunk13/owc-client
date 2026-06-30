import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import type { InputProps } from "@/types/components";

const InputComponent: FC<InputProps> = ({
  value,
  onChangeText,
  onBlur,
  label,
  placeholder,
  error,
  helper,
  disabled = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  multiline = false,
  style,
}) => {
  const { theme } = useTheme();
  const borderColor = error ? theme.colors.error.main : theme.colors.border.light;

  return (
    <View style={[styles.container, { gap: theme.spacing.xs }, style]}>
      {label ? <Body size="sm">{label}</Body> : null}
      <TextInput
        accessibilityLabel={label ?? placeholder}
        editable={!disabled}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
        value={value}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor,
            color: theme.colors.text.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.sm,
            opacity: disabled ? 0.5 : 1,
            fontSize: theme.font.md,
          },
          multiline && styles.multiline,
        ]}
      />
      {error ? (
        <Caption tiny style={{ color: theme.colors.error.main }}>
          {error}
        </Caption>
      ) : helper ? (
        <Caption tiny>{helper}</Caption>
      ) : null}
    </View>
  );
};

export const Input = memo(InputComponent);

const styles = StyleSheet.create({
  container: {},
  input: {
    borderWidth: 1,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
});

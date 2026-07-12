import { memo } from "react";
import type { FC } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import type { KeyboardSafeViewProps } from "@/types/components";

const KeyboardSafeViewComponent: FC<KeyboardSafeViewProps> = ({ children, style }) => {
  return (
    <KeyboardAvoidingView behavior="height" style={[styles.container, style]}>
      {children}
    </KeyboardAvoidingView>
  );
};

export const KeyboardSafeView = memo(KeyboardSafeViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

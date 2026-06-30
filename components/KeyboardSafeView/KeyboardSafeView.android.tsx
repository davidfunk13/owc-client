import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import type { KeyboardSafeViewProps } from "@/types/components";

const KeyboardSafeViewComponent: FC<KeyboardSafeViewProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export const KeyboardSafeView = memo(KeyboardSafeViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

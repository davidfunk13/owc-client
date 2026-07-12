import { memo } from "react";
import type { FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Modal as RNModal, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Heading } from "@/components/Heading/Heading";
import { KeyboardSafeView } from "@/components/KeyboardSafeView/KeyboardSafeView";
import type { BottomSheetProps } from "@/types/components";

const BottomSheetComponent: FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <RNModal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardSafeView
        style={[styles.backdrop, { backgroundColor: theme.colors.background.highlight }]}>
        <Pressable
          accessibilityLabel="Close bottom sheet"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityRole="none"
          accessibilityLabel={title}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.background.paper,
              borderTopColor: theme.colors.border.light,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              paddingBottom: theme.spacing.xl,
              gap: theme.spacing.md,
            },
            style,
          ]}>
          <View
            style={[
              styles.handle,
              { backgroundColor: theme.colors.border.light, borderRadius: theme.radius.full },
            ]}
          />
          <View style={styles.header}>
            {title ? (
              <Heading style={styles.title} size="md">
                {title}
              </Heading>
            ) : (
              <View style={styles.title} />
            )}
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose}>
              <FontAwesome name="times" size={20} color={theme.colors.text.secondary} />
            </Pressable>
          </View>
          <View>{children}</View>
        </View>
      </KeyboardSafeView>
    </RNModal>
  );
};

export const BottomSheet = memo(BottomSheetComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    borderTopWidth: 1,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
  },
});

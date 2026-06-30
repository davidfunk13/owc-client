import { memo } from "react";
import type { FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Modal as RNModal, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Heading } from "@/components/Heading/Heading";
import type { ModalProps } from "@/types/components";

const ModalComponent: FC<ModalProps> = ({ visible, onClose, title, children, style }) => {
  const { theme } = useTheme();

  return (
    <RNModal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={[styles.backdrop, { backgroundColor: theme.colors.background.highlight }]}>
        <Pressable
          accessibilityLabel="Close modal"
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
              borderColor: theme.colors.border.light,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              gap: theme.spacing.md,
            },
            style,
          ]}>
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
      </View>
    </RNModal>
  );
};

export const Modal = memo(ModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    maxWidth: 480,
    borderWidth: 1,
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

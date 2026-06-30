import { memo } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import type { ListItemProps } from "@/types/components";

const ListItemComponent: FC<ListItemProps> = ({
  title,
  description,
  leading,
  trailing,
  onPress,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const interactive = onPress !== undefined;

  const content = (
    <View
      style={[
        styles.row,
        {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          gap: theme.spacing.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>
        <Body>{title}</Body>
        {description ? <Caption>{description}</Caption> : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );

  if (!interactive) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}>
      {content}
    </Pressable>
  );
};

export const ListItem = memo(ListItemComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  leading: {
    flexShrink: 0,
  },
  body: {
    flex: 1,
  },
  trailing: {
    flexShrink: 0,
  },
});

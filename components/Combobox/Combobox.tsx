import { memo, useCallback, useMemo, useState } from "react";
import type { FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, type ListRenderItem, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import type { ComboboxProps, SelectOption, SelectValue } from "@/types/components";

const ComboboxComponent: FC<ComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  clearable = false,
  disabled = false,
  label,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(needle));
  }, [options, query]);

  const close = useCallback((): void => {
    setOpen(false);
    setQuery("");
  }, []);

  const openPicker = useCallback((): void => {
    if (!disabled && !loading) {
      setOpen(true);
    }
  }, [disabled, loading]);

  const handleSelect = useCallback(
    (next: SelectValue): void => {
      onChange(next);
      close();
    },
    [onChange, close]
  );

  const handleClear = useCallback((): void => {
    onChange(null);
  }, [onChange]);

  const renderOption = useCallback<ListRenderItem<SelectOption>>(
    ({ item }) => (
      <ComboboxOptionRow onSelect={handleSelect} option={item} selected={item.value === value} />
    ),
    [handleSelect, value]
  );

  const keyExtractor = useCallback((option: SelectOption): string => String(option.value), []);

  const triggerLabel = loading ? "Loading…" : (selected?.label ?? placeholder);
  const showClear = clearable && value !== null && !disabled;

  return (
    <View style={style}>
      <View style={[styles.triggerRow, { gap: theme.spacing.xs }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ disabled: disabled || loading }}
          disabled={disabled || loading}
          onPress={openPicker}
          style={[
            styles.trigger,
            {
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.border.light,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radius.sm,
              opacity: disabled ? 0.5 : 1,
            },
          ]}>
          <Body muted={!selected} style={styles.triggerLabel}>
            {triggerLabel}
          </Body>
          <FontAwesome name="chevron-down" size={12} color={theme.colors.text.secondary} />
        </Pressable>
        {showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear selection"
            onPress={handleClear}
            style={[
              styles.clear,
              {
                borderColor: theme.colors.border.light,
                borderRadius: theme.radius.sm,
                paddingHorizontal: theme.spacing.sm,
              },
            ]}>
            <FontAwesome name="times" size={14} color={theme.colors.text.secondary} />
          </Pressable>
        ) : null}
      </View>

      <Modal onClose={close} title={label ?? placeholder} visible={open}>
        <View style={[styles.picker, { gap: theme.spacing.sm }]}>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            value={query}
          />
          <FlatList
            data={filtered}
            keyboardShouldPersistTaps="handled"
            keyExtractor={keyExtractor}
            ListEmptyComponent={<Caption style={styles.empty}>{emptyText}</Caption>}
            renderItem={renderOption}
            style={styles.list}
          />
        </View>
      </Modal>
    </View>
  );
};

interface ComboboxOptionRowProps {
  option: SelectOption;
  selected: boolean;
  onSelect: (value: SelectValue) => void;
}

const ComboboxOptionRow: FC<ComboboxOptionRowProps> = memo(({ option, selected, onSelect }) => {
  const { theme } = useTheme();

  const handlePress = useCallback((): void => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected }}
      onPress={handlePress}
      style={[
        styles.option,
        {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.radius.sm,
          backgroundColor: selected ? theme.colors.background.highlight : "transparent",
        },
      ]}>
      <Body style={styles.optionLabel}>{option.label}</Body>
      {selected ? <FontAwesome name="check" size={14} color={theme.colors.primary.main} /> : null}
    </Pressable>
  );
});

ComboboxOptionRow.displayName = "ComboboxOptionRow";

export const Combobox = memo(ComboboxComponent);

const styles = StyleSheet.create({
  triggerRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  trigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  triggerLabel: {
    flex: 1,
  },
  picker: {},
  clear: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    maxHeight: 280,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLabel: {
    flex: 1,
  },
  empty: {
    textAlign: "center",
    paddingVertical: 16,
  },
});

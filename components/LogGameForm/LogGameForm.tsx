import { memo, useEffect, useMemo, useRef } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";
import { useFormWithFeedback } from "@/hooks/useFormWithFeedback";
import { useHeroes } from "@/hooks/useHeroes";
import { useInvalidateGames } from "@/hooks/useInvalidateGames";
import { useMaps } from "@/hooks/useMaps";
import { api } from "@/lib/api";
import { gameResultBadge } from "@/lib/game";
import {
  defaultGameFormValues,
  gameFormSchema,
  gameFormToPayload,
  gameToFormValues,
} from "@/lib/gameForm";
import { QUEUE_OPTIONS, RESULT_OPTIONS, ROLE_OPTIONS } from "@/constants/game";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { ChipGroup } from "@/components/ChipGroup/ChipGroup";
import { Combobox } from "@/components/Combobox/Combobox";
import { Field } from "@/components/Field/Field";
import { Input } from "@/components/Input/Input";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { Select } from "@/components/Select/Select";
import type { ChipOption, LogGameFormProps, SelectOption } from "@/types/components";
import type { Game, GameFormValues } from "@/types/game";

const LogGameFormComponent: FC<LogGameFormProps> = ({ layout = "sheet", game, onDone }) => {
  const { theme } = useTheme();
  const invalidateGames = useInvalidateGames();
  const heroesQuery = useHeroes();
  const mapsQuery = useMaps();
  const isEdit = game !== undefined;

  const form = useFormWithFeedback<GameFormValues, Game>({
    schema: gameFormSchema,
    defaultValues: game ? gameToFormValues(game) : defaultGameFormValues,
    mutationFn: (values) =>
      game
        ? api.updateGame(game.id, gameFormToPayload(values))
        : api.createGame(gameFormToPayload(values)),
    successMessage: isEdit ? "Game updated" : "Game logged",
    onSuccess: () => {
      invalidateGames();
      onDone?.();
    },
  });

  const { control, watch, formState, setValue, submit, isSubmitting } = form;
  const result = watch("result");
  const role = watch("role_played");
  const previousRole = useRef(role);

  useEffect(() => {
    if (previousRole.current !== role) {
      previousRole.current = role;
      setValue("heroes", []);
    }
  }, [role, setValue]);

  const heroOptions = useMemo<ChipOption[]>(
    () =>
      (heroesQuery.data ?? [])
        .filter((hero) => hero.role === role)
        .map((hero) => ({ label: hero.name, value: hero.id })),
    [heroesQuery.data, role]
  );

  const mapOptions = useMemo<SelectOption[]>(
    () => (mapsQuery.data ?? []).map((map) => ({ label: map.name, value: map.id })),
    [mapsQuery.data]
  );

  const badge = gameResultBadge(result);
  const heroesError = formState.errors.heroes?.message;

  const handleSave = (): void => {
    submit().catch(() => undefined);
  };

  return (
    <View style={[styles.root, { gap: theme.spacing.md }]}>
      <View style={styles.statusRow}>
        <Badge label={badge.label} tone={badge.tone} />
      </View>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <Field label="Result" hint="Leave blank to save as in progress">
            <Controller
              control={control}
              name="result"
              render={({ field }) => (
                <SegmentedControl
                  allowDeselect
                  onChange={field.onChange}
                  options={RESULT_OPTIONS}
                  value={field.value}
                />
              )}
            />
          </Field>

          <View style={[styles.group, layout === "page" ? styles.groupRow : null]}>
            <View style={layout === "page" ? styles.col : null}>
              <Field label="Queue">
                <Controller
                  control={control}
                  name="queue_type"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      options={QUEUE_OPTIONS}
                      value={field.value}
                    />
                  )}
                />
              </Field>
            </View>
            <View style={layout === "page" ? styles.col : null}>
              <Field label="Role">
                <Controller
                  control={control}
                  name="role_played"
                  render={({ field }) => (
                    <SegmentedControl
                      allowDeselect
                      onChange={field.onChange}
                      options={ROLE_OPTIONS}
                      value={field.value}
                    />
                  )}
                />
              </Field>
            </View>
          </View>

          <Field label="Map">
            <Controller
              control={control}
              name="map_id"
              render={({ field }) => (
                <Combobox
                  clearable
                  loading={mapsQuery.isLoading}
                  onChange={field.onChange}
                  options={mapOptions}
                  placeholder="Select a map"
                  searchPlaceholder="Search maps…"
                  value={field.value}
                />
              )}
            />
          </Field>

          <Field label="Heroes played" hint="First pick is your main" required={result !== null}>
            {role === null ? (
              <Caption tiny>Pick a role to choose heroes.</Caption>
            ) : heroesQuery.isLoading ? (
              <Caption tiny>Loading heroes…</Caption>
            ) : (
              <Controller
                control={control}
                name="heroes"
                render={({ field }) => (
                  <ChipGroup
                    onChange={field.onChange}
                    options={heroOptions}
                    showPrimaryBadge
                    values={field.value}
                  />
                )}
              />
            )}
          </Field>
          {heroesError ? (
            <Caption tiny style={{ color: theme.colors.error.main }}>
              {heroesError}
            </Caption>
          ) : null}

          <Field label="Notes">
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Input
                  multiline
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  placeholder="What happened? What would you do differently?"
                  value={field.value}
                />
              )}
            />
          </Field>
        </View>
      </Card>

      <Button
        loading={isSubmitting}
        onPress={handleSave}
        title={isEdit ? "Update game" : result ? "Save game" : "Save as in-progress"}
      />
    </View>
  );
};

export const LogGameForm = memo(LogGameFormComponent);

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
  },
  statusRow: {
    flexDirection: "row",
  },
  group: {
    flexDirection: "column",
  },
  groupRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  col: {
    flex: 1,
    minWidth: 220,
  },
});

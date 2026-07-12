import { memo, useMemo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";
import { useFormWithFeedback } from "@/hooks/useFormWithFeedback";
import { useHeroes } from "@/hooks/useHeroes";
import { useInvalidateGames } from "@/hooks/useInvalidateGames";
import { api } from "@/lib/api";
import { parseNumeric } from "@/lib/number";
import {
  defaultRoundFormValues,
  roundFormSchema,
  roundFormToPayload,
  roundToFormValues,
} from "@/lib/roundForm";
import { ROUND_RESULT_OPTIONS, SIDE_OPTIONS } from "@/constants/game";
import { Button } from "@/components/Button/Button";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { ChipGroup } from "@/components/ChipGroup/ChipGroup";
import { Combobox } from "@/components/Combobox/Combobox";
import { Counter } from "@/components/Counter/Counter";
import { Field } from "@/components/Field/Field";
import { Input } from "@/components/Input/Input";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { Switch } from "@/components/Switch/Switch";
import type { ChipOption, RoundFormProps, SelectOption } from "@/types/components";
import type { GameRound, RoundFormValues } from "@/types/game";

const RoundFormComponent: FC<RoundFormProps> = ({ game, round, onDone }) => {
  const { theme } = useTheme();
  const invalidateGames = useInvalidateGames();
  const heroesQuery = useHeroes();
  const isEdit = round !== undefined;
  const mapType = game.map?.map_type;

  const form = useFormWithFeedback<RoundFormValues, GameRound>({
    schema: roundFormSchema,
    defaultValues: round ? roundToFormValues(round) : defaultRoundFormValues,
    mutationFn: (values) =>
      round
        ? api.updateRound(round.id, roundFormToPayload(values))
        : api.createRound(game.id, roundFormToPayload(values)),
    successMessage: isEdit ? "Round updated" : "Round added",
    onSuccess: () => {
      invalidateGames();
      onDone?.();
    },
  });

  const { control, submit, isSubmitting } = form;

  const heroOptions = useMemo<ChipOption[]>(
    () =>
      (heroesQuery.data ?? [])
        .filter((hero) => (game.role_played ? hero.role === game.role_played : true))
        .map((hero) => ({ label: hero.name, value: hero.id })),
    [heroesQuery.data, game.role_played]
  );

  const submapOptions = useMemo<SelectOption[]>(
    () => (game.map?.submaps ?? []).map((submap) => ({ label: submap.name, value: submap.id })),
    [game.map?.submaps]
  );

  const isControl = mapType === "control";
  const isPayload = mapType === "escort" || mapType === "hybrid";
  const isPush = mapType === "push";
  const isFlashpoint = mapType === "flashpoint";

  const handleSave = (): void => {
    submit().catch(() => undefined);
  };

  return (
    <View style={[styles.root, { gap: theme.spacing.md }]}>
      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <Field label="Result">
            <Controller
              control={control}
              name="result"
              render={({ field }) => (
                <SegmentedControl
                  allowDeselect
                  onChange={field.onChange}
                  options={ROUND_RESULT_OPTIONS}
                  value={field.value}
                />
              )}
            />
          </Field>

          {isControl ? (
            <Field label="Point" hint="Which point this round was on">
              <Controller
                control={control}
                name="map_submap_id"
                render={({ field }) => (
                  <Combobox
                    clearable
                    onChange={field.onChange}
                    options={submapOptions}
                    placeholder="Pick a point"
                    searchPlaceholder="Search points…"
                    value={field.value}
                  />
                )}
              />
            </Field>
          ) : null}

          {isPayload ? (
            <Field label="Side">
              <Controller
                control={control}
                name="side"
                render={({ field }) => (
                  <SegmentedControl
                    allowDeselect
                    onChange={field.onChange}
                    options={SIDE_OPTIONS}
                    value={field.value}
                  />
                )}
              />
            </Field>
          ) : null}

          {isPayload ? (
            <Field label="Checkpoints reached">
              <Controller
                control={control}
                name="checkpoints_reached"
                render={({ field }) => (
                  <Counter min={0} onChange={field.onChange} value={field.value ?? 0} />
                )}
              />
            </Field>
          ) : null}

          {isPush ? (
            <Field label="Distance (m)">
              <Controller
                control={control}
                name="distance_meters"
                render={({ field }) => (
                  <Input
                    keyboardType="decimal-pad"
                    onChangeText={(text) => field.onChange(parseNumeric(text))}
                    placeholder="0"
                    value={field.value === null ? "" : String(field.value)}
                  />
                )}
              />
            </Field>
          ) : null}

          {isFlashpoint ? (
            <View style={[styles.scoreRow, { gap: theme.spacing.md }]}>
              <Field label="Your points" style={styles.scoreCol}>
                <Controller
                  control={control}
                  name="score_team"
                  render={({ field }) => (
                    <Counter max={5} min={0} onChange={field.onChange} value={field.value ?? 0} />
                  )}
                />
              </Field>
              <Field label="Enemy points" style={styles.scoreCol}>
                <Controller
                  control={control}
                  name="score_enemy"
                  render={({ field }) => (
                    <Counter max={5} min={0} onChange={field.onChange} value={field.value ?? 0} />
                  )}
                />
              </Field>
            </View>
          ) : null}

          <Field label="Heroes this round">
            {heroesQuery.isLoading ? (
              <Caption tiny>Loading heroes…</Caption>
            ) : (
              <Controller
                control={control}
                name="heroes"
                render={({ field }) => (
                  <ChipGroup onChange={field.onChange} options={heroOptions} values={field.value} />
                )}
              />
            )}
          </Field>

          <Controller
            control={control}
            name="is_overtime"
            render={({ field }) => (
              <Switch label="Went to overtime" onValueChange={field.onChange} value={field.value} />
            )}
          />
        </View>
      </Card>

      <Button
        loading={isSubmitting}
        onPress={handleSave}
        title={isEdit ? "Update round" : "Add round"}
      />
    </View>
  );
};

export const RoundForm = memo(RoundFormComponent);

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
  },
  scoreRow: {
    flexDirection: "row",
  },
  scoreCol: {
    flex: 1,
  },
});

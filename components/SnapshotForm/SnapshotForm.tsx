import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";
import { useFormWithFeedback } from "@/hooks/useFormWithFeedback";
import { useInvalidateGames } from "@/hooks/useInvalidateGames";
import { api } from "@/lib/api";
import { parseNumeric } from "@/lib/number";
import {
  buildSnapshotDefaults,
  snapshotFormSchema,
  snapshotFormToPayload,
} from "@/lib/snapshotForm";
import { DIVISION_OPTIONS, ROLE_OPTIONS, TIER_OPTIONS } from "@/constants/game";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { Combobox } from "@/components/Combobox/Combobox";
import { Field } from "@/components/Field/Field";
import { Input } from "@/components/Input/Input";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import type { SnapshotFormProps } from "@/types/components";
import type { Game, SnapshotFormValues } from "@/types/game";

const SnapshotFormComponent: FC<SnapshotFormProps> = ({ game, onDone }) => {
  const { theme } = useTheme();
  const invalidateGames = useInvalidateGames();

  const form = useFormWithFeedback<SnapshotFormValues, Game>({
    schema: snapshotFormSchema,
    defaultValues: buildSnapshotDefaults(game),
    mutationFn: (values) => api.syncSnapshots(game.id, snapshotFormToPayload(values)),
    successMessage: "Rank & SR saved",
    onSuccess: () => {
      invalidateGames();
      onDone?.();
    },
  });

  const { control, submit, isSubmitting, watch, setValue, formState } = form;
  const tier = watch("tier");
  const heroes = game.heroes ?? [];
  const roleError = formState.errors.role?.message;

  const handleSave = (): void => {
    submit().catch(() => undefined);
  };

  return (
    <View style={[styles.root, { gap: theme.spacing.md }]}>
      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <Field label="Role">
            <Controller
              control={control}
              name="role"
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
          {roleError ? (
            <Caption tiny style={{ color: theme.colors.error.main }}>
              {roleError}
            </Caption>
          ) : null}

          <Field label="Rank" hint="Your competitive tier after this game">
            <Controller
              control={control}
              name="tier"
              render={({ field }) => (
                <Combobox
                  clearable
                  onChange={(value) => {
                    field.onChange(value);
                    if (value === "champion" || value === null) {
                      setValue("division", null);
                    }
                  }}
                  options={TIER_OPTIONS}
                  placeholder="Pick a tier"
                  searchPlaceholder="Search tiers…"
                  value={field.value}
                />
              )}
            />
          </Field>

          {tier && tier !== "champion" ? (
            <Field label="Division">
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <SegmentedControl
                    allowDeselect
                    onChange={field.onChange}
                    options={DIVISION_OPTIONS}
                    value={field.value}
                  />
                )}
              />
            </Field>
          ) : null}

          {tier ? (
            <Field label="Progress to next (%)">
              <Controller
                control={control}
                name="progress_percent"
                render={({ field }) => (
                  <Input
                    keyboardType="numeric"
                    onChangeText={(text) => field.onChange(parseNumeric(text))}
                    placeholder="0"
                    value={field.value === null ? "" : String(field.value)}
                  />
                )}
              />
            </Field>
          ) : null}
        </View>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <Body>Hero SR</Body>
          {heroes.length === 0 ? (
            <Caption tiny>Log heroes on this game to record their SR.</Caption>
          ) : (
            heroes.map((hero, index) => (
              <Field key={hero.hero_id} label={hero.name ?? `Hero ${hero.hero_id}`}>
                <Controller
                  control={control}
                  name={`hero_srs.${index}.sr_value`}
                  render={({ field }) => (
                    <Input
                      keyboardType="numeric"
                      onChangeText={(text) => field.onChange(parseNumeric(text))}
                      placeholder="0"
                      value={field.value === null ? "" : String(field.value)}
                    />
                  )}
                />
              </Field>
            ))
          )}
        </View>
      </Card>

      <Button loading={isSubmitting} onPress={handleSave} title="Save rank & SR" />
    </View>
  );
};

export const SnapshotForm = memo(SnapshotFormComponent);

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
  },
});

import { z } from "zod";
import type { Game, RankInput, SnapshotFormValues, SyncSnapshotsPayload } from "@/types/game";

export const snapshotFormSchema = z
  .object({
    role: z.enum(["tank", "damage", "support"]).nullable(),
    tier: z
      .enum([
        "bronze",
        "silver",
        "gold",
        "platinum",
        "diamond",
        "master",
        "grandmaster",
        "champion",
      ])
      .nullable(),
    division: z.number().nullable(),
    progress_percent: z.number().nullable(),
    hero_srs: z.array(
      z.object({
        hero_id: z.number(),
        hero_name: z.string(),
        sr_value: z.number().nullable(),
      })
    ),
  })
  .refine((values) => !values.tier || values.role !== null, {
    message: "Pick the role you played to save a rank.",
    path: ["role"],
  });

export function buildSnapshotDefaults(game: Game): SnapshotFormValues {
  const rank = game.rank_snapshots?.[0] ?? null;
  const existing = new Map(
    (game.hero_srs ?? []).map((snapshot) => [snapshot.hero_id, snapshot.sr_value])
  );

  return {
    role: rank?.role ?? game.role_played,
    tier: rank?.tier ?? null,
    division: rank?.division ?? null,
    progress_percent: rank?.progress_percent ?? null,
    hero_srs: (game.heroes ?? []).map((hero) => ({
      hero_id: hero.hero_id,
      hero_name: hero.name ?? `Hero ${hero.hero_id}`,
      sr_value: existing.get(hero.hero_id) ?? null,
    })),
  };
}

export function snapshotFormToPayload(values: SnapshotFormValues): SyncSnapshotsPayload {
  const ranks: RankInput[] =
    values.tier && values.role
      ? [
          {
            role: values.role,
            tier: values.tier,
            division: values.division,
            progress_percent: values.progress_percent,
          },
        ]
      : [];

  const hero_srs = values.hero_srs.flatMap((entry) =>
    entry.sr_value === null ? [] : [{ hero_id: entry.hero_id, sr_value: entry.sr_value }]
  );

  return { ranks, hero_srs };
}

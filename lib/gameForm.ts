import { z } from "zod";
import type { CreateGamePayload, Game, GameFormValues } from "@/types/game";

export const gameFormSchema = z
  .object({
    result: z.enum(["win", "loss", "draw"]).nullable(),
    queue_type: z.enum([
      "competitive_role_queue",
      "competitive_open_queue",
      "quick_play",
      "arcade",
      "custom",
    ]),
    role_played: z.enum(["tank", "damage", "support"]).nullable(),
    map_id: z.number().nullable(),
    heroes: z.array(z.number()),
    notes: z.string(),
  })
  .refine((values) => values.result === null || values.heroes.length >= 1, {
    message: "Pick at least one hero to finish a game",
    path: ["heroes"],
  });

export const defaultGameFormValues: GameFormValues = {
  result: null,
  queue_type: "competitive_role_queue",
  role_played: null,
  map_id: null,
  heroes: [],
  notes: "",
};

export function gameToFormValues(game: Game): GameFormValues {
  const heroes = [...(game.heroes ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .map((hero) => hero.hero_id);

  return {
    result: game.result,
    queue_type: game.queue_type,
    role_played: game.role_played,
    map_id: game.map_id,
    heroes,
    notes: game.notes ?? "",
  };
}

export function gameFormToPayload(values: GameFormValues): CreateGamePayload {
  const trimmedNotes = values.notes.trim();

  return {
    queue_type: values.queue_type,
    status: values.result ? "complete" : "in_progress",
    result: values.result,
    role_played: values.role_played,
    map_id: values.map_id,
    heroes: values.heroes,
    notes: trimmedNotes.length > 0 ? trimmedNotes : null,
  };
}

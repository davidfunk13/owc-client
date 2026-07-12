import { z } from "zod";
import type { CreateRoundPayload, GameRound, RoundFormValues } from "@/types/game";

export const roundFormSchema = z.object({
  result: z.enum(["win", "loss", "draw"]).nullable(),
  side: z.enum(["attack", "defense"]).nullable(),
  map_submap_id: z.number().nullable(),
  heroes: z.array(z.number()),
  score_team: z.number().nullable(),
  score_enemy: z.number().nullable(),
  distance_meters: z.number().nullable(),
  checkpoints_reached: z.number().nullable(),
  is_overtime: z.boolean(),
});

export const defaultRoundFormValues: RoundFormValues = {
  result: null,
  side: null,
  map_submap_id: null,
  heroes: [],
  score_team: null,
  score_enemy: null,
  distance_meters: null,
  checkpoints_reached: null,
  is_overtime: false,
};

export function roundToFormValues(round: GameRound): RoundFormValues {
  return {
    result: round.result,
    side: round.side,
    map_submap_id: round.map_submap_id,
    heroes: (round.heroes ?? []).map((hero) => hero.hero_id),
    score_team: round.score_team,
    score_enemy: round.score_enemy,
    distance_meters: round.distance_meters,
    checkpoints_reached: round.checkpoints_reached,
    is_overtime: round.is_overtime,
  };
}

export function roundFormToPayload(values: RoundFormValues): CreateRoundPayload {
  return {
    result: values.result,
    side: values.side,
    map_submap_id: values.map_submap_id,
    heroes: values.heroes,
    score_team: values.score_team,
    score_enemy: values.score_enemy,
    distance_meters: values.distance_meters,
    checkpoints_reached: values.checkpoints_reached,
    is_overtime: values.is_overtime,
  };
}

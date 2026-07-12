import { defaultRoundFormValues, roundFormToPayload, roundToFormValues } from "@/lib/roundForm";
import type { GameRound } from "@/types/game";

describe("roundFormToPayload", () => {
  it("sends an empty heroes array so clearing heroes persists", () => {
    const payload = roundFormToPayload({ ...defaultRoundFormValues, result: "win" });

    expect(payload.heroes).toEqual([]);
    expect(payload.result).toBe("win");
  });

  it("includes picked heroes", () => {
    const payload = roundFormToPayload({ ...defaultRoundFormValues, heroes: [1, 2] });

    expect(payload.heroes).toEqual([1, 2]);
  });
});

describe("roundToFormValues", () => {
  it("maps a saved round back into editable form values", () => {
    const round: GameRound = {
      id: 1,
      game_id: 1,
      round_number: 2,
      map_submap_id: 5,
      result: "loss",
      side: "attack",
      score_team: 2,
      score_enemy: 1,
      distance_meters: null,
      checkpoints_reached: 3,
      is_overtime: true,
      submap: null,
      heroes: [{ hero_id: 10, name: "Reinhardt" }],
      created_at: "2026-07-01T00:00:00Z",
      updated_at: "2026-07-01T00:00:00Z",
    };

    const values = roundToFormValues(round);

    expect(values.heroes).toEqual([10]);
    expect(values.side).toBe("attack");
    expect(values.map_submap_id).toBe(5);
    expect(values.checkpoints_reached).toBe(3);
    expect(values.is_overtime).toBe(true);
  });
});

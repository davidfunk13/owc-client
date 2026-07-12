import {
  buildSnapshotDefaults,
  snapshotFormSchema,
  snapshotFormToPayload,
} from "@/lib/snapshotForm";
import type { Game, SnapshotFormValues } from "@/types/game";

const baseGame: Game = {
  id: 7,
  play_session_id: null,
  map_id: 3,
  queue_type: "competitive_role_queue",
  result: "win",
  status: "complete",
  role_played: "tank",
  played_at: "2026-07-01T00:00:00Z",
  duration_seconds: null,
  is_placement: false,
  data_source: "manual",
  notes: null,
  created_at: "2026-07-01T00:00:00Z",
  updated_at: "2026-07-01T00:00:00Z",
  heroes: [
    { hero_id: 10, name: "Reinhardt", is_primary: true, playtime_seconds: null },
    { hero_id: 11, name: "Ana", is_primary: false, playtime_seconds: null },
  ],
};

describe("buildSnapshotDefaults", () => {
  it("defaults role to the played role and gives each hero an empty SR row", () => {
    const values = buildSnapshotDefaults(baseGame);

    expect(values.role).toBe("tank");
    expect(values.tier).toBeNull();
    expect(values.hero_srs).toEqual([
      { hero_id: 10, hero_name: "Reinhardt", sr_value: null },
      { hero_id: 11, hero_name: "Ana", sr_value: null },
    ]);
  });

  it("prefills from existing rank and hero SR snapshots", () => {
    const values = buildSnapshotDefaults({
      ...baseGame,
      rank_snapshots: [
        {
          id: 1,
          role: "support",
          tier: "gold",
          division: 3,
          rank_value: 315,
          progress_percent: 40,
        },
      ],
      hero_srs: [{ id: 5, hero_id: 11, name: "Ana", sr_value: 3200 }],
    });

    expect(values.role).toBe("support");
    expect(values.tier).toBe("gold");
    expect(values.division).toBe(3);
    expect(values.progress_percent).toBe(40);
    expect(values.hero_srs).toContainEqual({ hero_id: 11, hero_name: "Ana", sr_value: 3200 });
    expect(values.hero_srs).toContainEqual({ hero_id: 10, hero_name: "Reinhardt", sr_value: null });
  });
});

describe("snapshotFormToPayload", () => {
  const base: SnapshotFormValues = {
    role: "tank",
    tier: null,
    division: null,
    progress_percent: null,
    hero_srs: [],
  };

  it("omits the rank when no tier is set", () => {
    expect(snapshotFormToPayload(base).ranks).toEqual([]);
  });

  it("builds a rank when tier and role are set", () => {
    const payload = snapshotFormToPayload({
      ...base,
      tier: "diamond",
      division: 2,
      progress_percent: 10,
    });

    expect(payload.ranks).toEqual([
      { role: "tank", tier: "diamond", division: 2, progress_percent: 10 },
    ]);
  });

  it("drops hero SR entries with no value", () => {
    const payload = snapshotFormToPayload({
      ...base,
      hero_srs: [
        { hero_id: 10, hero_name: "Reinhardt", sr_value: 3000 },
        { hero_id: 11, hero_name: "Ana", sr_value: null },
      ],
    });

    expect(payload.hero_srs).toEqual([{ hero_id: 10, sr_value: 3000 }]);
  });
});

describe("snapshotFormSchema", () => {
  const base: SnapshotFormValues = {
    role: null,
    tier: null,
    division: null,
    progress_percent: null,
    hero_srs: [],
  };

  it("rejects a tier without a role", () => {
    expect(snapshotFormSchema.safeParse({ ...base, tier: "gold" }).success).toBe(false);
  });

  it("accepts a tier with a role", () => {
    expect(snapshotFormSchema.safeParse({ ...base, tier: "gold", role: "tank" }).success).toBe(
      true
    );
  });

  it("accepts no rank at all", () => {
    expect(snapshotFormSchema.safeParse(base).success).toBe(true);
  });
});

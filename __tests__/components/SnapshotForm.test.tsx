import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("@/lib/api", () => ({ api: { syncSnapshots: jest.fn() } }));

import { api } from "@/lib/api";
import { SnapshotForm } from "@/components/SnapshotForm/SnapshotForm";
import { withProviders } from "../test-utils";
import type { Game } from "@/types/game";

const mockSyncSnapshots = api.syncSnapshots as jest.Mock;

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
  heroes: [{ hero_id: 11, name: "Ana", is_primary: true, playtime_seconds: null }],
  rank_snapshots: [
    { id: 1, role: "tank", tier: "gold", division: 3, rank_value: 315, progress_percent: 40 },
  ],
  hero_srs: [{ id: 5, hero_id: 11, name: "Ana", sr_value: 3200 }],
};

describe("SnapshotForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncSnapshots.mockResolvedValue({ id: 7 });
  });

  it("saves the prefilled rank and hero SR", async () => {
    const onDone = jest.fn();
    const { getByLabelText } = render(
      withProviders(<SnapshotForm game={baseGame} onDone={onDone} />)
    );

    fireEvent.press(getByLabelText("Save rank & SR"));

    await waitFor(() => expect(mockSyncSnapshots).toHaveBeenCalledTimes(1));
    expect(mockSyncSnapshots).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        ranks: [expect.objectContaining({ role: "tank", tier: "gold", division: 3 })],
        hero_srs: [{ hero_id: 11, sr_value: 3200 }],
      })
    );
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });

  it("prompts to log heroes when the game has none", () => {
    const { getByText } = render(
      withProviders(<SnapshotForm game={{ ...baseGame, heroes: [] }} onDone={jest.fn()} />)
    );

    expect(getByText("Log heroes on this game to record their SR.")).toBeTruthy();
  });
});

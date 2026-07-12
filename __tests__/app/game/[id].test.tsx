import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  api: {
    getGame: jest.fn(),
    deleteGame: jest.fn(),
    getHeroes: jest.fn(),
    getMaps: jest.fn(),
    updateGame: jest.fn(),
    createRound: jest.fn(),
    updateRound: jest.fn(),
    deleteRound: jest.fn(),
    syncSnapshots: jest.fn(),
  },
}));

import { api } from "@/lib/api";
import GameDetailScreen from "@/app/game/[id]";
import { withProviders } from "../../test-utils";
import type { Game } from "@/types/game";

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockRouter = router as jest.Mocked<typeof router>;
const mockGetGame = api.getGame as jest.Mock;
const mockDeleteGame = api.deleteGame as jest.Mock;
const mockGetHeroes = api.getHeroes as jest.Mock;

const game: Game = {
  id: 7,
  play_session_id: null,
  map_id: 3,
  queue_type: "quick_play",
  result: "win",
  status: "complete",
  role_played: "support",
  played_at: "2026-07-01T00:00:00Z",
  duration_seconds: null,
  is_placement: false,
  data_source: "manual",
  notes: "close game",
  created_at: "2026-07-01T00:00:00Z",
  updated_at: "2026-07-01T00:00:00Z",
  heroes: [{ hero_id: 11, name: "Ana", is_primary: true, playtime_seconds: null }],
  map: { id: 3, name: "Ilios", slug: "ilios", map_type: "control", image_url: null, submaps: [] },
  rounds: [
    {
      id: 100,
      game_id: 7,
      round_number: 1,
      map_submap_id: null,
      result: "win",
      side: null,
      score_team: null,
      score_enemy: null,
      distance_meters: null,
      checkpoints_reached: null,
      is_overtime: false,
      submap: null,
      heroes: [{ hero_id: 12, name: "Lucio" }],
      created_at: "2026-07-01T00:00:00Z",
      updated_at: "2026-07-01T00:00:00Z",
    },
  ],
  rank_snapshots: [
    { id: 1, role: "support", tier: "diamond", division: 2, rank_value: 615, progress_percent: 55 },
  ],
  hero_srs: [{ id: 5, hero_id: 11, name: "Ana", sr_value: 3450 }],
};

describe("GameDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ id: "7" });
    mockGetGame.mockResolvedValue(game);
    mockDeleteGame.mockResolvedValue({ message: "Deleted" });
    mockGetHeroes.mockResolvedValue([]);
  });

  it("shows the game details once loaded", async () => {
    const { getByText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(getByText("Ilios")).toBeTruthy());
    expect(getByText("Quick Play")).toBeTruthy();
    expect(getByText("Support")).toBeTruthy();
    expect(getByText(/★ Ana/)).toBeTruthy();
    expect(getByText("close game")).toBeTruthy();
  });

  it("goes back when the back button is pressed", async () => {
    const { getByLabelText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(mockGetGame).toHaveBeenCalled());
    fireEvent.press(getByLabelText("Go back"));

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("deletes the game after confirmation and navigates back", async () => {
    const { getByText, getByLabelText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(getByText("Ilios")).toBeTruthy());

    fireEvent.press(getByLabelText("Delete game"));
    fireEvent.press(getByLabelText("Confirm delete"));

    await waitFor(() => expect(mockDeleteGame).toHaveBeenCalledWith(7));
    await waitFor(() => expect(mockRouter.back).toHaveBeenCalled());
  });

  it("surfaces an error state when the game fails to load", async () => {
    mockGetGame.mockRejectedValue(new Error("boom"));

    const { getByText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(getByText("Couldn't load game")).toBeTruthy());
  });

  it("lists the game's rounds and opens the add-round sheet", async () => {
    const { getByText, getByLabelText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(getByText("Round 1")).toBeTruthy());

    fireEvent.press(getByLabelText("＋ Add round"));

    expect(getByLabelText("Pick a point")).toBeTruthy();
  });

  it("shows the rank & SR summary and opens the edit sheet", async () => {
    const { getByText, getByLabelText } = render(withProviders(<GameDetailScreen />));

    await waitFor(() => expect(getByText("Support · Diamond 2 · 55%")).toBeTruthy());
    expect(getByText("Ana · 3450 SR")).toBeTruthy();

    fireEvent.press(getByLabelText("Edit rank & SR"));

    expect(getByLabelText("Save rank & SR")).toBeTruthy();
  });
});

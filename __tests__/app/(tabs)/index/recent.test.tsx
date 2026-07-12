import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/lib/api", () => ({
  api: { getGames: jest.fn(), getHeroes: jest.fn(), getMaps: jest.fn() },
}));

import { api } from "@/lib/api";
import HomeRecent from "@/app/(tabs)/index/recent";
import { withProviders } from "../../../test-utils";
import type { Game } from "@/types/game";
import type { Paginated } from "@/types/pagination";

const mockGetGames = api.getGames as jest.Mock;
const mockGetHeroes = api.getHeroes as jest.Mock;
const mockGetMaps = api.getMaps as jest.Mock;
const mockRouter = router as jest.Mocked<typeof router>;

const game: Game = {
  id: 1,
  play_session_id: null,
  map_id: 2,
  queue_type: "competitive_role_queue",
  result: "win",
  status: "complete",
  role_played: "tank",
  played_at: "2026-07-11T12:00:00Z",
  duration_seconds: null,
  is_placement: false,
  data_source: "manual",
  notes: null,
  created_at: "2026-07-11T12:00:00Z",
  updated_at: "2026-07-11T12:00:00Z",
  heroes: [{ hero_id: 10, name: "Reinhardt", is_primary: true, playtime_seconds: null }],
  map: { id: 2, name: "King's Row", slug: "kings-row", map_type: "hybrid", image_url: null },
};

const page: Paginated<Game> = {
  data: [game],
  meta: { current_page: 1, last_page: 1, per_page: 20, total: 1 },
};

describe("HomeRecent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGames.mockResolvedValue(page);
    mockGetHeroes.mockResolvedValue([]);
    mockGetMaps.mockResolvedValue([]);
  });

  it("renders games and opens a game on tap", async () => {
    const { getByLabelText } = render(withProviders(<HomeRecent />));

    const row = await waitFor(() => getByLabelText(/Game on King's Row/));
    fireEvent.press(row);

    expect(mockRouter.push).toHaveBeenCalledWith({ pathname: "/game/[id]", params: { id: 1 } });
  });

  it("reveals the advanced filters when toggled", async () => {
    const { getByLabelText, queryByLabelText } = render(withProviders(<HomeRecent />));

    await waitFor(() => expect(mockGetGames).toHaveBeenCalled());
    expect(queryByLabelText("Any queue")).toBeNull();

    fireEvent.press(getByLabelText("Show more filters"));

    expect(getByLabelText("Any queue")).toBeTruthy();
    expect(getByLabelText("Any map")).toBeTruthy();
    expect(getByLabelText("Any hero")).toBeTruthy();
  });

  it("shows an error state when games fail to load", async () => {
    mockGetGames.mockRejectedValue(new Error("boom"));

    const { getByText } = render(withProviders(<HomeRecent />));

    await waitFor(() => expect(getByText("Couldn't load games")).toBeTruthy());
  });

  it("shows the empty state when there are no games", async () => {
    mockGetGames.mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    });

    const { getByText } = render(withProviders(<HomeRecent />));

    await waitFor(() => expect(getByText("No games yet")).toBeTruthy());
  });
});

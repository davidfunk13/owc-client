import { render } from "@testing-library/react-native";
import { GameRow } from "@/components/GameRow/GameRow";
import { withTheme } from "../test-utils";
import type { Game } from "@/types/game";

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

describe("GameRow", () => {
  it("shows the result, map, and heroes", () => {
    const { getByText } = render(withTheme(<GameRow game={game} />));

    expect(getByText("Win")).toBeTruthy();
    expect(getByText("King's Row")).toBeTruthy();
    expect(getByText(/Reinhardt/)).toBeTruthy();
  });

  it("falls back for an in-progress game with no map", () => {
    const inProgress: Game = { ...game, result: null, map: null, heroes: [] };
    const { getByText } = render(withTheme(<GameRow game={inProgress} />));

    expect(getByText("In progress")).toBeTruthy();
    expect(getByText("No map")).toBeTruthy();
  });
});

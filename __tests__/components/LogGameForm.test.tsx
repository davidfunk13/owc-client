import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("@/lib/api", () => ({
  api: { getHeroes: jest.fn(), getMaps: jest.fn(), createGame: jest.fn(), updateGame: jest.fn() },
}));

import { api } from "@/lib/api";
import { LogGameForm } from "@/components/LogGameForm/LogGameForm";
import { withProviders } from "../test-utils";
import type { Game, Hero } from "@/types/game";

const mockGetHeroes = api.getHeroes as jest.Mock;
const mockGetMaps = api.getMaps as jest.Mock;
const mockCreateGame = api.createGame as jest.Mock;
const mockUpdateGame = api.updateGame as jest.Mock;

const heroes: Hero[] = [
  { id: 10, name: "Reinhardt", slug: "reinhardt", role: "tank", sub_role: "main", image_url: null },
  { id: 11, name: "Ana", slug: "ana", role: "support", sub_role: "main", image_url: null },
];

const existingGame: Game = {
  id: 7,
  play_session_id: null,
  map_id: 3,
  queue_type: "quick_play",
  result: "loss",
  status: "complete",
  role_played: "support",
  played_at: "2026-07-01T00:00:00Z",
  duration_seconds: null,
  is_placement: false,
  data_source: "manual",
  notes: "old note",
  created_at: "2026-07-01T00:00:00Z",
  updated_at: "2026-07-01T00:00:00Z",
  heroes: [{ hero_id: 11, name: "Ana", is_primary: true, playtime_seconds: null }],
  map: { id: 3, name: "Ilios", slug: "ilios", map_type: "control", image_url: null },
};

describe("LogGameForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHeroes.mockResolvedValue(heroes);
    mockGetMaps.mockResolvedValue([]);
    mockCreateGame.mockResolvedValue({ id: 1 });
    mockUpdateGame.mockResolvedValue(existingGame);
  });

  it("submits a completed backbone game and calls onDone", async () => {
    const onDone = jest.fn();
    const { getByLabelText } = render(withProviders(<LogGameForm onDone={onDone} />));

    fireEvent.press(getByLabelText("Win"));
    fireEvent.press(getByLabelText("Tank"));

    const reinhardt = await waitFor(() => getByLabelText("Reinhardt"));
    fireEvent.press(reinhardt);

    fireEvent.press(getByLabelText("Save game"));

    await waitFor(() => expect(mockCreateGame).toHaveBeenCalledTimes(1));
    expect(mockCreateGame).toHaveBeenCalledWith({
      queue_type: "competitive_role_queue",
      status: "complete",
      result: "win",
      role_played: "tank",
      map_id: null,
      heroes: [10],
      notes: null,
    });
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });

  it("saves an in-progress game with no result", async () => {
    const { getByLabelText } = render(withProviders(<LogGameForm />));

    fireEvent.press(getByLabelText("Save as in-progress"));

    await waitFor(() => expect(mockCreateGame).toHaveBeenCalledTimes(1));
    expect(mockCreateGame).toHaveBeenCalledWith(
      expect.objectContaining({ status: "in_progress", result: null })
    );
  });

  it("prefills an existing game and submits an update", async () => {
    const onDone = jest.fn();
    const { getByLabelText } = render(
      withProviders(<LogGameForm game={existingGame} onDone={onDone} />)
    );

    fireEvent.press(getByLabelText("Update game"));

    await waitFor(() => expect(mockUpdateGame).toHaveBeenCalledTimes(1));
    expect(mockUpdateGame).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        queue_type: "quick_play",
        result: "loss",
        role_played: "support",
        map_id: 3,
        heroes: [11],
        notes: "old note",
      })
    );
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });
});

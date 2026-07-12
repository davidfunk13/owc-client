import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

jest.mock("@/lib/api", () => ({
  api: { getHeroes: jest.fn(), createRound: jest.fn(), updateRound: jest.fn() },
}));

import { api } from "@/lib/api";
import { RoundForm } from "@/components/RoundForm/RoundForm";
import { withProviders } from "../test-utils";
import type { Game, Hero } from "@/types/game";

const mockGetHeroes = api.getHeroes as jest.Mock;
const mockCreateRound = api.createRound as jest.Mock;

const heroes: Hero[] = [
  { id: 10, name: "Reinhardt", slug: "reinhardt", role: "tank", sub_role: "main", image_url: null },
  { id: 11, name: "Ana", slug: "ana", role: "support", sub_role: "main", image_url: null },
];

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
  heroes: [],
  map: {
    id: 3,
    name: "Ilios",
    slug: "ilios",
    map_type: "control",
    image_url: null,
    submaps: [{ id: 9, map_id: 3, name: "Lighthouse", slug: "lighthouse", image_url: null }],
  },
};

describe("RoundForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHeroes.mockResolvedValue(heroes);
    mockCreateRound.mockResolvedValue({ id: 1 });
  });

  it("shows the point picker for a control map and creates a round", async () => {
    const onDone = jest.fn();
    const { getByLabelText } = render(withProviders(<RoundForm game={baseGame} onDone={onDone} />));

    expect(getByLabelText("Pick a point")).toBeTruthy();

    fireEvent.press(getByLabelText("Win"));
    fireEvent.press(getByLabelText("Add round"));

    await waitFor(() => expect(mockCreateRound).toHaveBeenCalledTimes(1));
    expect(mockCreateRound).toHaveBeenCalledWith(7, expect.objectContaining({ result: "win" }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });

  it("shows the attack/defense control for an escort map instead of a point", () => {
    const escortGame: Game = {
      ...baseGame,
      map: {
        id: 4,
        name: "Route 66",
        slug: "route-66",
        map_type: "escort",
        image_url: null,
        submaps: [],
      },
    };

    const { getByLabelText, queryByLabelText } = render(
      withProviders(<RoundForm game={escortGame} onDone={jest.fn()} />)
    );

    expect(getByLabelText("Attack")).toBeTruthy();
    expect(getByLabelText("Defense")).toBeTruthy();
    expect(queryByLabelText("Pick a point")).toBeNull();
  });
});

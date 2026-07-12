import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

import { RoundCard } from "@/components/RoundCard/RoundCard";
import { withTheme } from "../test-utils";
import type { GameRound } from "@/types/game";

const round: GameRound = {
  id: 1,
  game_id: 1,
  round_number: 2,
  map_submap_id: 9,
  result: "win",
  side: null,
  score_team: null,
  score_enemy: null,
  distance_meters: null,
  checkpoints_reached: null,
  is_overtime: false,
  submap: { id: 9, map_id: 3, name: "Lighthouse", slug: "lighthouse", image_url: null },
  heroes: [{ hero_id: 10, name: "Reinhardt" }],
  created_at: "2026-07-01T00:00:00Z",
  updated_at: "2026-07-01T00:00:00Z",
};

describe("RoundCard", () => {
  it("shows the round number, result, submap, and heroes", () => {
    const { getByText } = render(withTheme(<RoundCard round={round} />));

    expect(getByText("Round 2")).toBeTruthy();
    expect(getByText("Win")).toBeTruthy();
    expect(getByText(/Lighthouse/)).toBeTruthy();
    expect(getByText(/Reinhardt/)).toBeTruthy();
  });

  it("fires the edit and delete callbacks", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText } = render(
      withTheme(<RoundCard onDelete={onDelete} onEdit={onEdit} round={round} />)
    );

    fireEvent.press(getByLabelText("Edit round 2"));
    fireEvent.press(getByLabelText("Delete round 2"));

    expect(onEdit).toHaveBeenCalledWith(round);
    expect(onDelete).toHaveBeenCalledWith(round);
  });
});

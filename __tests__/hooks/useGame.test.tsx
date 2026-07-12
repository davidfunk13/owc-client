import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api", () => ({ api: { getGame: jest.fn() } }));

import { api } from "@/lib/api";
import { useGame } from "@/hooks/useGame";
import { createTestQueryClient } from "../test-utils";
import type { Game } from "@/types/game";

const mockGetGame = api.getGame as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const game: Game = {
  id: 7,
  play_session_id: null,
  map_id: null,
  queue_type: "quick_play",
  result: "win",
  status: "complete",
  role_played: "damage",
  played_at: "2026-07-01T00:00:00Z",
  duration_seconds: null,
  is_placement: false,
  data_source: "manual",
  notes: null,
  created_at: "2026-07-01T00:00:00Z",
  updated_at: "2026-07-01T00:00:00Z",
  heroes: [],
  map: null,
};

describe("useGame", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches the game by id", async () => {
    mockGetGame.mockResolvedValue(game);

    const { result } = renderHook(() => useGame(7), { wrapper: buildWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(game);
    expect(mockGetGame).toHaveBeenCalledWith(7);
  });

  it("stays idle for an invalid id", () => {
    const { result } = renderHook(() => useGame(Number.NaN), { wrapper: buildWrapper() });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockGetGame).not.toHaveBeenCalled();
  });
});

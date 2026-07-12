import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api", () => ({ api: { getGames: jest.fn() } }));

import { api } from "@/lib/api";
import { useGames } from "@/hooks/useGames";
import { createTestQueryClient } from "../test-utils";
import type { Game } from "@/types/game";
import type { Paginated } from "@/types/pagination";

const mockGetGames = api.getGames as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const game: Game = {
  id: 1,
  play_session_id: null,
  map_id: null,
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
  heroes: [],
  map: null,
};

describe("useGames", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the flattened games and forwards filters + page to the api", async () => {
    const page: Paginated<Game> = {
      data: [game],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 1 },
    };
    mockGetGames.mockResolvedValue(page);
    const filters = { result: "win" } as const;

    const { result } = renderHook(() => useGames(filters), { wrapper: buildWrapper() });

    await waitFor(() => expect(result.current.items).toEqual([game]));
    expect(result.current.hasNextPage).toBe(false);
    expect(mockGetGames).toHaveBeenCalledWith(filters, 1);
  });
});

import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api", () => ({ api: { getMaps: jest.fn() } }));

import { api } from "@/lib/api";
import { useMaps } from "@/hooks/useMaps";
import { createTestQueryClient } from "../test-utils";
import type { GameMap } from "@/types/game";

const mockGetMaps = api.getMaps as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const maps: GameMap[] = [
  { id: 1, name: "King's Row", slug: "kings-row", map_type: "hybrid", image_url: null },
];

describe("useMaps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns maps on success", async () => {
    mockGetMaps.mockResolvedValue(maps);

    const { result } = renderHook(() => useMaps(), { wrapper: buildWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(maps);
  });
});

import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/lib/api", () => ({ api: { getHeroes: jest.fn() } }));

import { api } from "@/lib/api";
import { useHeroes } from "@/hooks/useHeroes";
import { ApiError } from "@/types/errors";
import { createTestQueryClient } from "../test-utils";
import type { Hero } from "@/types/game";

const mockGetHeroes = api.getHeroes as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const heroes: Hero[] = [
  { id: 1, name: "Ana", slug: "ana", role: "support", sub_role: "main", image_url: null },
];

describe("useHeroes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns heroes on success", async () => {
    mockGetHeroes.mockResolvedValue(heroes);

    const { result } = renderHook(() => useHeroes(), { wrapper: buildWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(heroes);
  });

  it("surfaces an error", async () => {
    mockGetHeroes.mockRejectedValue(new ApiError(500, "Server Error", "boom"));

    const { result } = renderHook(() => useHeroes(), { wrapper: buildWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

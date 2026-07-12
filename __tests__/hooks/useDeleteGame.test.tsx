import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/lib/api", () => ({ api: { deleteGame: jest.fn() } }));

import { api } from "@/lib/api";
import { useDeleteGame } from "@/hooks/useDeleteGame";
import { createTestQueryClient, TestProviders } from "../test-utils";

const mockDeleteGame = api.deleteGame as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <TestProviders queryClient={client}>{children}</TestProviders>;
};

describe("useDeleteGame", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes the game by id", async () => {
    mockDeleteGame.mockResolvedValue({ message: "Deleted" });

    const { result } = renderHook(() => useDeleteGame(), { wrapper: buildWrapper() });

    result.current.mutate(7);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteGame).toHaveBeenCalledWith(7);
  });
});

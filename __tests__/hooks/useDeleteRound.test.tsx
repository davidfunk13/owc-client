import type { FC, ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/lib/api", () => ({ api: { deleteRound: jest.fn() } }));

import { api } from "@/lib/api";
import { useDeleteRound } from "@/hooks/useDeleteRound";
import { createTestQueryClient, TestProviders } from "../test-utils";

const mockDeleteRound = api.deleteRound as jest.Mock;

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <TestProviders queryClient={client}>{children}</TestProviders>;
};

describe("useDeleteRound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a round by id", async () => {
    mockDeleteRound.mockResolvedValue({ message: "Removed" });

    const { result } = renderHook(() => useDeleteRound(), { wrapper: buildWrapper() });

    result.current.mutate(3);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteRound).toHaveBeenCalledWith(3);
  });
});

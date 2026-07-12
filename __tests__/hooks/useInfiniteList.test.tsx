import type { FC, ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { createTestQueryClient } from "../test-utils";
import type { Paginated } from "@/types/pagination";

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const page1: Paginated<number> = {
  data: [1, 2],
  meta: { current_page: 1, last_page: 2, per_page: 2, total: 4 },
};
const page2: Paginated<number> = {
  data: [3, 4],
  meta: { current_page: 2, last_page: 2, per_page: 2, total: 4 },
};

describe("useInfiniteList", () => {
  it("flattens pages and loads the next page on demand", async () => {
    const fetchPage = jest.fn((page: number) => Promise.resolve(page === 1 ? page1 : page2));

    const { result } = renderHook(() => useInfiniteList<number>(["nums"], fetchPage), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.items).toEqual([1, 2]));
    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.items).toEqual([1, 2, 3, 4]));
    expect(result.current.hasNextPage).toBe(false);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("does not fetch again when there is no next page", async () => {
    const single: Paginated<number> = {
      data: [1],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 1 },
    };
    const fetchPage = jest.fn(() => Promise.resolve(single));

    const { result } = renderHook(() => useInfiniteList<number>(["one"], fetchPage), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.items).toEqual([1]));
    expect(result.current.hasNextPage).toBe(false);

    act(() => {
      result.current.fetchNextPage();
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("surfaces the error state when a page fails", async () => {
    const fetchPage = jest.fn(() => Promise.reject(new Error("boom")));

    const { result } = renderHook(() => useInfiniteList<number>(["err"], fetchPage), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

import { useCallback } from "react";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ApiError, NetworkError } from "@/types/errors";
import type { InfiniteListResult, Paginated } from "@/types/pagination";

export function useInfiniteList<T>(
  queryKey: QueryKey,
  fetchPage: (page: number) => Promise<Paginated<T>>
): InfiniteListResult<T> {
  const query = useInfiniteQuery<
    Paginated<T>,
    ApiError | NetworkError,
    InfiniteData<Paginated<T>>,
    QueryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });

  const fetchNextPage = useCallback((): void => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }
    query.fetchNextPage().catch(() => undefined);
  }, [query]);

  const refetch = useCallback((): void => {
    query.refetch().catch(() => undefined);
  }, [query]);

  return {
    items: query.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage,
    refetch,
    error: query.isError ? query.error : null,
  };
}

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/hooks/queryKeys";
import type { ApiError, NetworkError } from "@/types/errors";
import type { Hero } from "@/types/game";

const REFERENCE_STALE_TIME = 60 * 60 * 1000;

export function useHeroes(): UseQueryResult<Hero[], ApiError | NetworkError> {
  return useQuery<Hero[], ApiError | NetworkError>({
    queryKey: queryKeys.heroes.all,
    queryFn: () => api.getHeroes(),
    staleTime: REFERENCE_STALE_TIME,
  });
}

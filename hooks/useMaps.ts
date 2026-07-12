import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/hooks/queryKeys";
import type { ApiError, NetworkError } from "@/types/errors";
import type { GameMap } from "@/types/game";

const REFERENCE_STALE_TIME = 60 * 60 * 1000;

export function useMaps(): UseQueryResult<GameMap[], ApiError | NetworkError> {
  return useQuery<GameMap[], ApiError | NetworkError>({
    queryKey: queryKeys.maps.all,
    queryFn: () => api.getMaps(),
    staleTime: REFERENCE_STALE_TIME,
  });
}

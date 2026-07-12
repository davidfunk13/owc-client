import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/hooks/queryKeys";
import type { ApiError, NetworkError } from "@/types/errors";
import type { Game } from "@/types/game";

export function useGame(id: number): UseQueryResult<Game, ApiError | NetworkError> {
  return useQuery<Game, ApiError | NetworkError>({
    queryKey: queryKeys.games.detail(id),
    queryFn: () => api.getGame(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

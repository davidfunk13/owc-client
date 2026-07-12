import { api } from "@/lib/api";
import { queryKeys } from "@/hooks/queryKeys";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import type { Game, GameFilters } from "@/types/game";
import type { InfiniteListResult } from "@/types/pagination";

export function useGames(filters?: GameFilters): InfiniteListResult<Game> {
  return useInfiniteList<Game>(queryKeys.games.list(filters), (page) =>
    api.getGames(filters, page)
  );
}

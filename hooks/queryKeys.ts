import type { GameFilters } from "@/types/game";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
  heroes: {
    all: ["heroes"] as const,
  },
  maps: {
    all: ["maps"] as const,
  },
  games: {
    all: ["games"] as const,
    list: (filters?: GameFilters) => [...queryKeys.games.all, "list", filters ?? {}] as const,
    detail: (id: number) => [...queryKeys.games.all, "detail", id] as const,
  },
} as const;

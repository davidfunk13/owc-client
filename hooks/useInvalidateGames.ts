import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";

export function useInvalidateGames(): () => void {
  const queryClient = useQueryClient();

  return useCallback((): void => {
    queryClient.invalidateQueries({ queryKey: queryKeys.games.all }).catch((error) => {
      console.error("Failed to refresh games:", error);
    });
  }, [queryClient]);
}

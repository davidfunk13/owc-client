import { api } from "@/lib/api";
import { useInvalidateGames } from "@/hooks/useInvalidateGames";
import { useMutationWithFeedback } from "@/hooks/useMutationWithFeedback";
import type { UseMutationWithFeedbackResult } from "@/types/mutations";

export function useDeleteRound(): UseMutationWithFeedbackResult<{ message: string }, number, void> {
  const invalidateGames = useInvalidateGames();

  return useMutationWithFeedback<{ message: string }, number>({
    mutationFn: (id) => api.deleteRound(id),
    successMessage: "Round removed",
    onSuccess: invalidateGames,
  });
}

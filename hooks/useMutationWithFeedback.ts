import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/contexts/ToastContext";
import { defaultErrorMessage } from "@/lib/errors";
import type {
  MutationFeedbackError,
  UseMutationWithFeedbackOptions,
  UseMutationWithFeedbackResult,
} from "@/types/mutations";

export function useMutationWithFeedback<TData, TVariables = void, TContext = void>(
  options: UseMutationWithFeedbackOptions<TData, TVariables, TContext>
): UseMutationWithFeedbackResult<TData, TVariables, TContext> {
  const { show } = useToast();
  const {
    mutationFn,
    successMessage,
    errorMessage,
    silent = false,
    onSuccess,
    onError,
    ...rest
  } = options;

  return useMutation<TData, MutationFeedbackError, TVariables, TContext>({
    ...rest,
    mutationFn,
    onSuccess: (data, variables, onMutateResult) => {
      if (!silent && successMessage) {
        show({ message: successMessage, variant: "success" });
      }
      onSuccess?.(data, variables, onMutateResult);
    },
    onError: (error, variables, onMutateResult) => {
      if (!silent) {
        const message =
          typeof errorMessage === "function"
            ? errorMessage(error)
            : (errorMessage ?? defaultErrorMessage(error));
        show({ message, variant: "error" });
      }
      onError?.(error, variables, onMutateResult);
    },
  });
}

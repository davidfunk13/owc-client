import { useCallback, useMemo } from "react";
import { type FieldValues, type SubmitHandler, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationWithFeedback } from "@/hooks/useMutationWithFeedback";
import type { UseFormWithFeedbackOptions, UseFormWithFeedbackResult } from "@/types/mutations";

export function useFormWithFeedback<TFields extends FieldValues, TData>(
  options: UseFormWithFeedbackOptions<TFields, TData>
): UseFormWithFeedbackResult<TFields, TData> {
  const {
    schema,
    mutationFn,
    successMessage,
    errorMessage,
    silent,
    onSuccess,
    onError,
    ...formOptions
  } = options;

  const form = useForm<TFields>({
    ...formOptions,
    resolver: zodResolver(schema as never),
  }) as UseFormReturn<TFields>;

  const mutation = useMutationWithFeedback<TData, TFields>({
    mutationFn,
    successMessage,
    errorMessage,
    silent,
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      onError?.(err, variables);
    },
  });

  const handleValid = useCallback<SubmitHandler<TFields>>(
    async (values) => {
      await mutation.mutateAsync(values);
    },
    [mutation]
  );

  const submit = useCallback(async (): Promise<void> => {
    try {
      await form.handleSubmit(handleValid)();
    } catch {
      // Mutation errors flow through `isError` + `error` on the returned result;
      // submit() never rejects so consumers don't need to wrap it in try/catch.
    }
  }, [form, handleValid]);

  return useMemo<UseFormWithFeedbackResult<TFields, TData>>(
    () => ({
      ...form,
      submit,
      isSubmitting: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      error: mutation.isError ? mutation.error : null,
      data: mutation.data,
    }),
    [
      form,
      submit,
      mutation.isPending,
      mutation.isSuccess,
      mutation.isError,
      mutation.error,
      mutation.data,
    ]
  );
}

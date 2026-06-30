import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import type { ApiError, NetworkError } from "@/types/errors";

export type MutationFeedbackError = ApiError | NetworkError | Error;

export interface UseMutationWithFeedbackOptions<TData, TVariables, TContext> extends Omit<
  UseMutationOptions<TData, MutationFeedbackError, TVariables, TContext>,
  "mutationFn" | "onSuccess" | "onError"
> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string | ((error: MutationFeedbackError) => string);
  silent?: boolean;
  onSuccess?: (data: TData, variables: TVariables, onMutateResult: TContext) => void;
  onError?: (
    error: MutationFeedbackError,
    variables: TVariables,
    onMutateResult: TContext | undefined
  ) => void;
}

export type UseMutationWithFeedbackResult<TData, TVariables, TContext> = UseMutationResult<
  TData,
  MutationFeedbackError,
  TVariables,
  TContext
>;

export interface UseFormWithFeedbackOptions<TFields extends FieldValues, TData> extends Omit<
  UseFormProps<TFields>,
  "resolver"
> {
  schema: ZodType<TFields>;
  mutationFn: (values: TFields) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string | ((error: MutationFeedbackError) => string);
  silent?: boolean;
  onSuccess?: (data: TData, values: TFields) => void;
  onError?: (error: MutationFeedbackError, values: TFields) => void;
}

export interface UseFormWithFeedbackResult<
  TFields extends FieldValues,
  TData,
> extends UseFormReturn<TFields> {
  submit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: MutationFeedbackError | null;
  data: TData | undefined;
}

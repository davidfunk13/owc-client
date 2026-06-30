import { ApiError, NetworkError } from "@/types/errors";
import type { MutationFeedbackError } from "@/types/mutations";

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isNetworkError = (error: unknown): error is NetworkError =>
  error instanceof NetworkError;

export const defaultErrorMessage = (error: MutationFeedbackError): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (isNetworkError(error)) {
    return error.message;
  }
  return "Something went wrong";
};

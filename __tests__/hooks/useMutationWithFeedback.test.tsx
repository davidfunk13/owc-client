import type { FC, ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { useMutationWithFeedback } from "@/hooks/useMutationWithFeedback";
import { ApiError, NetworkError } from "@/types/errors";
import { createTestQueryClient } from "../test-utils";

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <ToastProvider defaultDurationMs={0}>{children}</ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("useMutationWithFeedback", () => {
  it("shows the success toast on success", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<string, void>({
          mutationFn: () => Promise.resolve("ok"),
          successMessage: "Saved!",
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      await result.current.mutation.mutateAsync();
    });

    await waitFor(() => {
      expect(result.current.toast.toasts).toHaveLength(1);
    });
    expect(result.current.toast.toasts[0]).toMatchObject({
      message: "Saved!",
      variant: "success",
    });
  });

  it("shows the default error message when none is provided", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<void, void>({
          mutationFn: () => Promise.reject(new ApiError(500, "Server Error", "boom")),
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.mutation.mutateAsync();
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.toast.toasts).toHaveLength(1);
    });
    expect(result.current.toast.toasts[0]).toMatchObject({
      message: "boom",
      variant: "error",
    });
  });

  it("shows a static custom error message when provided", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<void, void>({
          mutationFn: () => Promise.reject(new NetworkError("offline")),
          errorMessage: "Could not reach the server",
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.mutation.mutateAsync();
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.toast.toasts[0]?.message).toBe("Could not reach the server");
    });
  });

  it("supports a function errorMessage that receives the error", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<void, void>({
          mutationFn: () => Promise.reject(new ApiError(403, "Forbidden", "nope")),
          errorMessage: (err) => `[${err.name}] ${err.message}`,
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.mutation.mutateAsync();
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.toast.toasts[0]?.message).toBe("[ApiError] nope");
    });
  });

  it("does not toast when silent is true", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<string, void>({
          mutationFn: () => Promise.resolve("ok"),
          successMessage: "Saved!",
          silent: true,
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      await result.current.mutation.mutateAsync();
    });

    expect(result.current.toast.toasts).toHaveLength(0);
  });

  it("falls back to a generic message for unknown error shapes", async () => {
    const wrapper = buildWrapper();

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const mutation = useMutationWithFeedback<void, void>({
          mutationFn: () => Promise.reject(new Error("anything")),
        });
        return { toast, mutation };
      },
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.mutation.mutateAsync();
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.toast.toasts[0]?.message).toBe("Something went wrong");
    });
  });

  it("forwards onSuccess and onError callbacks from the caller", async () => {
    const wrapper = buildWrapper();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(
      () =>
        useMutationWithFeedback<string, number>({
          mutationFn: (n) =>
            n > 0 ? Promise.resolve(`got ${n}`) : Promise.reject(new Error("bad")),
          successMessage: "Yay",
          silent: true,
          onSuccess,
          onError,
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync(5);
    });
    expect(onSuccess).toHaveBeenCalledWith("got 5", 5, undefined);

    await act(async () => {
      try {
        await result.current.mutateAsync(-1);
      } catch {
        // expected
      }
    });
    expect(onError).toHaveBeenCalled();
  });
});

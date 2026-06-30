import type { FC, ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { z } from "zod";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { useFormWithFeedback } from "@/hooks/useFormWithFeedback";
import { ApiError } from "@/types/errors";
import { createTestQueryClient } from "../test-utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

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

describe("useFormWithFeedback", () => {
  it("submits valid values and surfaces a success toast", async () => {
    const wrapper = buildWrapper();
    const mutationFn = jest.fn().mockResolvedValue({ id: 1 });

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const form = useFormWithFeedback({
          schema,
          mutationFn,
          successMessage: "Signed up!",
          defaultValues: { email: "user@example.com", password: "longenough" },
        });
        return { toast, form };
      },
      { wrapper }
    );

    await act(async () => {
      await result.current.form.submit();
    });

    expect(mutationFn).toHaveBeenCalled();
    expect(mutationFn.mock.calls[0]?.[0]).toEqual({
      email: "user@example.com",
      password: "longenough",
    });
    await waitFor(() => {
      expect(result.current.toast.toasts[0]).toMatchObject({
        message: "Signed up!",
        variant: "success",
      });
    });
    expect(result.current.form.isSuccess).toBe(true);
    expect(result.current.form.data).toEqual({ id: 1 });
  });

  it("blocks submission when the zod schema rejects the form values", async () => {
    const wrapper = buildWrapper();
    const mutationFn = jest.fn();

    const { result } = renderHook(
      () =>
        useFormWithFeedback({
          schema,
          mutationFn,
          defaultValues: { email: "not-an-email", password: "short" },
        }),
      { wrapper }
    );

    act(() => {
      result.current.register("email");
      result.current.register("password");
    });

    let triggerResult: boolean | undefined;
    await act(async () => {
      triggerResult = await result.current.trigger();
    });

    expect(triggerResult).toBe(false);

    await act(async () => {
      await result.current.submit();
    });

    expect(mutationFn).not.toHaveBeenCalled();
  });

  it("surfaces an error toast and exposes the error when the mutation rejects", async () => {
    const wrapper = buildWrapper();
    const apiError = new ApiError(500, "Server", "boom");
    const mutationFn = jest.fn().mockRejectedValue(apiError);

    const { result } = renderHook(
      () => {
        const toast = useToast();
        const form = useFormWithFeedback({
          schema,
          mutationFn,
          defaultValues: { email: "user@example.com", password: "longenough" },
        });
        return { toast, form };
      },
      { wrapper }
    );

    await act(async () => {
      await result.current.form.submit();
    });

    await waitFor(() => {
      expect(result.current.toast.toasts[0]?.message).toBe("boom");
    });
    expect(result.current.form.isError).toBe(true);
    expect(result.current.form.error).toBe(apiError);
  });

  it("forwards onSuccess and onError callbacks", async () => {
    const wrapper = buildWrapper();
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const mutationFn = jest
      .fn()
      .mockResolvedValueOnce({ id: 7 })
      .mockRejectedValueOnce(new Error("nope"));

    const { result } = renderHook(
      () =>
        useFormWithFeedback({
          schema,
          mutationFn,
          silent: true,
          onSuccess,
          onError,
          defaultValues: { email: "user@example.com", password: "longenough" },
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.submit();
    });
    expect(onSuccess).toHaveBeenCalledWith(
      { id: 7 },
      {
        email: "user@example.com",
        password: "longenough",
      }
    );

    await act(async () => {
      await result.current.submit();
    });
    expect(onError).toHaveBeenCalled();
  });
});

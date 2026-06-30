import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { act, render, renderHook } from "@testing-library/react-native";
import { Text } from "react-native";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <ToastProvider defaultDurationMs={1000}>{children}</ToastProvider>
  </ThemeProvider>
);

describe("ToastContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("throws when useToast is called outside provider", () => {
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within ToastProvider"
    );
  });

  it("show() adds a toast and returns its id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let id = "";
    act(() => {
      id = result.current.show({ message: "Hi" });
    });

    expect(id).toBeTruthy();
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({ id, message: "Hi", variant: "info" });
  });

  it("dismiss() removes the toast by id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let id = "";
    act(() => {
      id = result.current.show({ message: "Bye" });
    });

    act(() => {
      result.current.dismiss(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("auto-dismisses after the configured duration", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.show({ message: "Auto" });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("respects an explicit per-toast durationMs", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.show({ message: "Custom", durationMs: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("does not auto-dismiss when durationMs is 0", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.show({ message: "Sticky", durationMs: 0 });
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it("dismiss is safe for an id with no active timer", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let id = "";
    act(() => {
      id = result.current.show({ message: "Sticky", durationMs: 0 });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(id);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("renders the toasts inside the provider", () => {
    const Trigger: FC = () => {
      const { show } = useToast();
      useEffect(() => {
        show({ message: "Visible toast", durationMs: 0 });
      }, [show]);
      return null;
    };

    const { getByText } = render(
      <ThemeProvider>
        <ToastProvider>
          <Text>child</Text>
          <Trigger />
        </ToastProvider>
      </ThemeProvider>
    );

    expect(getByText("child")).toBeTruthy();
    expect(getByText("Visible toast")).toBeTruthy();
  });
});

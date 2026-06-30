import type { FC } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Toast } from "@/components/Toast/Toast";
import type {
  ToastContextValue,
  ToastEntry,
  ToastOptions,
  ToastProviderProps,
} from "@/types/toast";

const DEFAULT_DURATION_MS = 4000;

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: FC<ToastProviderProps> = ({
  children,
  defaultDurationMs = DEFAULT_DURATION_MS,
}) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string): void => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions): string => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const entry: ToastEntry = {
        id,
        message: options.message,
        variant: options.variant ?? "info",
        durationMs: options.durationMs ?? defaultDurationMs,
      };

      setToasts((prev) => [...prev, entry]);

      if (entry.durationMs && entry.durationMs > 0) {
        const timer = setTimeout(() => dismiss(id), entry.durationMs);
        timers.current.set(id, timer);
      }

      return id;
    },
    [defaultDurationMs, dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ show, dismiss, toasts }),
    [show, dismiss, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.viewport} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

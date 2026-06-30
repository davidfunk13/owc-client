import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export interface ToastEntry extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  toasts: ToastEntry[];
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultDurationMs?: number;
}

export interface ToastProps {
  toast: ToastEntry;
  onDismiss: (id: string) => void;
}

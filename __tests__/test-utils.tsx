import type { FC, ReactElement, ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";

const ZERO_METRICS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export const TestProviders: FC<TestProvidersProps> = ({ children, queryClient }) => {
  const client = queryClient ?? createTestQueryClient();
  return (
    <SafeAreaProvider initialMetrics={ZERO_METRICS}>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <ToastProvider defaultDurationMs={0}>{children}</ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export const withTheme = (component: ReactNode): ReactElement => (
  <SafeAreaProvider initialMetrics={ZERO_METRICS}>
    <ThemeProvider>{component}</ThemeProvider>
  </SafeAreaProvider>
);

export const withProviders = (component: ReactNode, queryClient?: QueryClient): ReactElement => (
  <TestProviders queryClient={queryClient}>{component}</TestProviders>
);

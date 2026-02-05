import type { FC, ReactNode } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

export const TestProviders: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export const withTheme = (component: ReactNode) => <ThemeProvider>{component}</ThemeProvider>;

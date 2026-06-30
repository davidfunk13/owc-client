import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { darkTheme, lightTheme } from "@/constants/theme";
import type { ThemeContextType } from "@/types/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    storage
      .getTheme()
      .then((stored) => {
        if (stored === null) {
          return;
        }
        setIsDark(stored === "dark");
      })
      .catch((error) => {
        console.error("Failed to load stored theme:", error);
      });
  }, []);

  const toggleTheme = (): void => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    storage.setTheme(newIsDark ? "dark" : "light").catch((error) => {
      console.error("Failed to save theme preference:", error);
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

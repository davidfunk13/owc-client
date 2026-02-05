import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { darkTheme, lightTheme } from "@/constants/theme";
import type { ThemeContextType } from "@/types/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = "theme";

const getStoredTheme = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(THEME_STORAGE_KEY);
  }
  return SecureStore.getItemAsync(THEME_STORAGE_KEY);
};

const setStoredTheme = async (value: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(THEME_STORAGE_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(THEME_STORAGE_KEY, value);
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    getStoredTheme()
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

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setStoredTheme(newIsDark ? "dark" : "light").catch((error) => {
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

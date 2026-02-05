import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { darkTheme, lightTheme } from "../../constants/theme";
import type { ReactNode } from "react";

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe("useTheme", () => {
    it("throws when used outside ThemeProvider", () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow("useTheme must be used within ThemeProvider");
    });

    it("provides theme context when inside ThemeProvider", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBeDefined();
      expect(result.current.isDark).toBeDefined();
      expect(result.current.toggleTheme).toBeInstanceOf(Function);
    });
  });

  describe("ThemeProvider", () => {
    it("defaults to dark theme", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDark).toBe(true);
      expect(result.current.theme).toEqual(darkTheme);
    });

    it("toggles to light theme when toggleTheme is called", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(false);
      expect(result.current.theme).toEqual(lightTheme);
    });

    it("toggles back to dark theme", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(true);
      expect(result.current.theme).toEqual(darkTheme);
    });

    describe("persistence on native", () => {
      beforeEach(() => {
        jest.replaceProperty(Platform, "OS", "ios");
      });

      it("loads stored theme preference on mount", async () => {
        mockSecureStore.getItemAsync.mockResolvedValue("light");

        const { result } = renderHook(() => useTheme(), { wrapper });

        await waitFor(() => {
          expect(result.current.isDark).toBe(false);
        });
      });

      it("saves theme preference when toggled", async () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
          result.current.toggleTheme();
        });

        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith("theme", "light");
      });

      it("handles error when loading stored theme fails", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockSecureStore.getItemAsync.mockRejectedValue(new Error("Storage error"));

        const { result } = renderHook(() => useTheme(), { wrapper });

        await waitFor(() => {
          expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to load stored theme:",
            expect.any(Error)
          );
        });

        expect(result.current.isDark).toBe(true);
        consoleSpy.mockRestore();
      });

      it("handles error when saving theme preference fails", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockSecureStore.setItemAsync.mockRejectedValue(new Error("Storage error"));

        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
          result.current.toggleTheme();
        });

        await waitFor(() => {
          expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to save theme preference:",
            expect.any(Error)
          );
        });

        consoleSpy.mockRestore();
      });
    });

    describe("persistence on web", () => {
      beforeEach(() => {
        jest.replaceProperty(Platform, "OS", "web");
      });

      it("loads stored theme from localStorage", async () => {
        (global.localStorage.getItem as jest.Mock).mockReturnValue("light");

        const { result } = renderHook(() => useTheme(), { wrapper });

        await waitFor(() => {
          expect(result.current.isDark).toBe(false);
        });
      });

      it("saves theme to localStorage when toggled", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
          result.current.toggleTheme();
        });

        expect(global.localStorage.setItem).toHaveBeenCalledWith("theme", "light");
      });
    });
  });
});

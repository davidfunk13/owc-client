import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/lib/storage", () => ({
  storage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
    getTheme: jest.fn(),
    setTheme: jest.fn(),
  },
}));

import { storage } from "@/lib/storage";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { darkTheme, lightTheme } from "../../constants/theme";

const mockedStorage = storage as jest.Mocked<typeof storage>;

const wrapper = ({ children }: { children: ReactNode }): ReactNode => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedStorage.getTheme.mockResolvedValue(null);
    mockedStorage.setTheme.mockResolvedValue(undefined);
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

    it("loads stored theme preference on mount when stored", async () => {
      mockedStorage.getTheme.mockResolvedValue("light");

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isDark).toBe(false);
      });
    });

    it("ignores stored theme when null", async () => {
      mockedStorage.getTheme.mockResolvedValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockedStorage.getTheme).toHaveBeenCalled();
      });
      expect(result.current.isDark).toBe(true);
    });

    it("saves theme preference when toggled", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(mockedStorage.setTheme).toHaveBeenCalledWith("light");
    });

    it("handles error when loading stored theme fails", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockedStorage.getTheme.mockRejectedValue(new Error("Storage error"));

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Failed to load stored theme:", expect.any(Error));
      });

      expect(result.current.isDark).toBe(true);
      consoleSpy.mockRestore();
    });

    it("handles error when saving theme preference fails", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockedStorage.setTheme.mockRejectedValue(new Error("Storage error"));

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
});

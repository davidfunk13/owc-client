import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import type {
  WebBrowserResult,
  WebBrowserResultType as WebBrowserResultTypeEnum,
} from "expo-web-browser";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";

// Get the actual enum since the module is mocked
const { WebBrowserResultType } = jest.requireActual("expo-web-browser") as {
  WebBrowserResultType: typeof WebBrowserResultTypeEnum;
};
import type { ReactNode } from "react";
import type { User } from "../../types/User";

jest.mock("../../lib/auth", () => ({
  getStoredToken: jest.fn(),
  saveToken: jest.fn(),
  clearToken: jest.fn(),
  fetchUser: jest.fn(),
  logout: jest.fn(),
  buildAuthUrl: jest.fn(),
  parseCallbackUrl: jest.fn(),
}));

jest.mock("../../hooks/useAuthDeepLink", () => ({
  useAuthDeepLink: jest.fn(),
}));

import * as authService from "../../lib/auth";
import { useAuthDeepLink } from "../../hooks/useAuthDeepLink";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockUseAuthDeepLink = useAuthDeepLink as jest.Mock;
const mockWebBrowser = WebBrowser as jest.Mocked<typeof WebBrowser>;
const mockRouter = router as jest.Mocked<typeof router>;

const mockUser: User = {
  id: 1,
  sub: "bnet-123",
  battlenet_id: 123456,
  battletag: "TestPlayer#1234",
  avatar: "https://example.com/avatar.jpg",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.getStoredToken.mockResolvedValue(null);
    mockUseAuthDeepLink.mockImplementation(() => {});
  });

  describe("useAuth", () => {
    it("throws when used outside AuthProvider", () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within AuthProvider");
    });

    it("provides auth context when inside AuthProvider", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.login).toBeInstanceOf(Function);
      expect(result.current.logout).toBeInstanceOf(Function);
    });
  });

  describe("AuthProvider", () => {
    describe("initial auth check", () => {
      it("checks for stored token on mount", async () => {
        renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(mockAuthService.getStoredToken).toHaveBeenCalled();
        });
      });

      it("fetches user when token exists", async () => {
        mockAuthService.getStoredToken.mockResolvedValue("existing-token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe("existing-token");
      });

      it("clears invalid token and sets unauthenticated", async () => {
        mockAuthService.getStoredToken.mockResolvedValue("invalid-token");
        mockAuthService.fetchUser.mockRejectedValue(new Error("Unauthorized"));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(mockAuthService.clearToken).toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });

      it("handles error when getStoredToken throws", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockAuthService.getStoredToken.mockRejectedValue(new Error("Storage error"));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(consoleSpy).toHaveBeenCalledWith("Failed to check auth status:", expect.any(Error));
        expect(result.current.isAuthenticated).toBe(false);
        consoleSpy.mockRestore();
      });
    });

    describe("login", () => {
      beforeEach(() => {
        mockAuthService.buildAuthUrl.mockReturnValue("http://auth.test/login");
      });

      it("redirects to auth URL on web", async () => {
        jest.replaceProperty(Platform, "OS", "web");
        Object.defineProperty(global, "window", {
          value: { location: { href: "" } },
          writable: true,
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(global.window.location.href).toBe("http://auth.test/login");
      });

      it("opens auth session on native", async () => {
        jest.replaceProperty(Platform, "OS", "ios");
        const dismissedResult: WebBrowserResult = { type: WebBrowserResultType.DISMISS };
        mockWebBrowser.openAuthSessionAsync.mockResolvedValue(dismissedResult);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockWebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(
          "http://auth.test/login",
          "ow2c://auth/callback"
        );
      });

      it("handles successful auth session result", async () => {
        jest.replaceProperty(Platform, "OS", "ios");
        mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
          type: "success",
          url: "ow2c://auth/callback?token=new-token",
        });
        mockAuthService.parseCallbackUrl.mockReturnValue({ token: "new-token" });
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockAuthService.saveToken).toHaveBeenCalledWith("new-token");
        expect(mockRouter.replace).toHaveBeenCalledWith("/(tabs)");
      });

      it("does nothing when callback URL has no token", async () => {
        jest.replaceProperty(Platform, "OS", "ios");
        mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
          type: "success",
          url: "ow2c://auth/callback?error=access_denied",
        });
        mockAuthService.parseCallbackUrl.mockReturnValue({ error: "access_denied" });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockAuthService.saveToken).not.toHaveBeenCalled();
        expect(mockRouter.replace).not.toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
      });

      it("handles error when login throws", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        jest.replaceProperty(Platform, "OS", "ios");
        mockWebBrowser.openAuthSessionAsync.mockRejectedValue(new Error("Browser error"));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(consoleSpy).toHaveBeenCalledWith("Login failed:", expect.any(Error));
        consoleSpy.mockRestore();
      });
    });

    describe("logout", () => {
      it("calls authService.logout and clears state", async () => {
        mockAuthService.getStoredToken.mockResolvedValue("token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        await act(async () => {
          await result.current.logout();
        });

        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
      });

      it("handles error when logout API fails but still clears state", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockAuthService.getStoredToken.mockResolvedValue("token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);
        mockAuthService.logout.mockRejectedValue(new Error("Network error"));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        await act(async () => {
          await result.current.logout();
        });

        expect(consoleSpy).toHaveBeenCalledWith("Logout API call failed:", expect.any(Error));
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        consoleSpy.mockRestore();
      });
    });

    describe("deep link handling", () => {
      it("registers deep link handler", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(mockUseAuthDeepLink).toHaveBeenCalled();
      });
    });
  });
});

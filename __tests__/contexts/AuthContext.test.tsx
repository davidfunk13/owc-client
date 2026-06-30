import type { FC, ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "@/types/User";

jest.mock("@/lib/auth", () => ({
  getStoredToken: jest.fn(),
  saveToken: jest.fn(),
  clearToken: jest.fn(),
  fetchUser: jest.fn(),
  logout: jest.fn(),
  buildAuthUrl: jest.fn(),
  parseCallbackUrl: jest.fn(),
}));

jest.mock("@/lib/openAuthSession", () => ({
  openAuthSession: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  api: { exchangeCode: jest.fn() },
  setUnauthorizedHandler: jest.fn(),
}));

jest.mock("@/hooks/useAuthDeepLink", () => ({
  useAuthDeepLink: jest.fn(),
}));

import * as authService from "@/lib/auth";
import { openAuthSession } from "@/lib/openAuthSession";
import { api, setUnauthorizedHandler } from "@/lib/api";
import { useAuthDeepLink } from "@/hooks/useAuthDeepLink";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockOpenAuthSession = openAuthSession as jest.Mock;
const mockExchangeCode = api.exchangeCode as jest.Mock;
const mockSetUnauthorizedHandler = setUnauthorizedHandler as jest.Mock;
const mockUseAuthDeepLink = useAuthDeepLink as jest.Mock;

const mockUser: User = {
  id: 1,
  sub: "bnet-123",
  battlenet_id: 123456,
  battletag: "TestPlayer#1234",
  avatar: "https://example.com/avatar.jpg",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const buildWrapper = (): FC<{ children: ReactNode }> => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.getStoredToken.mockResolvedValue(null);
    mockAuthService.clearToken.mockResolvedValue(undefined);
    mockAuthService.saveToken.mockResolvedValue(undefined);
    mockAuthService.logout.mockResolvedValue(undefined);
    mockAuthService.buildAuthUrl.mockReturnValue("http://auth.test/login");
    mockOpenAuthSession.mockResolvedValue({ url: null });
    mockUseAuthDeepLink.mockImplementation(() => {});
  });

  describe("useAuth", () => {
    it("throws when used outside AuthProvider", () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within AuthProvider");
    });

    it("provides auth context when inside AuthProvider", async () => {
      const wrapper = buildWrapper();
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
        const wrapper = buildWrapper();
        renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(mockAuthService.getStoredToken).toHaveBeenCalled();
        });
      });

      it("fetches user when token exists and authenticates", async () => {
        mockAuthService.getStoredToken.mockResolvedValue("existing-token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe("existing-token");
      });

      it("clears auth when an unauthorized (401) response triggers the handler", async () => {
        mockAuthService.getStoredToken.mockResolvedValue("existing-token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        const handler = mockSetUnauthorizedHandler.mock.calls[0][0] as () => void;
        await act(async () => {
          handler();
        });

        await waitFor(() => {
          expect(mockAuthService.clearToken).toHaveBeenCalled();
        });
        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(false);
        });
        expect(result.current.user).toBeNull();
      });

      it("logs an error when clearing the token fails after a 401", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockAuthService.getStoredToken.mockResolvedValue("existing-token");
        mockAuthService.fetchUser.mockResolvedValue(mockUser);
        mockAuthService.clearToken.mockRejectedValue(new Error("Storage error"));

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });

        const handler = mockSetUnauthorizedHandler.mock.calls[0][0] as () => void;
        await act(async () => {
          handler();
        });

        await waitFor(() => {
          expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to clear invalid token:",
            expect.any(Error)
          );
        });
        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(false);
        });
        consoleSpy.mockRestore();
      });

      it("ignores a resolved token when unmounted before the check completes", async () => {
        let resolveStored: (value: string | null) => void = () => {};
        mockAuthService.getStoredToken.mockReturnValue(
          new Promise<string | null>((resolve) => {
            resolveStored = resolve;
          })
        );

        const wrapper = buildWrapper();
        const { result, unmount } = renderHook(() => useAuth(), { wrapper });

        unmount();

        await act(async () => {
          resolveStored("late-token");
          await Promise.resolve();
        });

        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });

      it("ignores a rejected token check when unmounted before it completes", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        let rejectStored: (reason: Error) => void = () => {};
        mockAuthService.getStoredToken.mockReturnValue(
          new Promise<string | null>((_resolve, reject) => {
            rejectStored = reject;
          })
        );

        const wrapper = buildWrapper();
        const { unmount } = renderHook(() => useAuth(), { wrapper });

        unmount();

        await act(async () => {
          rejectStored(new Error("Late storage error"));
          await Promise.resolve();
        });

        expect(consoleSpy).toHaveBeenCalledWith("Failed to check auth status:", expect.any(Error));
        consoleSpy.mockRestore();
      });

      it("handles error when getStoredToken throws", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockAuthService.getStoredToken.mockRejectedValue(new Error("Storage error"));

        const wrapper = buildWrapper();
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
      it("opens an auth session with the configured auth URL", async () => {
        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockOpenAuthSession).toHaveBeenCalledWith("http://auth.test/login");
      });

      it("exchanges the returned code for a token on a successful auth session", async () => {
        mockOpenAuthSession.mockResolvedValue({ url: "owc://auth/callback?code=new-code" });
        mockAuthService.parseCallbackUrl.mockReturnValue({ code: "new-code" });
        mockExchangeCode.mockResolvedValue({ token: "new-token" });
        mockAuthService.fetchUser.mockResolvedValue(mockUser);

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockExchangeCode).toHaveBeenCalledWith("new-code");
        expect(mockAuthService.saveToken).toHaveBeenCalledWith("new-token");

        await waitFor(() => {
          expect(result.current.isAuthenticated).toBe(true);
        });
        expect(result.current.user).toEqual(mockUser);
      });

      it("exchanges a given code only once (dedupes concurrent callbacks)", async () => {
        mockExchangeCode.mockResolvedValue({ token: "dedupe-token" });

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await Promise.all([
            result.current.completeAuth("same-code"),
            result.current.completeAuth("same-code"),
          ]);
        });

        expect(mockExchangeCode).toHaveBeenCalledTimes(1);
      });

      it("allows a retry after a failed exchange", async () => {
        mockExchangeCode.mockRejectedValueOnce(new Error("Network"));

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await expect(result.current.completeAuth("retry-code")).rejects.toThrow("Network");
        });

        mockExchangeCode.mockResolvedValue({ token: "retry-token" });

        await act(async () => {
          await result.current.completeAuth("retry-code");
        });

        expect(mockAuthService.saveToken).toHaveBeenCalledWith("retry-token");
      });

      it("does nothing when the auth session returns no URL", async () => {
        mockOpenAuthSession.mockResolvedValue({ url: null });

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockAuthService.saveToken).not.toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
      });

      it("does nothing when the returned URL has no code", async () => {
        mockOpenAuthSession.mockResolvedValue({ url: "owc://auth/callback?error=denied" });
        mockAuthService.parseCallbackUrl.mockReturnValue({ error: "denied" });

        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
          await result.current.login();
        });

        expect(mockExchangeCode).not.toHaveBeenCalled();
        expect(mockAuthService.saveToken).not.toHaveBeenCalled();
      });

      it("handles error when login throws", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockOpenAuthSession.mockRejectedValue(new Error("Browser error"));

        const wrapper = buildWrapper();
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

        const wrapper = buildWrapper();
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

        const wrapper = buildWrapper();
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
        const wrapper = buildWrapper();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(mockUseAuthDeepLink).toHaveBeenCalled();
      });
    });
  });
});

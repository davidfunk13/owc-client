import type { User } from "../../types/User";

jest.mock("../../lib/storage", () => ({
  storage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

jest.mock("../../lib/api", () => ({
  api: {
    getUser: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("../../config", () => ({
  config: {
    apiUrl: "http://localhost:8000",
  },
}));

import { storage } from "../../lib/storage";
import { api } from "../../lib/api";
import * as authService from "../../lib/auth";

const mockStorage = storage as jest.Mocked<typeof storage>;
const mockApi = api as jest.Mocked<typeof api>;

const mockUser: User = {
  id: 1,
  sub: "bnet-123",
  battlenet_id: 123456,
  battletag: "TestPlayer#1234",
  avatar: "https://example.com/avatar.jpg",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildAuthUrl", () => {
    it("builds correct auth URL for android", () => {
      const url = authService.buildAuthUrl("android");
      expect(url).toBe("http://localhost:8000/auth/battlenet/redirect?platform=android");
    });

    it("builds correct auth URL for ios", () => {
      const url = authService.buildAuthUrl("ios");
      expect(url).toBe("http://localhost:8000/auth/battlenet/redirect?platform=ios");
    });

    it("builds correct auth URL for web", () => {
      const url = authService.buildAuthUrl("web");
      expect(url).toBe("http://localhost:8000/auth/battlenet/redirect?platform=web");
    });
  });

  describe("parseCallbackUrl", () => {
    it("extracts token from valid callback URL", () => {
      const result = authService.parseCallbackUrl("ow2c://auth/callback?token=abc123");
      expect(result.token).toBe("abc123");
      expect(result.error).toBeUndefined();
    });

    it("extracts error from error callback URL", () => {
      const result = authService.parseCallbackUrl("ow2c://auth/callback?error=access_denied");
      expect(result.error).toBe("access_denied");
      expect(result.token).toBeUndefined();
    });

    it("extracts both token and error if present", () => {
      const result = authService.parseCallbackUrl("ow2c://auth/callback?token=abc&error=partial");
      expect(result.token).toBe("abc");
      expect(result.error).toBe("partial");
    });

    it("returns empty for URL without query params", () => {
      const result = authService.parseCallbackUrl("ow2c://auth/callback");
      expect(result.token).toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it("handles web-style callback URLs", () => {
      const result = authService.parseCallbackUrl("http://localhost:8081/?token=webtoken123");
      expect(result.token).toBe("webtoken123");
    });
  });

  describe("token management", () => {
    it("saves token via storage", async () => {
      await authService.saveToken("my-token");
      expect(mockStorage.setToken).toHaveBeenCalledWith("my-token");
    });

    it("retrieves stored token", async () => {
      mockStorage.getToken.mockResolvedValue("stored-token");
      const token = await authService.getStoredToken();
      expect(token).toBe("stored-token");
      expect(mockStorage.getToken).toHaveBeenCalled();
    });

    it("returns null when no token stored", async () => {
      mockStorage.getToken.mockResolvedValue(null);
      const token = await authService.getStoredToken();
      expect(token).toBeNull();
    });

    it("clears token on clearToken", async () => {
      await authService.clearToken();
      expect(mockStorage.removeToken).toHaveBeenCalled();
    });
  });

  describe("fetchUser", () => {
    it("returns user on valid token", async () => {
      mockApi.getUser.mockResolvedValue(mockUser);
      const user = await authService.fetchUser();
      expect(user).toEqual(mockUser);
      expect(mockApi.getUser).toHaveBeenCalled();
    });

    it("throws on invalid token", async () => {
      mockApi.getUser.mockRejectedValue(new Error("Unauthorized"));
      await expect(authService.fetchUser()).rejects.toThrow("Unauthorized");
    });
  });

  describe("logout", () => {
    it("calls API logout and clears token", async () => {
      mockApi.logout.mockResolvedValue({ message: "Logged out" });
      await authService.logout();
      expect(mockApi.logout).toHaveBeenCalled();
      expect(mockStorage.removeToken).toHaveBeenCalled();
    });

    it("clears token even if API logout fails", async () => {
      mockApi.logout.mockRejectedValue(new Error("Network error"));
      await authService.logout();
      expect(mockApi.logout).toHaveBeenCalled();
      expect(mockStorage.removeToken).toHaveBeenCalled();
    });

    it("clears token even if token already invalid", async () => {
      mockApi.logout.mockRejectedValue(new Error("Unauthenticated"));
      await authService.logout();
      expect(mockStorage.removeToken).toHaveBeenCalled();
    });
  });
});

import type { User } from "../../types/User";

jest.mock("../../lib/storage", () => ({
  storage: {
    getToken: jest.fn(),
  },
}));

jest.mock("../../config", () => ({
  config: {
    apiUrl: "http://test-api.com",
  },
}));

import { storage } from "../../lib/storage";
import { api, request } from "../../lib/api";

const mockStorage = storage as jest.Mocked<typeof storage>;

const mockUser: User = {
  id: 1,
  sub: "bnet-123",
  battlenet_id: 123456,
  battletag: "TestPlayer#1234",
  avatar: "https://example.com/avatar.jpg",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("getUser", () => {
    it("fetches user with auth header when token exists", async () => {
      mockStorage.getToken.mockResolvedValue("valid-token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const user = await api.getUser();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test-api.com/api/auth/user",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
            "Content-Type": "application/json",
          }),
        })
      );
      expect(user).toEqual(mockUser);
    });

    it("makes request without auth header when no token", async () => {
      mockStorage.getToken.mockResolvedValue(null);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      await api.getUser();

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    it("throws on non-ok response", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(api.getUser()).rejects.toThrow("API Error: 401");
    });
  });

  describe("logout", () => {
    it("sends POST request to logout endpoint", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: "Logged out" }),
      });

      const result = await api.logout();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test-api.com/api/auth/logout",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result).toEqual({ message: "Logged out" });
    });
  });

  describe("request", () => {
    it("serializes body as JSON when provided", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const body = { data: "test", value: 123 };
      await request("/api/test", { method: "POST", body });

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test-api.com/api/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        })
      );
    });

    it("continues without token when storage.getToken throws", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockStorage.getToken.mockRejectedValue(new Error("Storage error"));
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await request("/api/test");

      expect(consoleSpy).toHaveBeenCalledWith("Failed to retrieve auth token:", expect.any(Error));
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it("throws NetworkError when fetch fails with Error", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Connection refused"));

      await expect(request("/api/test")).rejects.toThrow("Connection refused");
      await expect(request("/api/test")).rejects.toMatchObject({
        name: "NetworkError",
      });
    });

    it("throws NetworkError with default message when fetch fails with non-Error", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockRejectedValue("Network failure");

      await expect(request("/api/test")).rejects.toThrow("Failed to connect to the server");
      await expect(request("/api/test")).rejects.toMatchObject({
        name: "NetworkError",
      });
    });

    it("extracts error message from response body", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({ message: "Invalid input data" }),
      });

      await expect(request("/api/test")).rejects.toThrow("Invalid input data");
    });

    it("extracts error field when message is not present", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        json: () => Promise.resolve({ error: "Validation failed" }),
      });

      await expect(request("/api/test")).rejects.toThrow("Validation failed");
    });

    it("throws ApiError when response JSON parsing fails", async () => {
      mockStorage.getToken.mockResolvedValue("token");
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(request("/api/test")).rejects.toThrow("Failed to parse response");
      await expect(request("/api/test")).rejects.toMatchObject({
        name: "ApiError",
        status: 200,
      });
    });
  });
});

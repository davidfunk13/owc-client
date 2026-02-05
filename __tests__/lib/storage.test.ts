import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { storage } from "../../lib/storage";

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe("getToken", () => {
    it("uses localStorage on web", async () => {
      jest.replaceProperty(Platform, "OS", "web");
      (global.localStorage.getItem as jest.Mock).mockReturnValue("web-token");

      const token = await storage.getToken();

      expect(global.localStorage.getItem).toHaveBeenCalledWith("auth_token");
      expect(token).toBe("web-token");
    });

    it("uses SecureStore on native", async () => {
      jest.replaceProperty(Platform, "OS", "ios");
      mockSecureStore.getItemAsync.mockResolvedValue("native-token");

      const token = await storage.getToken();

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
      expect(token).toBe("native-token");
    });

    it("returns null when no token stored", async () => {
      jest.replaceProperty(Platform, "OS", "ios");
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const token = await storage.getToken();

      expect(token).toBeNull();
    });
  });

  describe("setToken", () => {
    it("uses localStorage on web", async () => {
      jest.replaceProperty(Platform, "OS", "web");

      await storage.setToken("new-token");

      expect(global.localStorage.setItem).toHaveBeenCalledWith("auth_token", "new-token");
    });

    it("uses SecureStore on native", async () => {
      jest.replaceProperty(Platform, "OS", "android");

      await storage.setToken("new-token");

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "new-token");
    });
  });

  describe("removeToken", () => {
    it("uses localStorage on web", async () => {
      jest.replaceProperty(Platform, "OS", "web");

      await storage.removeToken();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });

    it("uses SecureStore on native", async () => {
      jest.replaceProperty(Platform, "OS", "ios");

      await storage.removeToken();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
    });
  });
});

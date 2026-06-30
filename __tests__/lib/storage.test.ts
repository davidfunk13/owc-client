import * as SecureStore from "expo-secure-store";
import { storage } from "../../lib/storage";

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("storage (native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getToken", () => {
    it("reads the token from SecureStore", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("native-token");

      const token = await storage.getToken();

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
      expect(token).toBe("native-token");
    });

    it("returns null when no token is stored", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const token = await storage.getToken();

      expect(token).toBeNull();
    });
  });

  describe("setToken", () => {
    it("writes the token to SecureStore", async () => {
      await storage.setToken("new-token");

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "new-token");
    });
  });

  describe("removeToken", () => {
    it("deletes the token from SecureStore", async () => {
      await storage.removeToken();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
    });
  });

  describe("getTheme", () => {
    it("reads the theme from SecureStore", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("dark");

      const theme = await storage.getTheme();

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("theme");
      expect(theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("writes the theme to SecureStore", async () => {
      await storage.setTheme("light");

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith("theme", "light");
    });
  });
});

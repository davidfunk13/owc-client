import { storage } from "../../lib/storage.web";

describe("storage (web)", () => {
  beforeEach(() => {
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
    it("reads the token from localStorage", async () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue("web-token");

      const token = await storage.getToken();

      expect(global.localStorage.getItem).toHaveBeenCalledWith("auth_token");
      expect(token).toBe("web-token");
    });

    it("returns null when no token is stored", async () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue(null);

      const token = await storage.getToken();

      expect(token).toBeNull();
    });
  });

  describe("setToken", () => {
    it("writes the token to localStorage", async () => {
      await storage.setToken("new-token");

      expect(global.localStorage.setItem).toHaveBeenCalledWith("auth_token", "new-token");
    });
  });

  describe("removeToken", () => {
    it("deletes the token from localStorage", async () => {
      await storage.removeToken();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });
  });

  describe("getTheme", () => {
    it("reads the theme from localStorage", async () => {
      (global.localStorage.getItem as jest.Mock).mockReturnValue("light");

      const theme = await storage.getTheme();

      expect(global.localStorage.getItem).toHaveBeenCalledWith("theme");
      expect(theme).toBe("light");
    });
  });

  describe("setTheme", () => {
    it("writes the theme to localStorage", async () => {
      await storage.setTheme("dark");

      expect(global.localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });
  });
});

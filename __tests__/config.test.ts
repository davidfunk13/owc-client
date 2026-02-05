import { Platform } from "react-native";

let mockIsDevice = false;

jest.mock("expo-device", () => ({
  get isDevice() {
    return mockIsDevice;
  },
}));

describe("config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_API_URL_PRODUCTION;
    delete process.env.EXPO_PUBLIC_API_URL_DEV_WEB;
    delete process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_EMULATOR;
    delete process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE;
    delete process.env.EXPO_PUBLIC_API_URL_DEV_IOS_SIMULATOR;
    mockIsDevice = false;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getDevApiUrl", () => {
    it("uses EXPO_PUBLIC_API_URL when set", () => {
      process.env.EXPO_PUBLIC_API_URL = "http://custom-api.com";
      jest.replaceProperty(Platform, "OS", "ios");

      const { config } = require("../config");

      expect(config.apiUrl).toBe("http://custom-api.com");
    });

    it("returns web dev URL for web platform", () => {
      process.env.EXPO_PUBLIC_API_URL_DEV_WEB = "http://localhost:8000";
      jest.replaceProperty(Platform, "OS", "web");

      const { config } = require("../config");

      expect(config.apiUrl).toBe("http://localhost:8000");
    });

    it("returns android emulator URL for android emulator", () => {
      process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_EMULATOR = "http://10.0.2.2:8000";
      jest.replaceProperty(Platform, "OS", "android");
      mockIsDevice = false;

      const { config } = require("../config");

      expect(config.apiUrl).toBe("http://10.0.2.2:8000");
    });

    it("returns ios simulator URL for ios simulator", () => {
      process.env.EXPO_PUBLIC_API_URL_DEV_IOS_SIMULATOR = "http://localhost:8000";
      jest.replaceProperty(Platform, "OS", "ios");
      mockIsDevice = false;

      const { config } = require("../config");

      expect(config.apiUrl).toBe("http://localhost:8000");
    });

    it("returns android device URL for android real device", () => {
      process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE = "http://192.168.0.132:8000";
      jest.replaceProperty(Platform, "OS", "android");
      mockIsDevice = true;

      const { config } = require("../config");

      expect(config.apiUrl).toBe("http://192.168.0.132:8000");
    });

    it("throws error for ios real device without env var", () => {
      jest.replaceProperty(Platform, "OS", "ios");
      mockIsDevice = true;

      expect(() => require("../config")).toThrow(
        "Set EXPO_PUBLIC_API_URL or platform-specific env var in .env.local for real device development"
      );
    });

    it("returns production URL when not in dev mode", () => {
      process.env.EXPO_PUBLIC_API_URL_PRODUCTION = "https://api.yoursite.com";
      const { getApiUrl } = require("../config");

      expect(getApiUrl(false)).toBe("https://api.yoursite.com");
    });
  });
});

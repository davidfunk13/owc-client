import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { useAuthDeepLink } from "../../hooks/useAuthDeepLink";

// Access the mocked module from jest.setup.js
// The mock is already configured there with the correct shape
const mockAddEventListener = Linking.addEventListener as jest.Mock;
const mockGetInitialURL = Linking.getInitialURL as jest.Mock;

describe("useAuthDeepLink", () => {
  let mockCallback: jest.Mock;
  let mockRemove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn();
    mockRemove = jest.fn();
    mockAddEventListener.mockReturnValue({ remove: mockRemove });
    mockGetInitialURL.mockResolvedValue(null);

    // Reset window mock
    Object.defineProperty(global, "window", {
      value: {
        location: {
          search: "",
          pathname: "/",
        },
        history: {
          replaceState: jest.fn(),
        },
      },
      writable: true,
    });
  });

  describe("on native platforms", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "ios");
    });

    it("sets up link event listener", () => {
      renderHook(() => useAuthDeepLink(mockCallback));

      expect(mockAddEventListener).toHaveBeenCalledWith("url", expect.any(Function));
    });

    it("calls callback when receiving auth callback URL", () => {
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === "url") {
          handler({ url: "owc://auth/callback?token=abc123" });
        }
        return { remove: mockRemove };
      });

      renderHook(() => useAuthDeepLink(mockCallback));

      expect(mockCallback).toHaveBeenCalledWith("owc://auth/callback?token=abc123");
    });

    it("ignores non-auth-callback URLs", () => {
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === "url") {
          handler({ url: "owc://some/other/path" });
        }
        return { remove: mockRemove };
      });

      renderHook(() => useAuthDeepLink(mockCallback));

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it("checks initial URL on mount", async () => {
      mockGetInitialURL.mockResolvedValue("owc://auth/callback?token=initial");

      renderHook(() => useAuthDeepLink(mockCallback));

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockCallback).toHaveBeenCalledWith("owc://auth/callback?token=initial");
    });

    it("removes listener on unmount", () => {
      const { unmount } = renderHook(() => useAuthDeepLink(mockCallback));

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });

    it("handles error when getInitialURL fails", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockGetInitialURL.mockRejectedValue(new Error("Linking error"));

      renderHook(() => useAuthDeepLink(mockCallback));

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(consoleSpy).toHaveBeenCalledWith("Failed to get initial URL:", expect.any(Error));
      expect(mockCallback).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("on web platform", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "web");
    });

    it("extracts token from URL and calls callback", () => {
      global.window.location.search = "?token=web-token-123";

      renderHook(() => useAuthDeepLink(mockCallback));

      expect(mockCallback).toHaveBeenCalledWith("web://callback?token=web-token-123");
    });

    it("clears URL after extracting token", () => {
      global.window.location.search = "?token=web-token";

      renderHook(() => useAuthDeepLink(mockCallback));

      expect(global.window.history.replaceState).toHaveBeenCalledWith(
        {},
        "",
        global.window.location.pathname
      );
    });

    it("does nothing when no token in URL", () => {
      global.window.location.search = "";

      renderHook(() => useAuthDeepLink(mockCallback));

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});

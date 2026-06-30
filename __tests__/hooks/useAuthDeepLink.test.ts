import { renderHook } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import { useAuthDeepLink } from "../../hooks/useAuthDeepLink";

const mockAddEventListener = Linking.addEventListener as jest.Mock;
const mockGetInitialURL = Linking.getInitialURL as jest.Mock;

describe("useAuthDeepLink (native)", () => {
  let mockCallback: jest.Mock;
  let mockRemove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn();
    mockRemove = jest.fn();
    mockAddEventListener.mockReturnValue({ remove: mockRemove });
    mockGetInitialURL.mockResolvedValue(null);
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

  it("ignores initial URL when not an auth callback", async () => {
    mockGetInitialURL.mockResolvedValue("owc://some/other/path");

    renderHook(() => useAuthDeepLink(mockCallback));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("does not call callback when initial URL is null", async () => {
    mockGetInitialURL.mockResolvedValue(null);

    renderHook(() => useAuthDeepLink(mockCallback));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockCallback).not.toHaveBeenCalled();
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

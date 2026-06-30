import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import ProfileScreen from "@/app/(tabs)/profile";
import { withTheme } from "../../test-utils";

const mockUseAuth = useAuth as jest.Mock;

describe("ProfileScreen", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        battletag: "TestPlayer#1234",
        battlenet_id: 123456,
      },
      logout: jest.fn().mockResolvedValue(undefined),
    });
  });

  it("renders the avatar via expo-image when a URL is provided", () => {
    mockUseAuth.mockReturnValue({
      user: {
        battletag: "Player#1",
        battlenet_id: 1,
        avatar: "https://example.com/avatar.jpg",
      },
      logout: jest.fn(),
    });

    const { getByLabelText, queryByLabelText } = render(withTheme(<ProfileScreen />));

    expect(getByLabelText("Avatar")).toBeTruthy();
    expect(queryByLabelText("Avatar placeholder")).toBeNull();
  });

  it("renders a placeholder with the first letter when no avatar URL is set", () => {
    mockUseAuth.mockReturnValue({
      user: { battletag: "TestPlayer#1234", battlenet_id: 1 },
      logout: jest.fn(),
    });

    const { getByLabelText, getByText } = render(withTheme(<ProfileScreen />));

    expect(getByLabelText("Avatar placeholder")).toBeTruthy();
    expect(getByText("T")).toBeTruthy();
  });

  it("renders the battle.net id from the user", () => {
    const { getByText } = render(withTheme(<ProfileScreen />));

    expect(getByText("123456")).toBeTruthy();
  });

  it("falls back to -- when battle.net id is missing", () => {
    mockUseAuth.mockReturnValue({
      user: { battletag: "TestPlayer#1234" },
      logout: jest.fn(),
    });

    const { getByText } = render(withTheme(<ProfileScreen />));

    expect(getByText("--")).toBeTruthy();
  });

  it("calls logout when the Sign Out button is pressed", () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: { battletag: "TestPlayer#1234", battlenet_id: 1 },
      logout,
    });

    const { getByRole } = render(withTheme(<ProfileScreen />));

    fireEvent.press(getByRole("button", { name: "Sign Out" }));

    expect(logout).toHaveBeenCalled();
  });

  it("logs an error when logout rejects", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const logout = jest.fn().mockRejectedValue(new Error("Network error"));
    mockUseAuth.mockReturnValue({
      user: { battletag: "TestPlayer#1234", battlenet_id: 1 },
      logout,
    });

    const { getByRole } = render(withTheme(<ProfileScreen />));

    fireEvent.press(getByRole("button", { name: "Sign Out" }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleSpy).toHaveBeenCalledWith("Logout failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});

import { render } from "@testing-library/react-native";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import HomeOverview from "@/app/(tabs)/index/overview";
import { withTheme } from "../../../test-utils";

const mockUseAuth = useAuth as jest.Mock;

describe("HomeOverview", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null });
  });

  it("greets the user by battletag when present", () => {
    mockUseAuth.mockReturnValue({ user: { battletag: "TestPlayer#1234" } });

    const { getByText } = render(withTheme(<HomeOverview />));

    expect(getByText("TestPlayer#1234")).toBeTruthy();
  });

  it("falls back to a generic greeting when user is unknown", () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { getByText } = render(withTheme(<HomeOverview />));

    expect(getByText("Player")).toBeTruthy();
  });
});

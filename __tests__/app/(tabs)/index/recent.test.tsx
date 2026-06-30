import { render } from "@testing-library/react-native";
import HomeRecent from "@/app/(tabs)/index/recent";
import { withTheme } from "../../../test-utils";

describe("HomeRecent", () => {
  it("renders the empty-state title", () => {
    const { getByText } = render(withTheme(<HomeRecent />));

    expect(getByText("No recent games")).toBeTruthy();
  });

  it("renders the empty-state guidance copy", () => {
    const { getByText } = render(withTheme(<HomeRecent />));

    expect(getByText(/Add a game from the \+ action/)).toBeTruthy();
  });
});

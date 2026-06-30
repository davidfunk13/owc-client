import { render } from "@testing-library/react-native";
import HomeTrends from "@/app/(tabs)/index/trends";
import { withTheme } from "../../../test-utils";

describe("HomeTrends", () => {
  it("renders the empty-state title", () => {
    const { getByText } = render(withTheme(<HomeTrends />));

    expect(getByText("No trend data yet")).toBeTruthy();
  });

  it("renders the empty-state guidance copy", () => {
    const { getByText } = render(withTheme(<HomeTrends />));

    expect(getByText(/Track at least a few games/)).toBeTruthy();
  });
});

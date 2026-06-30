import { render } from "@testing-library/react-native";
import StatsScreen from "@/app/(tabs)/stats";
import { withTheme } from "../../test-utils";

describe("StatsScreen", () => {
  it("renders Statistics, Heroes, and Maps sections", () => {
    const { getByText } = render(withTheme(<StatsScreen />));

    expect(getByText("Statistics")).toBeTruthy();
    expect(getByText("Heroes")).toBeTruthy();
    expect(getByText("Maps")).toBeTruthy();
  });

  it("renders empty-state copy until data is wired up", () => {
    const { getByText } = render(withTheme(<StatsScreen />));

    expect(getByText("No stats available yet.")).toBeTruthy();
    expect(getByText("No hero data yet.")).toBeTruthy();
    expect(getByText("No map data yet.")).toBeTruthy();
  });
});

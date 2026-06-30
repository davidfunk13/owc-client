import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Screen } from "../../components/Screen/Screen";
import { withTheme } from "../test-utils";

describe("Screen", () => {
  it("renders children", () => {
    const { getByText } = render(
      withTheme(
        <Screen>
          <Text>Screen content</Text>
        </Screen>
      )
    );

    expect(getByText("Screen content")).toBeTruthy();
  });

  it("renders as View by default (not scrollable)", () => {
    const { getByText, UNSAFE_root } = render(
      withTheme(
        <Screen>
          <Text>Non-scrollable</Text>
        </Screen>
      )
    );

    expect(getByText("Non-scrollable")).toBeTruthy();
    const scrollViews = UNSAFE_root.findAllByType("RCTScrollView" as never);
    expect(scrollViews).toHaveLength(0);
  });

  it("renders as ScrollView when scroll prop is true", () => {
    const { getByText } = render(
      withTheme(
        <Screen scroll>
          <Text>Scrollable content</Text>
        </Screen>
      )
    );

    expect(getByText("Scrollable content")).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { padding: 20 };
    const { getByText } = render(
      withTheme(
        <Screen style={customStyle}>
          <Text>Styled screen</Text>
        </Screen>
      )
    );

    expect(getByText("Styled screen")).toBeTruthy();
  });
});

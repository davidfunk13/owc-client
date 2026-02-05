import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "../../components/Card/Card";
import { withTheme } from "../test-utils";

describe("Card", () => {
  it("renders children", () => {
    const { getByText } = render(
      withTheme(
        <Card>
          <Text>Card content</Text>
        </Card>
      )
    );

    expect(getByText("Card content")).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { marginTop: 50 };
    const { getByText } = render(
      withTheme(
        <Card style={customStyle}>
          <Text>Styled card</Text>
        </Card>
      )
    );

    expect(getByText("Styled card")).toBeTruthy();
  });

  it("renders multiple children", () => {
    const { getByText } = render(
      withTheme(
        <Card>
          <Text>First child</Text>
          <Text>Second child</Text>
        </Card>
      )
    );

    expect(getByText("First child")).toBeTruthy();
    expect(getByText("Second child")).toBeTruthy();
  });
});

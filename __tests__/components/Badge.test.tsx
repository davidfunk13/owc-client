import { render } from "@testing-library/react-native";
import { Badge } from "../../components/Badge/Badge";
import { withTheme } from "../test-utils";

describe("Badge", () => {
  it("renders the label and is reachable by accessibilityLabel", () => {
    const { getByText, getByLabelText } = render(withTheme(<Badge label="New" />));

    expect(getByText("New")).toBeTruthy();
    expect(getByLabelText("New")).toBeTruthy();
  });
});

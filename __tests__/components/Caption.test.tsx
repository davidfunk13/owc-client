import { render } from "@testing-library/react-native";
import { Caption } from "../../components/Caption/Caption";

import { withTheme } from "../test-utils";

describe("Caption", () => {
  it("renders children", () => {
    const { getByText } = render(withTheme(<Caption>Small caption</Caption>));

    expect(getByText("Small caption")).toBeTruthy();
  });

  it("renders in the tiny variant", () => {
    const { getByText } = render(withTheme(<Caption tiny>Hint</Caption>));

    expect(getByText("Hint")).toBeTruthy();
  });
});

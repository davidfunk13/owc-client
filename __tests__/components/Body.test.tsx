import { render } from "@testing-library/react-native";
import { Body } from "../../components/Body/Body";

import { withTheme } from "../test-utils";

describe("Body", () => {
  it("renders children", () => {
    const { getByText } = render(withTheme(<Body>Hello</Body>));

    expect(getByText("Hello")).toBeTruthy();
  });

  it("renders at a smaller size when set", () => {
    const { getByText } = render(withTheme(<Body size="sm">Small</Body>));

    expect(getByText("Small")).toBeTruthy();
  });

  it("renders muted text", () => {
    const { getByText } = render(withTheme(<Body muted>Quiet</Body>));

    expect(getByText("Quiet")).toBeTruthy();
  });
});

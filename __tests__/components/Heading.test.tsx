import { render } from "@testing-library/react-native";
import { Heading } from "../../components/Heading/Heading";
import { withTheme } from "../test-utils";

describe("Heading", () => {
  it("renders children", () => {
    const { getByText } = render(withTheme(<Heading>Welcome</Heading>));

    expect(getByText("Welcome")).toBeTruthy();
  });

  it("renders at a non-default size", () => {
    const { getByText } = render(withTheme(<Heading size="lg">Big</Heading>));

    expect(getByText("Big")).toBeTruthy();
  });

  it("exposes accessibilityRole 'header'", () => {
    const { getByRole } = render(withTheme(<Heading>Header</Heading>));

    expect(getByRole("header", { name: "Header" })).toBeTruthy();
  });
});

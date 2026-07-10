import { render } from "@testing-library/react-native";
import { Heading } from "../../components/Heading/Heading";
import { withTheme } from "../test-utils";

describe("Heading", () => {
  it("exposes accessibilityRole 'header'", () => {
    const { getByRole } = render(withTheme(<Heading>Header</Heading>));

    expect(getByRole("header", { name: "Header" })).toBeTruthy();
  });
});

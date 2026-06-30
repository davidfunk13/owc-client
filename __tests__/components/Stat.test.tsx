import { render } from "@testing-library/react-native";
import { Stat } from "../../components/Stat/Stat";
import { withTheme } from "../test-utils";

describe("Stat", () => {
  it("renders children", () => {
    const { getByText } = render(withTheme(<Stat>42</Stat>));

    expect(getByText("42")).toBeTruthy();
  });
});

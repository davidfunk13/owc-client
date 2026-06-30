import { render } from "@testing-library/react-native";
import { View } from "react-native";
import { Divider } from "../../components/Divider/Divider";
import { withTheme } from "../test-utils";

describe("Divider", () => {
  it("renders a hairline view", () => {
    const { UNSAFE_getByType } = render(withTheme(<Divider />));

    expect(UNSAFE_getByType(View)).toBeTruthy();
  });
});

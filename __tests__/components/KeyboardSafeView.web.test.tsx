import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { KeyboardSafeView } from "../../components/KeyboardSafeView/KeyboardSafeView.web";

describe("KeyboardSafeView (web — passthrough)", () => {
  it("renders children", () => {
    const { getByText } = render(
      <KeyboardSafeView>
        <Text>Inside</Text>
      </KeyboardSafeView>
    );

    expect(getByText("Inside")).toBeTruthy();
  });

  it("does not render a KeyboardAvoidingView", () => {
    const { UNSAFE_root } = render(
      <KeyboardSafeView>
        <Text>Pass through</Text>
      </KeyboardSafeView>
    );

    const kavs = UNSAFE_root.findAllByType("KeyboardAvoidingView" as never);
    expect(kavs).toHaveLength(0);
  });
});

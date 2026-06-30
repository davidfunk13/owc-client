import { render } from "@testing-library/react-native";
import { KeyboardAvoidingView, Text } from "react-native";
import { KeyboardSafeView } from "../../components/KeyboardSafeView/KeyboardSafeView.ios";

describe("KeyboardSafeView (iOS)", () => {
  it("renders children", () => {
    const { getByText } = render(
      <KeyboardSafeView>
        <Text>Inside</Text>
      </KeyboardSafeView>
    );

    expect(getByText("Inside")).toBeTruthy();
  });

  it("uses KeyboardAvoidingView with padding behavior", () => {
    const { UNSAFE_getByType } = render(
      <KeyboardSafeView>
        <Text>Avoiding</Text>
      </KeyboardSafeView>
    );

    const kav = UNSAFE_getByType(KeyboardAvoidingView);
    expect(kav.props.behavior).toBe("padding");
  });
});

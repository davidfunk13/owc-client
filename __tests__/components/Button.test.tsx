import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../../components/Button/Button";
import { withTheme } from "../test-utils";

describe("Button", () => {
  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(withTheme(<Button title="Click me" onPress={onPress} />));

    fireEvent.press(getByText("Click me"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(withTheme(<Button title="Click me" onPress={onPress} disabled />));

    fireEvent.press(getByText("Click me"));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("exposes accessibilityRole 'button' and label matching the title", () => {
    const { getByLabelText, getByRole } = render(
      withTheme(<Button title="Save changes" onPress={() => {}} />)
    );

    expect(getByLabelText("Save changes")).toBeTruthy();
    expect(getByRole("button", { name: "Save changes" })).toBeTruthy();
  });

  it("reflects disabled state via accessibilityState", () => {
    const { getByRole } = render(withTheme(<Button title="Locked" onPress={() => {}} disabled />));

    const button = getByRole("button", { name: "Locked" });
    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: false });
  });

  it("shows a spinner and blocks presses while loading", () => {
    const onPress = jest.fn();
    const { getByRole, UNSAFE_root } = render(
      withTheme(<Button title="Saving" onPress={onPress} loading />)
    );

    const button = getByRole("button", { name: "Saving" });
    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });
    expect(UNSAFE_root.findAllByType("ActivityIndicator" as never).length).toBeGreaterThan(0);

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});

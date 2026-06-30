import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../../components/Button/Button";
import { withTheme } from "../test-utils";

describe("Button", () => {
  it("renders with title", () => {
    const { getByText } = render(withTheme(<Button title="Click me" onPress={() => {}} />));

    expect(getByText("Click me")).toBeTruthy();
  });

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

  it("renders with primary variant by default", () => {
    const { getByText } = render(withTheme(<Button title="Primary" onPress={() => {}} />));

    const button = getByText("Primary").parent?.parent;
    expect(button).toBeTruthy();
  });

  it("renders with danger variant", () => {
    const { getByText } = render(
      withTheme(<Button title="Danger" onPress={() => {}} variant="danger" />)
    );

    expect(getByText("Danger")).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      withTheme(<Button title="Styled" onPress={() => {}} style={customStyle} />)
    );

    expect(getByText("Styled")).toBeTruthy();
  });

  it("shows reduced opacity when disabled", () => {
    const { getByText } = render(
      withTheme(<Button title="Disabled" onPress={() => {}} disabled />)
    );

    expect(getByText("Disabled")).toBeTruthy();
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
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });
});

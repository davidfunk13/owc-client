import { fireEvent, render } from "@testing-library/react-native";
import { Input } from "../../components/Input/Input";
import { withTheme } from "../test-utils";

describe("Input", () => {
  it("renders the label and reflects the value", () => {
    const { getByLabelText, getByDisplayValue } = render(
      withTheme(<Input label="Email" value="me@example.com" />)
    );

    expect(getByLabelText("Email")).toBeTruthy();
    expect(getByDisplayValue("me@example.com")).toBeTruthy();
  });

  it("falls back to placeholder for accessibility when no label provided", () => {
    const { getByLabelText } = render(withTheme(<Input placeholder="Search..." />));

    expect(getByLabelText("Search...")).toBeTruthy();
  });

  it("calls onChangeText as the user types", () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      withTheme(<Input label="Email" onChangeText={onChangeText} />)
    );

    fireEvent.changeText(getByLabelText("Email"), "new@example.com");

    expect(onChangeText).toHaveBeenCalledWith("new@example.com");
  });

  it("calls onBlur when focus leaves", () => {
    const onBlur = jest.fn();
    const { getByLabelText } = render(withTheme(<Input label="Email" onBlur={onBlur} />));

    fireEvent(getByLabelText("Email"), "blur");

    expect(onBlur).toHaveBeenCalled();
  });

  it("renders the error message when provided", () => {
    const { getByText } = render(withTheme(<Input label="Email" error="Must be a valid email" />));

    expect(getByText("Must be a valid email")).toBeTruthy();
  });

  it("renders the helper text when no error is set", () => {
    const { getByText } = render(withTheme(<Input label="Email" helper="We never share this" />));

    expect(getByText("We never share this")).toBeTruthy();
  });

  it("hides helper when an error is also present (error wins)", () => {
    const { queryByText, getByText } = render(
      withTheme(<Input label="Email" helper="Hint" error="Bad input" />)
    );

    expect(getByText("Bad input")).toBeTruthy();
    expect(queryByText("Hint")).toBeNull();
  });

  it("disables editing when disabled is true", () => {
    const { getByLabelText } = render(withTheme(<Input label="Email" disabled />));

    expect(getByLabelText("Email").props.editable).toBe(false);
  });

  it("supports multiline mode", () => {
    const { getByLabelText } = render(withTheme(<Input label="Notes" multiline />));

    expect(getByLabelText("Notes").props.multiline).toBe(true);
  });
});

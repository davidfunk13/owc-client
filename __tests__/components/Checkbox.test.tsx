import { fireEvent, render } from "@testing-library/react-native";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { withTheme } from "../test-utils";

describe("Checkbox", () => {
  it("renders the label", () => {
    const { getByText } = render(
      withTheme(<Checkbox value={false} onValueChange={jest.fn()} label="Remember me" />)
    );

    expect(getByText("Remember me")).toBeTruthy();
  });

  it("toggles from false to true on press", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      withTheme(<Checkbox value={false} onValueChange={onValueChange} label="Remember me" />)
    );

    fireEvent.press(getByRole("checkbox", { name: "Remember me" }));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("toggles from true to false on press", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      withTheme(<Checkbox value onValueChange={onValueChange} label="Remember me" />)
    );

    fireEvent.press(getByRole("checkbox", { name: "Remember me" }));

    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it("does not toggle when disabled", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      withTheme(
        <Checkbox value={false} onValueChange={onValueChange} label="Remember me" disabled />
      )
    );

    fireEvent.press(getByRole("checkbox", { name: "Remember me" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reflects checked state via accessibilityState", () => {
    const { getByRole } = render(
      withTheme(<Checkbox value onValueChange={jest.fn()} label="Remember me" />)
    );

    expect(getByRole("checkbox", { name: "Remember me" }).props.accessibilityState.checked).toBe(
      true
    );
  });

  it("renders without a label", () => {
    const { queryByText, getByRole } = render(
      withTheme(<Checkbox value={false} onValueChange={jest.fn()} />)
    );

    expect(queryByText("Remember me")).toBeNull();
    expect(getByRole("checkbox")).toBeTruthy();
  });
});

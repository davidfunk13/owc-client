import { fireEvent, render } from "@testing-library/react-native";
import { Switch } from "../../components/Switch/Switch";
import { withTheme } from "../test-utils";

describe("Switch", () => {
  it("renders the label", () => {
    const { getByText } = render(
      withTheme(<Switch label="Notifications" value={false} onValueChange={jest.fn()} />)
    );

    expect(getByText("Notifications")).toBeTruthy();
  });

  it("toggles via onValueChange", () => {
    const onValueChange = jest.fn();
    const { UNSAFE_root } = render(
      withTheme(<Switch label="Notifications" value={false} onValueChange={onValueChange} />)
    );

    const sw = UNSAFE_root.findAllByType("RCTSwitch" as never)[0]!;
    fireEvent(sw, "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("reflects value via accessibilityState.checked", () => {
    const { getByRole } = render(
      withTheme(<Switch label="Notifications" value onValueChange={jest.fn()} />)
    );

    const sw = getByRole("switch", { name: "Notifications" });
    expect(sw.props.accessibilityState.checked).toBe(true);
  });

  it("disables interaction when disabled", () => {
    const { getByRole } = render(
      withTheme(<Switch label="Notifications" value={false} onValueChange={jest.fn()} disabled />)
    );

    const sw = getByRole("switch", { name: "Notifications" });
    expect(sw.props.accessibilityState.disabled).toBe(true);
  });

  it("renders without a label", () => {
    const { queryByText, getByRole } = render(
      withTheme(<Switch value={false} onValueChange={jest.fn()} />)
    );

    expect(queryByText("Notifications")).toBeNull();
    expect(getByRole("switch")).toBeTruthy();
  });
});

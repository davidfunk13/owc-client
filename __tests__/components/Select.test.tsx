import { fireEvent, render } from "@testing-library/react-native";
import { Select } from "../../components/Select/Select";
import { withTheme } from "../test-utils";
import type { SelectOption } from "@/types/components";

const options: SelectOption[] = [
  { label: "Tank", value: "tank" },
  { label: "Damage", value: "damage" },
  { label: "Support", value: "support" },
];

describe("Select", () => {
  it("renders the label", () => {
    const { getByText } = render(
      withTheme(<Select label="Role" value="tank" onValueChange={jest.fn()} options={options} />)
    );

    expect(getByText("Role")).toBeTruthy();
  });

  it("renders each option as a radio with the right selection state", () => {
    const { getByRole } = render(
      withTheme(<Select value="damage" onValueChange={jest.fn()} options={options} />)
    );

    expect(getByRole("radio", { name: "Tank" }).props.accessibilityState.selected).toBe(false);
    expect(getByRole("radio", { name: "Damage" }).props.accessibilityState.selected).toBe(true);
    expect(getByRole("radio", { name: "Support" }).props.accessibilityState.selected).toBe(false);
  });

  it("calls onValueChange when an option is pressed", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      withTheme(<Select value="tank" onValueChange={onValueChange} options={options} />)
    );

    fireEvent.press(getByRole("radio", { name: "Support" }));

    expect(onValueChange).toHaveBeenCalledWith("support");
  });

  it("does not call onValueChange when disabled", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      withTheme(<Select value="tank" onValueChange={onValueChange} options={options} disabled />)
    );

    fireEvent.press(getByRole("radio", { name: "Damage" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});

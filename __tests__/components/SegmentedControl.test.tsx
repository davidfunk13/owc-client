import { fireEvent, render } from "@testing-library/react-native";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import type { SegmentedOption } from "@/types/components";
import { withTheme } from "../test-utils";

const OPTIONS: SegmentedOption[] = [
  { label: "Win", value: "win", tone: "success" },
  { label: "Loss", value: "loss", tone: "error" },
  { label: "Draw", value: "draw", tone: "neutral" },
];

describe("SegmentedControl", () => {
  it("calls onChange with the pressed value", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<SegmentedControl onChange={onChange} options={OPTIONS} value={null} />)
    );

    fireEvent.press(getByLabelText("Win"));

    expect(onChange).toHaveBeenCalledWith("win");
  });

  it("deselects to null when the selected option is pressed and allowDeselect is set", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <SegmentedControl allowDeselect onChange={onChange} options={OPTIONS} value="win" />
      )
    );

    fireEvent.press(getByLabelText("Win"));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("keeps the selection when the selected option is pressed without allowDeselect", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<SegmentedControl onChange={onChange} options={OPTIONS} value="win" />)
    );

    fireEvent.press(getByLabelText("Win"));

    expect(onChange).toHaveBeenCalledWith("win");
  });

  it("marks the active option selected for assistive tech", () => {
    const { getByLabelText } = render(
      withTheme(<SegmentedControl onChange={jest.fn()} options={OPTIONS} value="loss" />)
    );

    expect(getByLabelText("Loss").props.accessibilityState.selected).toBe(true);
    expect(getByLabelText("Win").props.accessibilityState.selected).toBe(false);
  });
});

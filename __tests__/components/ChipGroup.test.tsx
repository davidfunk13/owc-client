import { fireEvent, render } from "@testing-library/react-native";
import { ChipGroup } from "@/components/ChipGroup/ChipGroup";
import type { ChipOption } from "@/types/components";
import { withTheme } from "../test-utils";

const OPTIONS: ChipOption[] = [
  { label: "Reinhardt", value: 1 },
  { label: "Sigma", value: 2 },
  { label: "Orisa", value: 3 },
];

describe("ChipGroup", () => {
  it("adds an unselected value on press", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<ChipGroup onChange={onChange} options={OPTIONS} values={[1]} />)
    );

    fireEvent.press(getByLabelText("Sigma"));

    expect(onChange).toHaveBeenCalledWith([1, 2]);
  });

  it("removes a selected value on press", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<ChipGroup onChange={onChange} options={OPTIONS} values={[1, 2]} />)
    );

    fireEvent.press(getByLabelText("Reinhardt"));

    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it("reflects selection state for assistive tech", () => {
    const { getByLabelText } = render(
      withTheme(<ChipGroup onChange={jest.fn()} options={OPTIONS} values={[2]} />)
    );

    expect(getByLabelText("Sigma").props.accessibilityState.checked).toBe(true);
    expect(getByLabelText("Reinhardt").props.accessibilityState.checked).toBe(false);
  });
});

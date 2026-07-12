import { fireEvent, render } from "@testing-library/react-native";
import { Counter } from "@/components/Counter/Counter";
import { withTheme } from "../test-utils";

describe("Counter", () => {
  it("increments by the step", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(withTheme(<Counter onChange={onChange} value={2} />));

    fireEvent.press(getByLabelText("Increase"));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("decrements by the step", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(withTheme(<Counter onChange={onChange} value={2} />));

    fireEvent.press(getByLabelText("Decrease"));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("does not decrement below the minimum", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(withTheme(<Counter min={0} onChange={onChange} value={0} />));

    fireEvent.press(getByLabelText("Decrease"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not increment above the maximum", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(withTheme(<Counter max={5} onChange={onChange} value={5} />));

    fireEvent.press(getByLabelText("Increase"));

    expect(onChange).not.toHaveBeenCalled();
  });
});

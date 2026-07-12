import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

import { Combobox } from "@/components/Combobox/Combobox";
import type { SelectOption } from "@/types/components";
import { withTheme } from "../test-utils";

const OPTIONS: SelectOption[] = [
  { label: "King's Row", value: 1 },
  { label: "Ilios", value: 2 },
  { label: "Numbani", value: 3 },
];

describe("Combobox", () => {
  it("shows the placeholder when nothing is selected", () => {
    const { getByText } = render(
      withTheme(
        <Combobox onChange={jest.fn()} options={OPTIONS} placeholder="Pick a map" value={null} />
      )
    );

    expect(getByText("Pick a map")).toBeTruthy();
  });

  it("shows the selected option label on the trigger", () => {
    const { getByText } = render(
      withTheme(<Combobox onChange={jest.fn()} options={OPTIONS} value={2} />)
    );

    expect(getByText("Ilios")).toBeTruthy();
  });

  it("selects an option and reports its value", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<Combobox label="Map" onChange={onChange} options={OPTIONS} value={null} />)
    );

    fireEvent.press(getByLabelText("Map"));
    fireEvent.press(getByLabelText("Numbani"));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("filters options by the search query", () => {
    const { getByLabelText, getByPlaceholderText, queryByLabelText } = render(
      withTheme(
        <Combobox
          label="Map"
          onChange={jest.fn()}
          options={OPTIONS}
          searchPlaceholder="Search maps"
          value={null}
        />
      )
    );

    fireEvent.press(getByLabelText("Map"));
    fireEvent.changeText(getByPlaceholderText("Search maps"), "ili");

    expect(getByLabelText("Ilios")).toBeTruthy();
    expect(queryByLabelText("King's Row")).toBeNull();
  });

  it("clears the selection when clearable", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      withTheme(<Combobox clearable onChange={onChange} options={OPTIONS} value={1} />)
    );

    fireEvent.press(getByLabelText("Clear selection"));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});

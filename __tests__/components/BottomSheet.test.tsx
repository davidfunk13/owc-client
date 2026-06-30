import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { withTheme } from "../test-utils";

describe("BottomSheet", () => {
  it("renders title and children when visible", () => {
    const { getByText } = render(
      withTheme(
        <BottomSheet visible onClose={jest.fn()} title="Filter">
          <Text>Filter options</Text>
        </BottomSheet>
      )
    );

    expect(getByText("Filter")).toBeTruthy();
    expect(getByText("Filter options")).toBeTruthy();
  });

  it("calls onClose when the close icon is pressed", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <BottomSheet visible onClose={onClose} title="Filter">
          <Text>Body</Text>
        </BottomSheet>
      )
    );

    fireEvent.press(getByLabelText("Close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when the backdrop is tapped", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <BottomSheet visible onClose={onClose}>
          <Text>Body</Text>
        </BottomSheet>
      )
    );

    fireEvent.press(getByLabelText("Close bottom sheet"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders a drag handle", () => {
    const { getByText } = render(
      withTheme(
        <BottomSheet visible onClose={jest.fn()}>
          <Text>Body</Text>
        </BottomSheet>
      )
    );

    expect(getByText("Body")).toBeTruthy();
  });
});

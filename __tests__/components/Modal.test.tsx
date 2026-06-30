import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Modal } from "../../components/Modal/Modal";
import { withTheme } from "../test-utils";

describe("Modal", () => {
  it("renders the title and children when visible", () => {
    const { getByText } = render(
      withTheme(
        <Modal visible onClose={jest.fn()} title="Confirm">
          <Text>Body content</Text>
        </Modal>
      )
    );

    expect(getByText("Confirm")).toBeTruthy();
    expect(getByText("Body content")).toBeTruthy();
  });

  it("calls onClose when the close icon is pressed", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <Modal visible onClose={onClose} title="Confirm">
          <Text>Body</Text>
        </Modal>
      )
    );

    fireEvent.press(getByLabelText("Close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when the backdrop is tapped", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <Modal visible onClose={onClose}>
          <Text>Body</Text>
        </Modal>
      )
    );

    fireEvent.press(getByLabelText("Close modal"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders without a title gracefully", () => {
    const { getByText } = render(
      withTheme(
        <Modal visible onClose={jest.fn()}>
          <Text>Just body</Text>
        </Modal>
      )
    );

    expect(getByText("Just body")).toBeTruthy();
  });
});

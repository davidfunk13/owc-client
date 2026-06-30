import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ListItem } from "../../components/ListItem/ListItem";
import { withTheme } from "../test-utils";

describe("ListItem", () => {
  it("renders the title", () => {
    const { getByText } = render(withTheme(<ListItem title="Profile" />));

    expect(getByText("Profile")).toBeTruthy();
  });

  it("renders the optional description", () => {
    const { getByText } = render(
      withTheme(<ListItem title="Profile" description="Your account" />)
    );

    expect(getByText("Your account")).toBeTruthy();
  });

  it("renders leading and trailing nodes when provided", () => {
    const { getByText } = render(
      withTheme(<ListItem title="Profile" leading={<Text>L</Text>} trailing={<Text>R</Text>} />)
    );

    expect(getByText("L")).toBeTruthy();
    expect(getByText("R")).toBeTruthy();
  });

  it("becomes a button when onPress is provided and triggers it on tap", () => {
    const onPress = jest.fn();
    const { getByRole } = render(withTheme(<ListItem title="Settings" onPress={onPress} />));

    fireEvent.press(getByRole("button", { name: "Settings" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("renders a non-pressable row when onPress is omitted", () => {
    const { queryByRole, getByText } = render(withTheme(<ListItem title="Static row" />));

    expect(getByText("Static row")).toBeTruthy();
    expect(queryByRole("button")).toBeNull();
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      withTheme(<ListItem title="Settings" onPress={onPress} disabled />)
    );

    fireEvent.press(getByRole("button", { name: "Settings" }));

    expect(onPress).not.toHaveBeenCalled();
  });
});

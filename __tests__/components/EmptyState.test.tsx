import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { withTheme } from "../test-utils";

describe("EmptyState", () => {
  it("renders the title", () => {
    const { getByText } = render(withTheme(<EmptyState title="No games yet" />));

    expect(getByText("No games yet")).toBeTruthy();
  });

  it("renders the optional description when provided", () => {
    const { getByText } = render(
      withTheme(<EmptyState title="Empty" description="Track your first game to populate this." />)
    );

    expect(getByText("Track your first game to populate this.")).toBeTruthy();
  });

  it("does not render a description block when omitted", () => {
    const { queryByText } = render(withTheme(<EmptyState title="Empty" />));

    expect(queryByText(/track/i)).toBeNull();
  });

  it("renders the optional action node and forwards interaction", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      withTheme(
        <EmptyState title="Empty" action={<Button title="Start tracking" onPress={onPress} />} />
      )
    );

    fireEvent.press(getByRole("button", { name: "Start tracking" }));
    expect(onPress).toHaveBeenCalled();
  });
});

import { render } from "@testing-library/react-native";
import { Avatar } from "../../components/Avatar/Avatar";
import { withTheme } from "../test-utils";

describe("Avatar", () => {
  it("renders the image when source is provided", () => {
    const { getByLabelText, queryByLabelText } = render(
      withTheme(<Avatar source="https://example.com/me.jpg" fallback="Dave" />)
    );

    expect(getByLabelText("Avatar")).toBeTruthy();
    expect(queryByLabelText("Avatar placeholder")).toBeNull();
  });

  it("renders a placeholder with the first letter of fallback when no source", () => {
    const { getByLabelText, getByText } = render(withTheme(<Avatar fallback="dave" />));

    expect(getByLabelText("Avatar placeholder")).toBeTruthy();
    expect(getByText("D")).toBeTruthy();
  });

  it("falls back to '?' when neither source nor fallback is provided", () => {
    const { getByText } = render(withTheme(<Avatar />));

    expect(getByText("?")).toBeTruthy();
  });
});

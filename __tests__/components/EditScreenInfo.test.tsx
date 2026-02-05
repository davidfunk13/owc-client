import { render } from "@testing-library/react-native";
import { EditScreenInfo } from "../../components/EditScreenInfo/EditScreenInfo";
import { withTheme } from "../test-utils";

describe("EditScreenInfo", () => {
  it("renders with path", () => {
    const { getByText } = render(withTheme(<EditScreenInfo path="app/index.tsx" />));

    expect(getByText("app/index.tsx")).toBeTruthy();
  });

  it("displays instruction text", () => {
    const { getByText } = render(withTheme(<EditScreenInfo path="test/path.tsx" />));

    expect(getByText("Open up the code for this screen:")).toBeTruthy();
    expect(
      getByText("Change any of the text, save the file, and your app will automatically update.")
    ).toBeTruthy();
  });

  it("displays help link", () => {
    const { getByText } = render(withTheme(<EditScreenInfo path="test.tsx" />));

    expect(
      getByText("Tap here if your app doesn't automatically update after making changes")
    ).toBeTruthy();
  });
});

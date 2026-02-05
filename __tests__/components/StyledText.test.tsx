import { render } from "@testing-library/react-native";
import { MonoText } from "../../components/StyledText/StyledText";
import { withTheme } from "../test-utils";

describe("MonoText", () => {
  it("renders text content", () => {
    const { getByText } = render(withTheme(<MonoText>Monospace text</MonoText>));

    expect(getByText("Monospace text")).toBeTruthy();
  });

  it("applies monospace font family", () => {
    const { getByText } = render(withTheme(<MonoText>Code text</MonoText>));

    const textElement = getByText("Code text");
    const flatStyle = textElement.props.style.flat(2);
    const hasFontFamily = flatStyle.some(
      (s: Record<string, unknown> | undefined) => s?.fontFamily === "SpaceMono"
    );
    expect(hasFontFamily).toBe(true);
  });

  it("accepts additional style props", () => {
    const { getByText } = render(
      withTheme(<MonoText style={{ fontSize: 14 }}>Styled mono</MonoText>)
    );

    expect(getByText("Styled mono")).toBeTruthy();
  });

  it("passes through theme color props", () => {
    const { getByText } = render(
      withTheme(
        <MonoText lightColor="#000" darkColor="#fff">
          Themed mono
        </MonoText>
      )
    );

    expect(getByText("Themed mono")).toBeTruthy();
  });
});

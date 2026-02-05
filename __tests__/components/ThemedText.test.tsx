import { render } from "@testing-library/react-native";
import { ThemedText } from "../../components/ThemedText/ThemedText";
import { withTheme } from "../test-utils";

describe("ThemedText", () => {
  it("renders text content", () => {
    const { getByText } = render(withTheme(<ThemedText>Hello World</ThemedText>));

    expect(getByText("Hello World")).toBeTruthy();
  });

  it("renders with body variant by default", () => {
    const { getByText } = render(withTheme(<ThemedText>Body text</ThemedText>));

    expect(getByText("Body text")).toBeTruthy();
  });

  it("renders with title variant", () => {
    const { getByText } = render(withTheme(<ThemedText variant="title">Title</ThemedText>));

    expect(getByText("Title")).toBeTruthy();
  });

  it("renders with heading variant", () => {
    const { getByText } = render(withTheme(<ThemedText variant="heading">Heading</ThemedText>));

    expect(getByText("Heading")).toBeTruthy();
  });

  it("renders with stat variant", () => {
    const { getByText } = render(withTheme(<ThemedText variant="stat">42</ThemedText>));

    expect(getByText("42")).toBeTruthy();
  });

  it("renders with secondary variant", () => {
    const { getByText } = render(
      withTheme(<ThemedText variant="secondary">Secondary text</ThemedText>)
    );

    expect(getByText("Secondary text")).toBeTruthy();
  });

  it("renders with label variant", () => {
    const { getByText } = render(withTheme(<ThemedText variant="label">Label</ThemedText>));

    expect(getByText("Label")).toBeTruthy();
  });

  it("renders with hint variant", () => {
    const { getByText } = render(withTheme(<ThemedText variant="hint">Hint text</ThemedText>));

    expect(getByText("Hint text")).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { marginBottom: 10 };
    const { getByText } = render(
      withTheme(<ThemedText style={customStyle}>Styled text</ThemedText>)
    );

    expect(getByText("Styled text")).toBeTruthy();
  });
});

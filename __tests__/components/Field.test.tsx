import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Field } from "@/components/Field/Field";
import { withTheme } from "../test-utils";

describe("Field", () => {
  it("renders the label and children", () => {
    const { getByText } = render(
      withTheme(
        <Field label="Role">
          <Text>content</Text>
        </Field>
      )
    );

    expect(getByText("Role")).toBeTruthy();
    expect(getByText("content")).toBeTruthy();
  });

  it("marks required fields", () => {
    const { getByText } = render(
      withTheme(
        <Field label="Result" required>
          <Text>x</Text>
        </Field>
      )
    );

    expect(getByText("Result *")).toBeTruthy();
  });
});

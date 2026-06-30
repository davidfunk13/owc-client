import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const { Pressable } = require("react-native");
  return {
    Stack: { Screen: () => null },
    Link: ({ children, ...props }: { children: unknown; [key: string]: unknown }) => (
      <Pressable {...props}>{children}</Pressable>
    ),
    router: { replace: jest.fn() },
  };
});

import NotFoundScreen from "@/app/+not-found";
import { withTheme } from "../test-utils";

describe("NotFoundScreen", () => {
  it("renders the not-found message", () => {
    const { getByText } = render(withTheme(<NotFoundScreen />));

    expect(getByText("This screen doesn't exist.")).toBeTruthy();
  });

  it("renders a link back to home", () => {
    const { getByText } = render(withTheme(<NotFoundScreen />));

    expect(getByText("Go to home screen!")).toBeTruthy();
  });
});

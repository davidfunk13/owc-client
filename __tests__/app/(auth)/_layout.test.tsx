import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  const StackMock = (props: Record<string, unknown>) => <View {...props} testID="auth-stack" />;
  return { Stack: StackMock };
});

import AuthLayout from "@/app/(auth)/_layout";

describe("AuthLayout", () => {
  it("renders a Stack navigator with headers hidden", () => {
    const { getByTestId } = render(<AuthLayout />);
    const stack = getByTestId("auth-stack");
    expect(stack.props.screenOptions).toEqual({ headerShown: false });
  });
});

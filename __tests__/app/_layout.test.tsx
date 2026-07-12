import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react-native";

let mockUseFontsValue: [boolean, Error | null] = [true, null];
const mockHideAsync = jest.fn().mockResolvedValue(undefined);

jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => mockUseFontsValue),
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: () => mockHideAsync(),
}));

jest.mock("expo-status-bar", () => {
  const { View } = require("react-native");
  return {
    StatusBar: (props: Record<string, unknown>) => <View testID="status-bar" {...props} />,
  };
});

jest.mock("react-native-safe-area-context", () => {
  const ReactRuntime = require("react");
  return {
    SafeAreaProvider: ({ children }: { children: ReactNode }) =>
      ReactRuntime.createElement(ReactRuntime.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock("expo-router", () => {
  const { View } = require("react-native");
  const StackMock = ({
    children,
    screenOptions,
  }: {
    children: ReactNode;
    screenOptions?: unknown;
  }): ReactElement => (
    <View testID="root-stack" data-screen-options={JSON.stringify(screenOptions)}>
      {children}
    </View>
  );
  StackMock.Screen = ({ name }: { name: string }) => <View testID={`stack-screen-${name}`} />;
  StackMock.Protected = ({ children, guard }: { children: ReactNode; guard: boolean }) =>
    guard ? <View testID="stack-protected">{children}</View> : null;
  return {
    Stack: StackMock,
    ErrorBoundary: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock("@/contexts/AuthContext", () => {
  const ReactRuntime = require("react");
  return {
    AuthProvider: ({ children }: { children: ReactNode }) =>
      ReactRuntime.createElement(ReactRuntime.Fragment, null, children),
    useAuth: jest.fn(),
  };
});

jest.mock("@/contexts/ThemeContext", () => {
  const ReactRuntime = require("react");
  const actual = jest.requireActual("@/contexts/ThemeContext");
  return {
    ...actual,
    ThemeProvider: ({ children }: { children: ReactNode }) =>
      ReactRuntime.createElement(ReactRuntime.Fragment, null, children),
    useTheme: jest.fn(),
  };
});

jest.mock("@/contexts/ToastContext", () => {
  const ReactRuntime = require("react");
  return {
    ToastProvider: ({ children }: { children: ReactNode }) =>
      ReactRuntime.createElement(ReactRuntime.Fragment, null, children),
  };
});

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme } from "@/constants/theme";
import RootLayout from "@/app/_layout";

const mockUseAuth = useAuth as jest.Mock;
const mockUseTheme = useTheme as jest.Mock;

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFontsValue = [true, null];
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    mockUseTheme.mockReturnValue({ theme: darkTheme, isDark: true });
  });

  it("returns null while fonts are loading", () => {
    mockUseFontsValue = [false, null];

    const { toJSON } = render(<RootLayout />);

    expect(toJSON()).toBeNull();
  });

  it("renders the StatusBar at the root once fonts are loaded", () => {
    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("status-bar")).toBeTruthy();
  });

  it("hides the splash screen once fonts have loaded", async () => {
    render(<RootLayout />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockHideAsync).toHaveBeenCalled();
  });

  it("renders the auth stack when the user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    const { queryByTestId } = render(<RootLayout />);

    expect(queryByTestId("stack-screen-(auth)")).toBeTruthy();
    expect(queryByTestId("stack-screen-(tabs)")).toBeNull();
  });

  it("renders the tabs stack when the user is authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    const { queryByTestId } = render(<RootLayout />);

    expect(queryByTestId("stack-screen-(tabs)")).toBeTruthy();
    expect(queryByTestId("stack-screen-(auth)")).toBeNull();
  });

  it("shows a full-screen loading indicator while auth is resolving", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    const { UNSAFE_root, queryByTestId } = render(<RootLayout />);

    expect(UNSAFE_root.findAllByType("ActivityIndicator" as never).length).toBeGreaterThan(0);
    expect(queryByTestId("root-stack")).toBeNull();
  });

  it("throws when useFonts surfaces an error", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockUseFontsValue = [true, new Error("Font load failed")];

    expect(() => render(<RootLayout />)).toThrow("Font load failed");
    consoleSpy.mockRestore();
  });
});

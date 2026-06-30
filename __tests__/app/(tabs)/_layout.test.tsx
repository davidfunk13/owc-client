import type { ReactElement } from "react";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

interface DrawerProps {
  drawerContent: (props: Record<string, unknown>) => ReactElement;
  screenOptions?: Record<string, unknown>;
  children?: ReactElement;
}

interface CapturedScreen {
  name: string;
  options: Record<string, unknown>;
}

let mockLastDrawerProps: DrawerProps | null = null;
let mockCapturedScreens: CapturedScreen[] = [];

jest.mock("expo-router/drawer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Drawer: Object.assign(
      ({ drawerContent, screenOptions, children }: DrawerProps) => {
        mockLastDrawerProps = { drawerContent, screenOptions };
        const content = drawerContent({
          state: { index: 0, routeNames: [], routes: [] },
          navigation: {},
          descriptors: {},
        });
        return React.createElement(View, { testID: "drawer-root" }, content, children ?? null);
      },
      {
        Screen: ({ name, options }: { name: string; options: Record<string, unknown> }) => {
          mockCapturedScreens.push({ name, options });
          return null;
        },
      }
    ),
    DrawerContentScrollView: ({ children, ...props }: { children: ReactElement }) =>
      React.createElement(View, { ...props, testID: "drawer-scroll" }, children),
    DrawerItemList: () => React.createElement(View, { testID: "drawer-item-list" }),
  };
});

import { useAuth } from "@/contexts/AuthContext";
import TabsLayout from "@/app/(tabs)/_layout";
import { withTheme } from "../../test-utils";

const mockUseAuth = useAuth as jest.Mock;

const setWindowWidth = (width: number): jest.SpyInstance => {
  const ReactNative = require("react-native");
  return jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
    width,
    height: 800,
    scale: 1,
    fontScale: 1,
  });
};

describe("TabsLayout (drawer)", () => {
  let dimensionsSpy: jest.SpyInstance | null = null;

  beforeEach(() => {
    mockLastDrawerProps = null;
    mockCapturedScreens = [];
    mockUseAuth.mockReturnValue({ logout: jest.fn().mockResolvedValue(undefined) });
    dimensionsSpy = setWindowWidth(375);
  });

  afterEach(() => {
    dimensionsSpy?.mockRestore();
  });

  it("uses drawerType 'front' on small viewports", () => {
    dimensionsSpy?.mockRestore();
    dimensionsSpy = setWindowWidth(800);

    render(withTheme(<TabsLayout />));

    expect(mockLastDrawerProps?.screenOptions?.drawerType).toBe("front");
  });

  it("uses drawerType 'permanent' at 1024px and above", () => {
    dimensionsSpy?.mockRestore();
    dimensionsSpy = setWindowWidth(1024);

    render(withTheme(<TabsLayout />));

    expect(mockLastDrawerProps?.screenOptions?.drawerType).toBe("permanent");
  });

  it("renders the drawer-footer Sign out button with accessibility props", () => {
    const { getByRole } = render(withTheme(<TabsLayout />));

    const button = getByRole("button", { name: "Sign out" });
    expect(button).toBeTruthy();
  });

  it("calls logout when the Sign out button is pressed", () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ logout });

    const { getByRole } = render(withTheme(<TabsLayout />));

    fireEvent.press(getByRole("button", { name: "Sign out" }));

    expect(logout).toHaveBeenCalled();
  });

  it("logs an error when logout rejects", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockUseAuth.mockReturnValue({ logout: jest.fn().mockRejectedValue(new Error("Network")) });

    const { getByRole } = render(withTheme(<TabsLayout />));
    fireEvent.press(getByRole("button", { name: "Sign out" }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleSpy).toHaveBeenCalledWith("Logout failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("registers all four drawer screens with titles and icons", () => {
    render(withTheme(<TabsLayout />));

    const names = mockCapturedScreens.map((s) => s.name);
    expect(names).toEqual(["index", "stats", "profile", "settings"]);

    const titles = mockCapturedScreens.map((s) => s.options.title);
    expect(titles).toEqual(["Home", "Stats", "Profile", "Settings"]);

    mockCapturedScreens.forEach((screen) => {
      const drawerIcon = screen.options.drawerIcon as (args: {
        color: string;
        size: number;
        focused: boolean;
      }) => ReactElement;
      const rendered = drawerIcon({ color: "red", size: 24, focused: false });
      const { unmount } = render(withTheme(rendered));
      unmount();
    });
  });

  it("renders a header-right Sign out button that calls logout when pressed", () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ logout });

    render(withTheme(<TabsLayout />));

    const headerRight = mockLastDrawerProps?.screenOptions?.headerRight as
      (() => ReactElement) | undefined;
    expect(headerRight).toBeInstanceOf(Function);
    if (!headerRight) {
      throw new Error("headerRight not provided");
    }

    const { getByRole, unmount } = render(withTheme(headerRight()));
    const button = getByRole("button", { name: "Sign out" });
    fireEvent.press(button);
    expect(logout).toHaveBeenCalled();
    unmount();
  });

  it("logs an error when the header-right Sign out logout rejects", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockUseAuth.mockReturnValue({ logout: jest.fn().mockRejectedValue(new Error("Network")) });

    render(withTheme(<TabsLayout />));

    const headerRight = mockLastDrawerProps?.screenOptions?.headerRight as
      (() => ReactElement) | undefined;
    if (!headerRight) {
      throw new Error("headerRight not provided");
    }
    const { getByRole, unmount } = render(withTheme(headerRight()));
    fireEvent.press(getByRole("button", { name: "Sign out" }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consoleSpy).toHaveBeenCalledWith("Logout failed:", expect.any(Error));
    unmount();
    consoleSpy.mockRestore();
  });
});

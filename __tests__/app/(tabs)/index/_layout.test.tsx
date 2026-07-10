import type { ReactElement } from "react";
import { render } from "@testing-library/react-native";

interface CapturedScreen {
  name: string;
  options: Record<string, unknown>;
}

let mockCapturedScreens: CapturedScreen[] = [];
let mockLastScreenOptions: Record<string, unknown> | undefined;
let mockLastInitialRouteName: string | undefined;

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");
  const TabsMock = ({
    children,
    screenOptions,
    initialRouteName,
  }: {
    children: ReactElement;
    screenOptions?: Record<string, unknown>;
    initialRouteName?: string;
  }) => {
    mockLastScreenOptions = screenOptions;
    mockLastInitialRouteName = initialRouteName;
    return React.createElement(View, { testID: "home-tabs" }, children);
  };
  TabsMock.Screen = ({ name, options }: { name: string; options: Record<string, unknown> }) => {
    mockCapturedScreens.push({ name, options });
    return null;
  };
  return {
    Tabs: TabsMock,
    router: { replace: jest.fn() },
  };
});

import HomeLayout from "@/app/(tabs)/index/_layout";
import { withTheme } from "../../../test-utils";

describe("HomeLayout (Home sub-tabs)", () => {
  beforeEach(() => {
    mockCapturedScreens = [];
    mockLastScreenOptions = undefined;
    mockLastInitialRouteName = undefined;
  });

  it("registers Overview, Recent, and Trends sub-tabs in order", () => {
    render(withTheme(<HomeLayout />));

    expect(mockCapturedScreens.map((s) => s.name)).toEqual(["overview", "recent", "trends"]);
    expect(mockCapturedScreens.map((s) => s.options.title)).toEqual([
      "Overview",
      "Recent",
      "Trends",
    ]);
  });

  it("uses overview as the initialRouteName so Home lands on the dashboard tab", () => {
    render(withTheme(<HomeLayout />));

    expect(mockLastInitialRouteName).toBe("overview");
  });

  it("hides the screen-level header (drawer header above is enough)", () => {
    render(withTheme(<HomeLayout />));

    expect(mockLastScreenOptions?.headerShown).toBe(false);
  });
});

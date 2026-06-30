import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@/contexts/ThemeContext", () => {
  const actual = jest.requireActual("@/contexts/ThemeContext");
  return { ...actual, useTheme: jest.fn() };
});

import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/constants/theme";
import SettingsScreen from "@/app/(tabs)/settings";
import { withTheme } from "../../test-utils";

const mockUseTheme = useTheme as jest.Mock;

describe("SettingsScreen", () => {
  it("renders the Appearance card with a Dark Mode toggle", () => {
    mockUseTheme.mockReturnValue({ theme: darkTheme, isDark: true, toggleTheme: jest.fn() });

    const { getByText } = render(withTheme(<SettingsScreen />));

    expect(getByText("Appearance")).toBeTruthy();
    expect(getByText("Dark Mode")).toBeTruthy();
  });

  it("calls toggleTheme when the Dark Mode switch is flipped", () => {
    const toggleTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: darkTheme, isDark: true, toggleTheme });

    const { UNSAFE_root } = render(withTheme(<SettingsScreen />));
    const switches = UNSAFE_root.findAllByType("RCTSwitch" as never);
    fireEvent(switches[0]!, "valueChange", false);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("reflects light mode when isDark is false", () => {
    mockUseTheme.mockReturnValue({ theme: lightTheme, isDark: false, toggleTheme: jest.fn() });

    const { UNSAFE_root } = render(withTheme(<SettingsScreen />));
    const switches = UNSAFE_root.findAllByType("RCTSwitch" as never);

    expect(switches[0]?.props.value).toBe(false);
  });
});

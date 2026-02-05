import { render } from "@testing-library/react-native";
import { Text, View } from "../../components/Themed/Themed";
import { withTheme } from "../test-utils";
import { darkTheme, lightTheme } from "../../constants/theme";

const mockUseTheme = jest.fn();

jest.mock("../../contexts/ThemeContext", () => ({
  ...jest.requireActual("../../contexts/ThemeContext"),
  useTheme: () => mockUseTheme(),
}));

describe("Themed components", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ theme: darkTheme, isDark: true, toggleTheme: jest.fn() });
  });

  describe("Text", () => {
    it("renders text content", () => {
      const { getByText } = render(withTheme(<Text>Themed text</Text>));

      expect(getByText("Themed text")).toBeTruthy();
    });

    it("uses darkColor when in dark mode", () => {
      const { getByText } = render(withTheme(<Text darkColor="#ff0000">Dark text</Text>));
      const element = getByText("Dark text");

      expect(element.props.style).toEqual(expect.arrayContaining([{ color: "#ff0000" }]));
    });

    it("uses theme color when darkColor not provided in dark mode", () => {
      const { getByText } = render(withTheme(<Text>Default dark</Text>));
      const element = getByText("Default dark");

      expect(element.props.style).toEqual(
        expect.arrayContaining([{ color: darkTheme.colors.text.primary }])
      );
    });

    it("uses lightColor when in light mode", () => {
      mockUseTheme.mockReturnValue({ theme: lightTheme, isDark: false, toggleTheme: jest.fn() });
      const { getByText } = render(withTheme(<Text lightColor="#00ff00">Light text</Text>));
      const element = getByText("Light text");

      expect(element.props.style).toEqual(expect.arrayContaining([{ color: "#00ff00" }]));
    });

    it("uses theme color when lightColor not provided in light mode", () => {
      mockUseTheme.mockReturnValue({ theme: lightTheme, isDark: false, toggleTheme: jest.fn() });
      const { getByText } = render(withTheme(<Text>Default light</Text>));
      const element = getByText("Default light");

      expect(element.props.style).toEqual(
        expect.arrayContaining([{ color: lightTheme.colors.text.primary }])
      );
    });

    it("applies custom style", () => {
      const { getByText } = render(withTheme(<Text style={{ fontSize: 20 }}>Styled text</Text>));

      expect(getByText("Styled text")).toBeTruthy();
    });
  });

  describe("View", () => {
    it("renders children", () => {
      const { getByText } = render(
        withTheme(
          <View>
            <Text>Child content</Text>
          </View>
        )
      );

      expect(getByText("Child content")).toBeTruthy();
    });

    it("uses darkColor when in dark mode", () => {
      const { getByTestId } = render(
        withTheme(
          <View darkColor="#1a1a1a" testID="themed-view">
            <Text>Dark view</Text>
          </View>
        )
      );
      const element = getByTestId("themed-view");

      expect(element.props.style).toEqual(expect.arrayContaining([{ backgroundColor: "#1a1a1a" }]));
    });

    it("uses theme background when darkColor not provided in dark mode", () => {
      const { getByTestId } = render(
        withTheme(
          <View testID="themed-view">
            <Text>Default dark</Text>
          </View>
        )
      );
      const element = getByTestId("themed-view");

      expect(element.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: darkTheme.colors.background.default }])
      );
    });

    it("uses lightColor when in light mode", () => {
      mockUseTheme.mockReturnValue({ theme: lightTheme, isDark: false, toggleTheme: jest.fn() });
      const { getByTestId } = render(
        withTheme(
          <View lightColor="#f0f0f0" testID="themed-view">
            <Text>Light view</Text>
          </View>
        )
      );
      const element = getByTestId("themed-view");

      expect(element.props.style).toEqual(expect.arrayContaining([{ backgroundColor: "#f0f0f0" }]));
    });

    it("uses theme background when lightColor not provided in light mode", () => {
      mockUseTheme.mockReturnValue({ theme: lightTheme, isDark: false, toggleTheme: jest.fn() });
      const { getByTestId } = render(
        withTheme(
          <View testID="themed-view">
            <Text>Default light</Text>
          </View>
        )
      );
      const element = getByTestId("themed-view");

      expect(element.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: lightTheme.colors.background.default }])
      );
    });

    it("applies custom style", () => {
      const { getByText } = render(
        withTheme(
          <View style={{ padding: 20 }}>
            <Text>Styled view</Text>
          </View>
        )
      );

      expect(getByText("Styled view")).toBeTruthy();
    });
  });
});

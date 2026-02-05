import { fireEvent, render } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink } from "../../components/ExternalLink/ExternalLink";

const mockWebBrowser = WebBrowser as jest.Mocked<typeof WebBrowser>;

describe("ExternalLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children", () => {
    const { getByText } = render(<ExternalLink href="https://example.com">Click me</ExternalLink>);

    expect(getByText("Click me")).toBeTruthy();
  });

  describe("on native platforms", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "ios");
    });

    it("opens browser when pressed", () => {
      const { getByText } = render(
        <ExternalLink href="https://example.com">External link</ExternalLink>
      );

      fireEvent.press(getByText("External link"));

      expect(mockWebBrowser.openBrowserAsync).toHaveBeenCalledWith("https://example.com");
    });
  });

  describe("on web platform", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "web");
    });

    it("does not call openBrowserAsync", () => {
      const { getByText } = render(
        <ExternalLink href="https://example.com">Web link</ExternalLink>
      );

      fireEvent.press(getByText("Web link"));

      expect(mockWebBrowser.openBrowserAsync).not.toHaveBeenCalled();
    });
  });
});

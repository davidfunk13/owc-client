import type { WebBrowserResultType as WebBrowserResultTypeEnum } from "expo-web-browser";
import * as WebBrowser from "expo-web-browser";
import { openAuthSession } from "../../lib/openAuthSession";

const { WebBrowserResultType } = jest.requireActual("expo-web-browser") as {
  WebBrowserResultType: typeof WebBrowserResultTypeEnum;
};

const mockWebBrowser = WebBrowser as jest.Mocked<typeof WebBrowser>;

describe("openAuthSession (native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens an auth session and returns the redirect URL on success", async () => {
    mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "owc://auth/callback?token=abc",
    });

    const result = await openAuthSession("https://auth.example.com/start");

    expect(mockWebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(
      "https://auth.example.com/start",
      "owc://auth/callback"
    );
    expect(result).toEqual({ url: "owc://auth/callback?token=abc" });
  });

  it("returns null url when the user dismisses the session", async () => {
    mockWebBrowser.openAuthSessionAsync.mockResolvedValue({ type: WebBrowserResultType.DISMISS });

    const result = await openAuthSession("https://auth.example.com/start");

    expect(result).toEqual({ url: null });
  });

  it("returns null url when success has no URL", async () => {
    mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "",
    });

    const result = await openAuthSession("https://auth.example.com/start");

    expect(result).toEqual({ url: null });
  });
});

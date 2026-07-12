import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  api: { exchangeCode: jest.fn() },
}));

jest.mock("@/lib/storage", () => ({
  storage: {
    getToken: jest.fn().mockResolvedValue(null),
    setToken: jest.fn(),
    removeToken: jest.fn().mockResolvedValue(undefined),
    getTheme: jest.fn().mockResolvedValue(null),
    setTheme: jest.fn().mockResolvedValue(undefined),
  },
}));

import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import AuthCallback from "@/app/auth/callback.web";
import { withTheme } from "../../test-utils";

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockExchangeCode = api.exchangeCode as jest.Mock;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe("AuthCallback (web)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedStorage.setToken.mockResolvedValue(undefined);
    Object.defineProperty(global, "window", {
      value: { location: { href: "" } },
      writable: true,
    });
  });

  it("exchanges the code, saves the token, and redirects home on success", async () => {
    mockUseLocalSearchParams.mockReturnValue({ code: "abc123" });
    mockExchangeCode.mockResolvedValue({ token: "exchanged-token" });

    render(withTheme(<AuthCallback />));

    await waitFor(() => {
      expect(mockExchangeCode).toHaveBeenCalledWith("abc123");
    });
    await waitFor(() => {
      expect(mockedStorage.setToken).toHaveBeenCalledWith("exchanged-token");
    });
    await waitFor(() => {
      expect(global.window.location.href).toBe("/");
    });
  });

  it("shows a failure state instead of silently bouncing when an error param is present", async () => {
    mockUseLocalSearchParams.mockReturnValue({ error: "access_denied" });

    const { findByText } = render(withTheme(<AuthCallback />));

    expect(await findByText("Sign-in failed")).toBeTruthy();
    expect(await findByText("Sign-in was cancelled or failed.")).toBeTruthy();
    expect(global.window.location.href).toBe("");
    expect(mockExchangeCode).not.toHaveBeenCalled();
    expect(mockedStorage.setToken).not.toHaveBeenCalled();
  });

  it("shows a failure state when no code is present", async () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { findByText } = render(withTheme(<AuthCallback />));

    expect(await findByText("Sign-in failed")).toBeTruthy();
    expect(mockExchangeCode).not.toHaveBeenCalled();
    expect(mockedStorage.setToken).not.toHaveBeenCalled();
  });

  it("shows the error and offers a way back when the exchange fails", async () => {
    mockUseLocalSearchParams.mockReturnValue({ code: "abc123" });
    mockExchangeCode.mockRejectedValue(new Error("Exchange error"));

    const { findByText, getByRole } = render(withTheme(<AuthCallback />));

    expect(await findByText("Sign-in failed")).toBeTruthy();
    expect(global.window.location.href).toBe("");

    fireEvent.press(getByRole("button", { name: "Back to sign in" }));
    expect(global.window.location.href).toBe("/");
  });
});

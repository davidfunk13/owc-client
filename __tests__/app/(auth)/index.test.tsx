import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/contexts/ToastContext", () => ({
  useToast: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import LoginScreen from "@/app/(auth)/index";
import { withTheme } from "../../test-utils";

const mockUseAuth = useAuth as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const show = jest.fn();

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ login: jest.fn().mockResolvedValue(undefined) });
    mockUseToast.mockReturnValue({ show, dismiss: jest.fn(), toasts: [] });
  });

  it("renders the OW2C title and subtitle", () => {
    const { getByText } = render(withTheme(<LoginScreen />));

    expect(getByText("OW2C")).toBeTruthy();
    expect(getByText("Overwatch 2 Stats Tracker")).toBeTruthy();
  });

  it("renders the Battle.net login button", () => {
    const { getByRole } = render(withTheme(<LoginScreen />));

    expect(getByRole("button", { name: "Login with Battle.net" })).toBeTruthy();
  });

  it("calls login when the button is pressed", async () => {
    const login = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ login });

    const { getByRole } = render(withTheme(<LoginScreen />));

    fireEvent.press(getByRole("button", { name: "Login with Battle.net" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
  });

  it("shows the loading indicator while logging in and clears it afterward", async () => {
    let resolveLogin: () => void = () => {};
    const login = jest.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        })
    );
    mockUseAuth.mockReturnValue({ login });

    const { getByRole, queryByRole, UNSAFE_root } = render(withTheme(<LoginScreen />));

    fireEvent.press(getByRole("button", { name: "Login with Battle.net" }));

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType("ActivityIndicator" as never).length).toBeGreaterThan(0);
    });

    resolveLogin();

    await waitFor(() => {
      expect(queryByRole("button", { name: "Login with Battle.net" })).not.toBeNull();
    });
  });

  it("surfaces an error toast when login fails", async () => {
    const login = jest.fn().mockRejectedValue(new Error("Browser error"));
    mockUseAuth.mockReturnValue({ login });

    const { getByRole } = render(withTheme(<LoginScreen />));

    fireEvent.press(getByRole("button", { name: "Login with Battle.net" }));

    await waitFor(() => {
      expect(show).toHaveBeenCalledWith({ message: "Something went wrong", variant: "error" });
    });
  });
});

import { render, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import AuthCallback from "@/app/auth/callback";
import { withTheme } from "../../test-utils";

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockRouter = router as jest.Mocked<typeof router>;
const mockUseAuth = useAuth as jest.Mock;
const completeAuth = jest.fn();

describe("AuthCallback (native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    completeAuth.mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ completeAuth });
  });

  it("completes auth with the code and lets the guard navigate on success", async () => {
    mockUseLocalSearchParams.mockReturnValue({ code: "abc123" });

    render(withTheme(<AuthCallback />));

    await waitFor(() => {
      expect(completeAuth).toHaveBeenCalledWith("abc123");
    });
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("routes back to auth when an error param is present", async () => {
    mockUseLocalSearchParams.mockReturnValue({ error: "access_denied" });

    render(withTheme(<AuthCallback />));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)");
    });
    expect(completeAuth).not.toHaveBeenCalled();
  });

  it("routes back to auth when no code is present", async () => {
    mockUseLocalSearchParams.mockReturnValue({});

    render(withTheme(<AuthCallback />));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)");
    });
    expect(completeAuth).not.toHaveBeenCalled();
  });

  it("logs an error and routes to auth when completeAuth throws", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockUseLocalSearchParams.mockReturnValue({ code: "abc123" });
    completeAuth.mockRejectedValue(new Error("Auth error"));

    render(withTheme(<AuthCallback />));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Auth callback failed:", expect.any(Error));
    });
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)");
    });
    consoleSpy.mockRestore();
  });
});

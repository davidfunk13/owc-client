import { renderHook } from "@testing-library/react-native";
import { useAuthDeepLink } from "../../hooks/useAuthDeepLink.web";

describe("useAuthDeepLink (web)", () => {
  it("is a no-op so the /auth/callback route can own the single-use code", () => {
    const callback = jest.fn();
    Object.defineProperty(global, "window", {
      value: { location: { search: "?code=should-be-ignored" } },
      writable: true,
    });

    renderHook(() => useAuthDeepLink(callback));

    expect(callback).not.toHaveBeenCalled();
  });
});

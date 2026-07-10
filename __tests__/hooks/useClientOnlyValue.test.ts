import { renderHook } from "@testing-library/react-native";
import { useClientOnlyValue } from "../../hooks/useClientOnlyValue";

describe("useClientOnlyValue (native)", () => {
  it("returns client value immediately on native", () => {
    const { result } = renderHook(() => useClientOnlyValue("server", "client"));

    expect(result.current).toBe("client");
  });
});

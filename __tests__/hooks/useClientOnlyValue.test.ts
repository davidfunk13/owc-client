import { renderHook } from "@testing-library/react-native";
import { useClientOnlyValue } from "../../hooks/useClientOnlyValue";

describe("useClientOnlyValue (native)", () => {
  it("returns client value immediately on native", () => {
    const { result } = renderHook(() => useClientOnlyValue("server", "client"));

    expect(result.current).toBe("client");
  });

  it("works with different types", () => {
    const { result: boolResult } = renderHook(() => useClientOnlyValue(false, true));
    expect(boolResult.current).toBe(true);

    const { result: numResult } = renderHook(() => useClientOnlyValue(0, 42));
    expect(numResult.current).toBe(42);

    const { result: objResult } = renderHook(() =>
      useClientOnlyValue({ server: true }, { client: true })
    );
    expect(objResult.current).toEqual({ client: true });
  });
});

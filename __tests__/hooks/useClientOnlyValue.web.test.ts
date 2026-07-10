import { renderHook, waitFor } from "@testing-library/react-native";
import { useClientOnlyValue } from "../../hooks/useClientOnlyValue.web";

describe("useClientOnlyValue (web)", () => {
  it("returns the client value after the initial effect runs", () => {
    const { result } = renderHook(() => useClientOnlyValue("server", "client"));

    expect(result.current).toBe("client");
  });

  it("updates when client value changes", async () => {
    const { result, rerender } = renderHook(
      (props: { server: string; client: string }) => useClientOnlyValue(props.server, props.client),
      { initialProps: { server: "server1", client: "client1" } }
    );

    await waitFor(() => {
      expect(result.current).toBe("client1");
    });

    rerender({ server: "server2", client: "client2" });

    await waitFor(() => {
      expect(result.current).toBe("client2");
    });
  });
});

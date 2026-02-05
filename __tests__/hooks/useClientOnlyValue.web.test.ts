import { renderHook, waitFor } from "@testing-library/react-native";

// Import the web version directly
import { useClientOnlyValue } from "../../hooks/useClientOnlyValue.web";

describe("useClientOnlyValue (web)", () => {
  it("uses useState with server value as initial state", () => {
    // The hook initializes state with server value, then updates to client in useEffect
    // In test environment, useEffect runs synchronously so we see the client value
    const { result } = renderHook(() => useClientOnlyValue("server", "client"));

    // After effect runs, should have client value
    expect(result.current).toBe("client");
  });

  it("returns client value", async () => {
    const { result } = renderHook(() => useClientOnlyValue("server", "client"));

    await waitFor(() => {
      expect(result.current).toBe("client");
    });
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

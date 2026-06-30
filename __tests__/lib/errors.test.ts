import { defaultErrorMessage, isApiError, isNetworkError } from "@/lib/errors";
import { ApiError, NetworkError } from "@/types/errors";

describe("errors lib", () => {
  describe("isApiError", () => {
    it("identifies ApiError instances", () => {
      expect(isApiError(new ApiError(404, "Not Found", "missing"))).toBe(true);
    });

    it("rejects non-ApiError values", () => {
      expect(isApiError(new NetworkError("offline"))).toBe(false);
      expect(isApiError(new Error("plain"))).toBe(false);
      expect(isApiError(null)).toBe(false);
    });
  });

  describe("isNetworkError", () => {
    it("identifies NetworkError instances", () => {
      expect(isNetworkError(new NetworkError("offline"))).toBe(true);
    });

    it("rejects non-NetworkError values", () => {
      expect(isNetworkError(new ApiError(500, "Server"))).toBe(false);
      expect(isNetworkError(new Error("plain"))).toBe(false);
    });
  });

  describe("defaultErrorMessage", () => {
    it("returns ApiError.message", () => {
      expect(defaultErrorMessage(new ApiError(500, "Server", "boom"))).toBe("boom");
    });

    it("returns NetworkError.message", () => {
      expect(defaultErrorMessage(new NetworkError("offline"))).toBe("offline");
    });

    it("returns a generic message for other Error shapes", () => {
      expect(defaultErrorMessage(new Error("anything"))).toBe("Something went wrong");
    });
  });
});

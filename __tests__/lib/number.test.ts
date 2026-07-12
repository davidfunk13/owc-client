import { parseNumeric } from "@/lib/number";

describe("parseNumeric", () => {
  it("parses a numeric string", () => {
    expect(parseNumeric("3200")).toBe(3200);
  });

  it("returns null for empty or non-numeric input", () => {
    expect(parseNumeric("")).toBeNull();
    expect(parseNumeric("abc")).toBeNull();
  });
});

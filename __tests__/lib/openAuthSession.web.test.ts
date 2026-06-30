import { openAuthSession } from "../../lib/openAuthSession.web";

describe("openAuthSession (web)", () => {
  beforeEach(() => {
    Object.defineProperty(global, "window", {
      value: {
        location: { href: "" },
      },
      writable: true,
    });
  });

  it("redirects window.location.href to the auth URL", async () => {
    const result = await openAuthSession("https://auth.example.com/start");

    expect(global.window.location.href).toBe("https://auth.example.com/start");
    expect(result).toEqual({ url: null });
  });
});

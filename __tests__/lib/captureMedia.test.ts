import { buildImageMedia, buildVideoMedia } from "@/lib/captureMedia";

describe("captureMedia", () => {
  it("builds image media with the default mime type", () => {
    const media = buildImageMedia("file://a.jpg", 100, 50);
    expect(media).toMatchObject({
      kind: "image",
      uri: "file://a.jpg",
      width: 100,
      height: 50,
      mimeType: "image/jpeg",
    });
    expect(typeof media.capturedAt).toBe("number");
  });

  it("builds image media with an explicit mime type", () => {
    expect(buildImageMedia("u", 1, 2, "image/png").mimeType).toBe("image/png");
  });

  it("builds video media with a duration", () => {
    expect(buildVideoMedia("file://v.mp4", 200, 100, "video/webm", 4200)).toMatchObject({
      kind: "video",
      uri: "file://v.mp4",
      width: 200,
      height: 100,
      mimeType: "video/webm",
      durationMs: 4200,
    });
  });

  it("builds video media with the default mime type", () => {
    expect(buildVideoMedia("u", 0, 0).mimeType).toBe("video/mp4");
  });
});

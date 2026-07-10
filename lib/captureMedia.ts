import type { CapturedMedia } from "@/types/capture";

export function buildImageMedia(
  uri: string,
  width: number,
  height: number,
  mimeType = "image/jpeg"
): CapturedMedia {
  return { kind: "image", uri, width, height, mimeType, capturedAt: Date.now() };
}

export function buildVideoMedia(
  uri: string,
  width: number,
  height: number,
  mimeType = "video/mp4",
  durationMs?: number
): CapturedMedia {
  return { kind: "video", uri, width, height, mimeType, durationMs, capturedAt: Date.now() };
}

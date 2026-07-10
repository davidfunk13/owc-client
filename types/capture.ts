import type { RefObject } from "react";

export type CaptureMode = "still" | "burst" | "video";
export type CaptureSource = "camera" | "gallery" | "screen";
export type CaptureFacing = "back" | "front";
export type CaptureStatus = "idle" | "preview" | "recording" | "unsupported";
export type CapturePermissionState = "undetermined" | "granted" | "denied";
export type CaptureErrorCode = "permission" | "unsupported" | "capture";

export interface CapturedMedia {
  kind: "image" | "video";
  uri: string;
  width: number;
  height: number;
  mimeType: string;
  durationMs?: number;
  capturedAt: number;
}

export interface CameraHandle {
  takePictureAsync(options?: {
    quality?: number;
  }): Promise<{ uri: string; width: number; height: number } | undefined>;
  recordAsync(options?: { maxDuration?: number }): Promise<{ uri: string } | undefined>;
  stopRecording(): void;
}

export type CapturePreviewBinding =
  | {
      kind: "camera";
      ref: RefObject<CameraHandle | null>;
      facing: CaptureFacing;
      cameraMode: "picture" | "video";
      active: boolean;
    }
  | { kind: "stream"; stream: MediaStream | null }
  | { kind: "none" };

export interface CaptureOptions {
  mode?: CaptureMode;
  source?: CaptureSource;
  burstIntervalMs?: number;
  onCapture: (media: CapturedMedia) => void;
  onError?: (error: CaptureError) => void;
}

export interface CaptureController {
  status: CaptureStatus;
  permission: CapturePermissionState;
  isCapturing: boolean;
  requestPermission: () => Promise<void>;
  captureStill: () => Promise<void>;
  startVideo: () => Promise<void>;
  stopVideo: () => Promise<void>;
  pickFromGallery?: () => Promise<void>;
  preview: CapturePreviewBinding;
}

export interface CaptureProps extends CaptureOptions {
  onClose?: () => void;
}

export interface CapturePreviewProps {
  binding: CapturePreviewBinding;
}

export interface CaptureControlsProps {
  controller: CaptureController;
  mode: CaptureMode;
  source: CaptureSource;
  onClose?: () => void;
}

export class CaptureError extends Error {
  code: CaptureErrorCode;

  constructor(code: CaptureErrorCode, message?: string) {
    super(message ?? code);
    this.name = "CaptureError";
    this.code = code;
  }
}

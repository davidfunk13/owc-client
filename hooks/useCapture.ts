import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { buildImageMedia, buildVideoMedia } from "@/lib/captureMedia";
import { CaptureError } from "@/types/capture";
import type {
  CameraHandle,
  CaptureController,
  CaptureOptions,
  CapturePermissionState,
  CapturePreviewBinding,
  CaptureStatus,
} from "@/types/capture";

function toPermissionState(granted: boolean | undefined): CapturePermissionState {
  if (granted === undefined) {
    return "undetermined";
  }
  if (granted) {
    return "granted";
  }
  return "denied";
}

export function useCapture(options: CaptureOptions): CaptureController {
  const {
    mode = "still",
    source = "camera",
    burstIntervalMs = 3000,
    onCapture,
    onError = () => undefined,
  } = options;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [, requestMicrophonePermission] = useMicrophonePermissions();

  const cameraRef = useRef<CameraHandle | null>(null);
  const capturingRef = useRef(false);
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [isCapturing, setIsCapturing] = useState(false);

  const permission = toPermissionState(cameraPermission?.granted);

  const requestPermission = useCallback(async (): Promise<void> => {
    await requestCameraPermission();
  }, [requestCameraPermission]);

  const captureStill = useCallback(async (): Promise<void> => {
    if (capturingRef.current) {
      return;
    }
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }
    capturingRef.current = true;
    setIsCapturing(true);
    try {
      const photo = await camera.takePictureAsync({ quality: 0.8 });
      if (photo) {
        onCapture(buildImageMedia(photo.uri, photo.width, photo.height, "image/jpeg"));
      }
    } catch (error) {
      onError(new CaptureError("capture", error instanceof Error ? error.message : undefined));
    } finally {
      capturingRef.current = false;
      setIsCapturing(false);
    }
  }, [onCapture, onError]);

  const startVideo = useCallback(async (): Promise<void> => {
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }
    const microphone = await requestMicrophonePermission();
    if (!microphone?.granted) {
      onError(new CaptureError("permission", "Microphone permission denied"));
      return;
    }
    setStatus("recording");
    try {
      const result = await camera.recordAsync();
      if (result) {
        onCapture(buildVideoMedia(result.uri, 0, 0, "video/mp4"));
      }
    } catch (error) {
      onError(new CaptureError("capture", error instanceof Error ? error.message : undefined));
    } finally {
      setStatus("preview");
    }
  }, [onCapture, onError, requestMicrophonePermission]);

  const stopVideo = useCallback(async (): Promise<void> => {
    cameraRef.current?.stopRecording();
  }, []);

  const pickFromGallery = useCallback(async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
      if (result.canceled) {
        return;
      }
      const asset = result.assets[0];
      if (!asset) {
        return;
      }
      onCapture(
        buildImageMedia(asset.uri, asset.width, asset.height, asset.mimeType ?? "image/jpeg")
      );
    } catch (error) {
      onError(new CaptureError("capture", error instanceof Error ? error.message : undefined));
    }
  }, [onCapture, onError]);

  useEffect(() => {
    if (source !== "camera") {
      setStatus("idle");
      return;
    }
    setStatus(permission === "granted" ? "preview" : "idle");
  }, [source, permission]);

  useEffect(() => {
    if (mode !== "burst" || source !== "camera" || permission !== "granted") {
      return;
    }
    const timer = setInterval(() => {
      void captureStill();
    }, burstIntervalMs);
    return () => clearInterval(timer);
  }, [mode, source, permission, burstIntervalMs, captureStill]);

  const preview = useMemo<CapturePreviewBinding>(() => {
    if (source !== "camera") {
      return { kind: "none" };
    }
    return {
      kind: "camera",
      ref: cameraRef,
      facing: "back",
      cameraMode: mode === "video" ? "video" : "picture",
      active: permission === "granted",
    };
  }, [source, mode, permission]);

  return {
    status,
    permission,
    isCapturing,
    requestPermission,
    captureStill,
    startVideo,
    stopVideo,
    pickFromGallery,
    preview,
  };
}

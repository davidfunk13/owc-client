import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildImageMedia, buildVideoMedia } from "@/lib/captureMedia";
import { CaptureError } from "@/types/capture";
import type {
  CaptureController,
  CaptureOptions,
  CapturePermissionState,
  CapturePreviewBinding,
  CaptureStatus,
} from "@/types/capture";

function isSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getDisplayMedia === "function"
  );
}

export function useCapture(options: CaptureOptions): CaptureController {
  const { mode = "still", burstIntervalMs = 3000, onCapture, onError = () => undefined } = options;
  const supported = isSupported();

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const capturingRef = useRef(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CaptureStatus>(supported ? "idle" : "unsupported");
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, setPermission] = useState<CapturePermissionState>("undetermined");

  const teardown = useCallback((): void => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    videoRef.current?.pause();
    streamRef.current = null;
    videoRef.current = null;
    setStream(null);
  }, []);

  const requestPermission = useCallback(async (): Promise<void> => {
    if (!supported) {
      onError(new CaptureError("unsupported", "Screen capture is not available here."));
      return;
    }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = displayStream;
      video.muted = true;
      await video.play();
      streamRef.current = displayStream;
      videoRef.current = video;
      setStream(displayStream);
      setPermission("granted");
      setStatus("preview");
      displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        teardown();
        setStatus("idle");
      });
    } catch (error) {
      setPermission("denied");
      onError(new CaptureError("permission", error instanceof Error ? error.message : undefined));
    }
  }, [supported, onError, teardown]);

  const captureStill = useCallback(async (): Promise<void> => {
    if (capturingRef.current) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    capturingRef.current = true;
    setIsCapturing(true);
    try {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvasRef.current = canvas;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.drawImage(video, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) {
        return;
      }
      onCapture(buildImageMedia(URL.createObjectURL(blob), width, height, "image/png"));
    } catch (error) {
      onError(new CaptureError("capture", error instanceof Error ? error.message : undefined));
    } finally {
      capturingRef.current = false;
      setIsCapturing(false);
    }
  }, [onCapture, onError]);

  const startVideo = useCallback(async (): Promise<void> => {
    const displayStream = streamRef.current;
    if (!displayStream) {
      return;
    }
    try {
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(displayStream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });
      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
        const settings = displayStream.getVideoTracks()[0]?.getSettings();
        onCapture(
          buildVideoMedia(
            URL.createObjectURL(blob),
            settings?.width ?? 0,
            settings?.height ?? 0,
            blob.type
          )
        );
        setStatus("preview");
      });
      recorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
    } catch (error) {
      onError(new CaptureError("capture", error instanceof Error ? error.message : undefined));
    }
  }, [onCapture, onError]);

  const stopVideo = useCallback(async (): Promise<void> => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (mode !== "burst" || status !== "preview") {
      return;
    }
    const timer = setInterval(() => {
      void captureStill();
    }, burstIntervalMs);
    return () => clearInterval(timer);
  }, [mode, status, burstIntervalMs, captureStill]);

  useEffect(() => {
    return () => teardown();
  }, [teardown]);

  const preview = useMemo<CapturePreviewBinding>(() => ({ kind: "stream", stream }), [stream]);

  return {
    status,
    permission,
    isCapturing,
    requestPermission,
    captureStill,
    startVideo,
    stopVideo,
    preview,
  };
}

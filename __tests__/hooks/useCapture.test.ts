import { act, renderHook } from "@testing-library/react-native";

jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  useMicrophonePermissions: jest.fn(),
  CameraView: "CameraView",
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
}));

import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCapture } from "@/hooks/useCapture";
import type { CameraHandle, CaptureController } from "@/types/capture";

const mockUseCameraPermissions = useCameraPermissions as jest.Mock;
const mockUseMicrophonePermissions = useMicrophonePermissions as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;

const attachCamera = (controller: CaptureController, camera: CameraHandle): void => {
  if (controller.preview.kind === "camera") {
    controller.preview.ref.current = camera;
  }
};

const makeCamera = (overrides: Partial<CameraHandle> = {}): CameraHandle => ({
  takePictureAsync: jest.fn().mockResolvedValue({ uri: "file://p.jpg", width: 120, height: 60 }),
  recordAsync: jest.fn().mockResolvedValue({ uri: "file://v.mp4" }),
  stopRecording: jest.fn(),
  ...overrides,
});

describe("useCapture (native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCameraPermissions.mockReturnValue([
      { granted: true },
      jest.fn().mockResolvedValue({ granted: true }),
    ]);
    mockUseMicrophonePermissions.mockReturnValue([
      { granted: true },
      jest.fn().mockResolvedValue({ granted: true }),
    ]);
  });

  it("reports granted permission and a camera preview binding", () => {
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "camera", onCapture: jest.fn() })
    );

    expect(result.current.permission).toBe("granted");
    expect(result.current.preview.kind).toBe("camera");
  });

  it("reports denied permission", () => {
    mockUseCameraPermissions.mockReturnValue([{ granted: false }, jest.fn()]);
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "camera", onCapture: jest.fn() })
    );
    expect(result.current.permission).toBe("denied");
  });

  it("reports undetermined permission when none resolved yet", () => {
    mockUseCameraPermissions.mockReturnValue([null, jest.fn()]);
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "camera", onCapture: jest.fn() })
    );
    expect(result.current.permission).toBe("undetermined");
  });

  it("requests camera permission", async () => {
    const request = jest.fn().mockResolvedValue({ granted: true });
    mockUseCameraPermissions.mockReturnValue([{ granted: false }, request]);
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "camera", onCapture: jest.fn() })
    );
    await act(async () => {
      await result.current.requestPermission();
    });
    expect(request).toHaveBeenCalled();
  });

  it("uses a 'none' preview for the gallery source", () => {
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture: jest.fn() })
    );
    expect(result.current.preview.kind).toBe("none");
  });

  it("captures a still and emits image media", async () => {
    const onCapture = jest.fn();
    const camera = makeCamera();
    const { result } = renderHook(() => useCapture({ mode: "still", source: "camera", onCapture }));
    attachCamera(result.current, camera);

    await act(async () => {
      await result.current.captureStill();
    });

    expect(camera.takePictureAsync).toHaveBeenCalled();
    expect(onCapture).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "image", uri: "file://p.jpg", width: 120, height: 60 })
    );
  });

  it("does nothing on captureStill when no camera is attached", async () => {
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "still", source: "camera", onCapture }));
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });

  it("guards overlapping captures", async () => {
    const onCapture = jest.fn();
    let resolvePhoto!: (value: { uri: string; width: number; height: number }) => void;
    const camera = makeCamera({
      takePictureAsync: jest.fn(
        () =>
          new Promise<{ uri: string; width: number; height: number }>((resolve) => {
            resolvePhoto = resolve;
          })
      ),
    });
    const { result } = renderHook(() => useCapture({ mode: "still", source: "camera", onCapture }));
    attachCamera(result.current, camera);

    await act(async () => {
      const first = result.current.captureStill();
      const second = result.current.captureStill();
      resolvePhoto({ uri: "file://p.jpg", width: 1, height: 1 });
      await Promise.all([first, second]);
    });

    expect(camera.takePictureAsync).toHaveBeenCalledTimes(1);
  });

  it("surfaces capture errors via onError", async () => {
    const onError = jest.fn();
    const camera = makeCamera({
      takePictureAsync: jest.fn().mockRejectedValue(new Error("boom")),
    });
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "camera", onCapture: jest.fn(), onError })
    );
    attachCamera(result.current, camera);

    await act(async () => {
      await result.current.captureStill();
    });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "capture" }));
  });

  it("records a video and emits video media", async () => {
    const onCapture = jest.fn();
    let resolveRecording!: (value: { uri: string }) => void;
    const recordingPromise = new Promise<{ uri: string }>((resolve) => {
      resolveRecording = resolve;
    });
    const camera = makeCamera({
      recordAsync: jest.fn(() => recordingPromise),
      stopRecording: jest.fn(() => resolveRecording({ uri: "file://v.mp4" })),
    });
    const { result } = renderHook(() => useCapture({ mode: "video", source: "camera", onCapture }));
    attachCamera(result.current, camera);

    await act(async () => {
      const recording = result.current.startVideo();
      await Promise.resolve();
      await result.current.stopVideo();
      await recording;
    });

    expect(camera.recordAsync).toHaveBeenCalled();
    expect(onCapture).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "video", uri: "file://v.mp4" })
    );
  });

  it("errors when the microphone permission is denied for video", async () => {
    mockUseMicrophonePermissions.mockReturnValue([
      null,
      jest.fn().mockResolvedValue({ granted: false }),
    ]);
    const onError = jest.fn();
    const camera = makeCamera();
    const { result } = renderHook(() =>
      useCapture({ mode: "video", source: "camera", onCapture: jest.fn(), onError })
    );
    attachCamera(result.current, camera);

    await act(async () => {
      await result.current.startVideo();
    });

    expect(camera.recordAsync).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "permission" }));
  });

  it("picks an image from the gallery", async () => {
    mockLaunchLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://g.jpg", width: 80, height: 40, mimeType: "image/png" }],
    });
    const onCapture = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture })
    );

    await act(async () => {
      await result.current.pickFromGallery?.();
    });

    expect(onCapture).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "image", uri: "file://g.jpg", mimeType: "image/png" })
    );
  });

  it("ignores a canceled gallery pick", async () => {
    mockLaunchLibrary.mockResolvedValue({ canceled: true });
    const onCapture = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture })
    );

    await act(async () => {
      await result.current.pickFromGallery?.();
    });

    expect(onCapture).not.toHaveBeenCalled();
  });

  it("auto-captures on an interval in burst mode", async () => {
    jest.useFakeTimers();
    const onCapture = jest.fn();
    const camera = makeCamera();
    const { result } = renderHook(() =>
      useCapture({ mode: "burst", source: "camera", burstIntervalMs: 1000, onCapture })
    );
    attachCamera(result.current, camera);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(camera.takePictureAsync).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("does nothing on startVideo when no camera is attached", async () => {
    const camera = makeCamera();
    const { result } = renderHook(() =>
      useCapture({ mode: "video", source: "camera", onCapture: jest.fn() })
    );
    await act(async () => {
      await result.current.startVideo();
    });
    expect(camera.recordAsync).not.toHaveBeenCalled();
  });

  it("surfaces video recording errors", async () => {
    const onError = jest.fn();
    const camera = makeCamera({ recordAsync: jest.fn().mockRejectedValue(new Error("rec")) });
    const { result } = renderHook(() =>
      useCapture({ mode: "video", source: "camera", onCapture: jest.fn(), onError })
    );
    attachCamera(result.current, camera);
    await act(async () => {
      await result.current.startVideo();
    });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "capture" }));
  });

  it("ignores an empty gallery selection", async () => {
    mockLaunchLibrary.mockResolvedValue({ canceled: false, assets: [] });
    const onCapture = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture })
    );
    await act(async () => {
      await result.current.pickFromGallery?.();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });

  it("surfaces gallery errors", async () => {
    mockLaunchLibrary.mockRejectedValue(new Error("library"));
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture: jest.fn(), onError })
    );
    await act(async () => {
      await result.current.pickFromGallery?.();
    });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "capture" }));
  });

  it("defaults to jpeg when a gallery asset has no mime type", async () => {
    mockLaunchLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://g.jpg", width: 10, height: 10 }],
    });
    const onCapture = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", source: "gallery", onCapture })
    );
    await act(async () => {
      await result.current.pickFromGallery?.();
    });
    expect(onCapture).toHaveBeenCalledWith(expect.objectContaining({ mimeType: "image/jpeg" }));
  });

  it("ignores an undefined photo result", async () => {
    const onCapture = jest.fn();
    const camera = makeCamera({ takePictureAsync: jest.fn().mockResolvedValue(undefined) });
    const { result } = renderHook(() => useCapture({ mode: "still", source: "camera", onCapture }));
    attachCamera(result.current, camera);
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });
});

import { act, renderHook } from "@testing-library/react-native";
import { useCapture } from "@/hooks/useCapture.web";

interface RecorderMock {
  state: string;
  mimeType: string;
  addEventListener: jest.Mock;
  start: jest.Mock;
  stop: jest.Mock;
}

const define = (name: string, value: object): void => {
  Object.defineProperty(global, name, { value, configurable: true, writable: true });
};

let getDisplayMedia: jest.Mock;
let trackStop: jest.Mock;
let trackEnded: (() => void) | undefined;
let getContext: jest.Mock;
let toBlob: jest.Mock;
let recorderListeners: Record<string, Array<(event?: { data: { size: number } }) => void>>;
let recorder: RecorderMock;
let mediaRecorderCtor: jest.Mock;
let trackSettings: { width?: number; height?: number };

const installBrowser = (): void => {
  trackStop = jest.fn();
  trackEnded = undefined;
  trackSettings = { width: 200, height: 100 };
  const videoTrack = {
    addEventListener: jest.fn((event: string, callback: () => void) => {
      if (event === "ended") {
        trackEnded = callback;
      }
    }),
    getSettings: () => trackSettings,
    stop: trackStop,
  };
  const stream = { getVideoTracks: () => [videoTrack], getTracks: () => [videoTrack] };
  getDisplayMedia = jest.fn().mockResolvedValue(stream);
  define("navigator", { mediaDevices: { getDisplayMedia } });

  const video = {
    srcObject: null,
    muted: false,
    videoWidth: 200,
    videoHeight: 100,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
  };
  getContext = jest.fn(() => ({ drawImage: jest.fn() }));
  toBlob = jest.fn((callback: (blob: Blob | null) => void) =>
    callback(new Blob([], { type: "image/png" }))
  );
  define("document", {
    createElement: (tag: string) =>
      tag === "video" ? video : { width: 0, height: 0, getContext, toBlob },
  });

  recorderListeners = {};
  recorder = {
    state: "inactive",
    mimeType: "video/webm",
    addEventListener: jest.fn(
      (event: string, callback: (e?: { data: { size: number } }) => void) => {
        recorderListeners[event] = recorderListeners[event] ?? [];
        recorderListeners[event].push(callback);
      }
    ),
    start: jest.fn(() => {
      recorder.state = "recording";
    }),
    stop: jest.fn(() => {
      recorder.state = "inactive";
      (recorderListeners.stop ?? []).forEach((callback) => callback());
    }),
  };
  mediaRecorderCtor = jest.fn(() => recorder);
  define("MediaRecorder", mediaRecorderCtor);
  define("URL", { createObjectURL: jest.fn(() => "blob:abc"), revokeObjectURL: jest.fn() });
};

const share = async (controller: { requestPermission: () => Promise<void> }): Promise<void> => {
  await act(async () => {
    await controller.requestPermission();
  });
};

describe("useCapture (web)", () => {
  beforeEach(() => {
    installBrowser();
  });

  it("reports unsupported when getDisplayMedia is missing", () => {
    define("navigator", {});
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture: jest.fn() }));
    expect(result.current.status).toBe("unsupported");
  });

  it("errors on requestPermission when unsupported", async () => {
    define("navigator", {});
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", onCapture: jest.fn(), onError })
    );
    await share(result.current);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "unsupported" }));
  });

  it("starts a screen share and exposes a stream preview", async () => {
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture: jest.fn() }));
    await share(result.current);
    expect(getDisplayMedia).toHaveBeenCalled();
    expect(result.current.status).toBe("preview");
    expect(result.current.permission).toBe("granted");
    expect(result.current.preview.kind).toBe("stream");
  });

  it("reports denied when the user cancels the share", async () => {
    getDisplayMedia.mockRejectedValueOnce(new Error("cancelled"));
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "still", onCapture: jest.fn(), onError })
    );
    await share(result.current);
    expect(result.current.permission).toBe("denied");
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "permission" }));
  });

  it("tears down when the shared track ends", async () => {
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture: jest.fn() }));
    await share(result.current);
    await act(async () => {
      trackEnded?.();
    });
    expect(trackStop).toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("captures a still frame into an image", async () => {
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "image", uri: "blob:abc", width: 200, height: 100 })
    );
  });

  it("does nothing on captureStill before a share starts", async () => {
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture }));
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });

  it("ignores captureStill when the 2d context is unavailable", async () => {
    getContext.mockReturnValue(null);
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });

  it("ignores captureStill when no blob is produced", async () => {
    toBlob.mockImplementation((callback: (blob: Blob | null) => void) => callback(null));
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "still", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.captureStill();
    });
    expect(onCapture).not.toHaveBeenCalled();
  });

  it("records the screen into a video clip", async () => {
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "video", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.startVideo();
    });
    expect(result.current.status).toBe("recording");
    await act(async () => {
      (recorderListeners.dataavailable ?? []).forEach((callback) =>
        callback({ data: new Blob(["x"]) })
      );
    });
    await act(async () => {
      await result.current.stopVideo();
    });
    expect(onCapture).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "video", uri: "blob:abc" })
    );
  });

  it("does nothing on startVideo before a share starts", async () => {
    const { result } = renderHook(() => useCapture({ mode: "video", onCapture: jest.fn() }));
    await act(async () => {
      await result.current.startVideo();
    });
    expect(mediaRecorderCtor).not.toHaveBeenCalled();
  });

  it("surfaces recorder construction errors", async () => {
    mediaRecorderCtor.mockImplementation(() => {
      throw new Error("recorder");
    });
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "video", onCapture: jest.fn(), onError })
    );
    await share(result.current);
    await act(async () => {
      await result.current.startVideo();
    });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "capture" }));
  });

  it("auto-captures frames in burst mode", async () => {
    jest.useFakeTimers();
    const onCapture = jest.fn();
    const { result } = renderHook(() =>
      useCapture({ mode: "burst", burstIntervalMs: 500, onCapture })
    );
    await share(result.current);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(500);
    });
    expect(onCapture).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("stops the stream tracks on unmount", async () => {
    const { result, unmount } = renderHook(() =>
      useCapture({ mode: "still", onCapture: jest.fn() })
    );
    await share(result.current);
    unmount();
    expect(trackStop).toHaveBeenCalled();
  });

  it("stops an active recording on unmount", async () => {
    const { result, unmount } = renderHook(() =>
      useCapture({ mode: "video", onCapture: jest.fn() })
    );
    await share(result.current);
    await act(async () => {
      await result.current.startVideo();
    });
    unmount();
    expect(recorder.stop).toHaveBeenCalled();
  });

  it("falls back to zero dimensions when track settings are empty", async () => {
    trackSettings = {};
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "video", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.startVideo();
    });
    await act(async () => {
      await result.current.stopVideo();
    });
    expect(onCapture).toHaveBeenCalledWith(expect.objectContaining({ width: 0, height: 0 }));
  });

  it("falls back to a default mime type when the recorder reports none", async () => {
    recorder.mimeType = "";
    const onCapture = jest.fn();
    const { result } = renderHook(() => useCapture({ mode: "video", onCapture }));
    await share(result.current);
    await act(async () => {
      await result.current.startVideo();
    });
    await act(async () => {
      await result.current.stopVideo();
    });
    expect(onCapture).toHaveBeenCalledWith(expect.objectContaining({ mimeType: "video/webm" }));
  });
});

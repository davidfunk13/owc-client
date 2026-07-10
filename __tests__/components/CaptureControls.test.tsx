import { fireEvent, render } from "@testing-library/react-native";
import { CaptureControls } from "@/components/CaptureControls/CaptureControls";
import type { CaptureController, CaptureMode, CaptureSource } from "@/types/capture";
import { withTheme } from "../test-utils";

const makeController = (overrides: Partial<CaptureController> = {}): CaptureController => ({
  status: "preview",
  permission: "granted",
  isCapturing: false,
  requestPermission: jest.fn().mockResolvedValue(undefined),
  captureStill: jest.fn().mockResolvedValue(undefined),
  startVideo: jest.fn().mockResolvedValue(undefined),
  stopVideo: jest.fn().mockResolvedValue(undefined),
  pickFromGallery: jest.fn().mockResolvedValue(undefined),
  preview: { kind: "none" },
  ...overrides,
});

const renderControls = (
  controller: CaptureController,
  mode: CaptureMode,
  source: CaptureSource,
  onClose?: () => void
): ReturnType<typeof render> =>
  render(
    withTheme(
      <CaptureControls controller={controller} mode={mode} source={source} onClose={onClose} />
    )
  );

describe("CaptureControls", () => {
  it("shows the unsupported state", () => {
    const { getByText } = renderControls(
      makeController({ status: "unsupported" }),
      "still",
      "screen"
    );
    expect(getByText("Screen capture unavailable")).toBeTruthy();
  });

  it("offers a gallery pick for the gallery source", () => {
    const controller = makeController();
    const { getByRole } = renderControls(controller, "still", "gallery");
    fireEvent.press(getByRole("button", { name: "Pick screenshot" }));
    expect(controller.pickFromGallery).toHaveBeenCalled();
  });

  it("prompts to share a window when screen permission is pending", () => {
    const controller = makeController({ permission: "undetermined" });
    const { getByRole } = renderControls(controller, "still", "screen");
    fireEvent.press(getByRole("button", { name: "Share a window" }));
    expect(controller.requestPermission).toHaveBeenCalled();
  });

  it("prompts to enable the camera when camera permission is denied", () => {
    const { getByRole } = renderControls(
      makeController({ permission: "denied" }),
      "still",
      "camera"
    );
    expect(getByRole("button", { name: "Enable camera" })).toBeTruthy();
  });

  it("captures a still when the shutter is pressed", () => {
    const controller = makeController();
    const { getByRole } = renderControls(controller, "still", "camera");
    fireEvent.press(getByRole("button", { name: "Capture" }));
    expect(controller.captureStill).toHaveBeenCalled();
  });

  it("disables the shutter while a capture is in flight", () => {
    const { getByRole } = renderControls(makeController({ isCapturing: true }), "still", "camera");
    expect(getByRole("button", { name: "Capture" }).props.accessibilityState?.disabled).toBe(true);
  });

  it("shows an auto-capturing indicator in burst mode", () => {
    const { getByText } = renderControls(makeController(), "burst", "camera");
    expect(getByText("Auto-capturing…")).toBeTruthy();
  });

  it("starts recording in video mode", () => {
    const controller = makeController();
    const { getByRole } = renderControls(controller, "video", "camera");
    fireEvent.press(getByRole("button", { name: "Record" }));
    expect(controller.startVideo).toHaveBeenCalled();
  });

  it("stops an in-progress recording", () => {
    const controller = makeController({ status: "recording" });
    const { getByRole } = renderControls(controller, "video", "camera");
    fireEvent.press(getByRole("button", { name: "Stop" }));
    expect(controller.stopVideo).toHaveBeenCalled();
  });

  it("renders a close button that calls onClose", () => {
    const onClose = jest.fn();
    const { getByRole } = renderControls(makeController(), "still", "camera", onClose);
    fireEvent.press(getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});

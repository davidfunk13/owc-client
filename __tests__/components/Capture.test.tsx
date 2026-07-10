import { fireEvent, render } from "@testing-library/react-native";

jest.mock("expo-camera", () => ({
  CameraView: "CameraView",
  useCameraPermissions: jest.fn(),
  useMicrophonePermissions: jest.fn(),
}));

jest.mock("@/hooks/useCapture", () => ({ useCapture: jest.fn() }));

import { useCapture } from "@/hooks/useCapture";
import { Capture } from "@/components/Capture/Capture";
import type { CaptureController } from "@/types/capture";
import { withTheme } from "../test-utils";

const mockUseCapture = useCapture as jest.Mock;

const controller: CaptureController = {
  status: "preview",
  permission: "granted",
  isCapturing: false,
  requestPermission: jest.fn(),
  captureStill: jest.fn(),
  startVideo: jest.fn(),
  stopVideo: jest.fn(),
  pickFromGallery: jest.fn(),
  preview: { kind: "none" },
};

describe("Capture", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCapture.mockReturnValue(controller);
  });

  it("passes options through to useCapture and defaults the native source to camera", () => {
    const onCapture = jest.fn();
    render(withTheme(<Capture mode="still" onCapture={onCapture} />));
    expect(mockUseCapture).toHaveBeenCalledWith(
      expect.objectContaining({ mode: "still", source: "camera", onCapture })
    );
  });

  it("renders the controls for the active controller", () => {
    const { getByRole } = render(withTheme(<Capture mode="still" onCapture={jest.fn()} />));
    expect(getByRole("button", { name: "Capture" })).toBeTruthy();
  });

  it("forwards onClose to the controls", () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      withTheme(<Capture mode="still" onCapture={jest.fn()} onClose={onClose} />)
    );
    fireEvent.press(getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});

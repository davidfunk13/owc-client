import { createRef } from "react";
import { render } from "@testing-library/react-native";

jest.mock("expo-camera", () => ({ CameraView: "CameraView" }));

import { CapturePreview } from "@/components/CapturePreview/CapturePreview";
import type { CameraHandle } from "@/types/capture";

describe("CapturePreview (native)", () => {
  it("renders the camera when active", () => {
    const ref = createRef<CameraHandle | null>();
    const { getByTestId } = render(
      <CapturePreview
        binding={{ kind: "camera", ref, facing: "back", cameraMode: "picture", active: true }}
      />
    );
    expect(getByTestId("capture-preview-camera")).toBeTruthy();
  });

  it("renders empty when the camera is inactive", () => {
    const ref = createRef<CameraHandle | null>();
    const { getByTestId } = render(
      <CapturePreview
        binding={{ kind: "camera", ref, facing: "back", cameraMode: "picture", active: false }}
      />
    );
    expect(getByTestId("capture-preview-empty")).toBeTruthy();
  });

  it("renders empty for the none binding", () => {
    const { getByTestId } = render(<CapturePreview binding={{ kind: "none" }} />);
    expect(getByTestId("capture-preview-empty")).toBeTruthy();
  });
});

import { render } from "@testing-library/react-native";
import { CapturePreview } from "@/components/CapturePreview/CapturePreview.web";

interface FakeVideo {
  srcObject: MediaStream | null;
  play: jest.Mock;
}

const mockVideoNode = (): FakeVideo => ({
  srcObject: null,
  play: jest.fn().mockResolvedValue(undefined),
});

describe("CapturePreview (web)", () => {
  it("renders a video element for a stream binding", () => {
    const { getByTestId } = render(<CapturePreview binding={{ kind: "stream", stream: null }} />);
    expect(getByTestId("capture-preview-web")).toBeTruthy();
  });

  it("binds the stream to the video element and starts playback", () => {
    const video = mockVideoNode();
    const stream = {} as MediaStream;

    render(<CapturePreview binding={{ kind: "stream", stream }} />, {
      createNodeMock: (element) => (element.type === "video" ? video : null),
    });

    expect(video.srcObject).toBe(stream);
    expect(video.play).toHaveBeenCalled();
  });
});

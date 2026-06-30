import { render } from "@testing-library/react-native";
import { Skeleton } from "../../components/Skeleton/Skeleton";
import { withTheme } from "../test-utils";

describe("Skeleton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("is reachable by accessibility label 'Loading'", () => {
    const { getByLabelText } = render(withTheme(<Skeleton />));

    expect(getByLabelText("Loading")).toBeTruthy();
  });

  it("renders each shape", () => {
    const shapes: Array<"rect" | "circle" | "text"> = ["rect", "circle", "text"];

    shapes.forEach((shape) => {
      const { getByLabelText, unmount } = render(withTheme(<Skeleton shape={shape} />));
      expect(getByLabelText("Loading")).toBeTruthy();
      unmount();
    });
  });
});

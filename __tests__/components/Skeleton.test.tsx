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
});

import type { FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";

interface ThrowingComponentProps {
  shouldThrow: boolean;
}

const ThrowingComponent: FC<ThrowingComponentProps> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <Text>Normal content</Text>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Text>Child content</Text>
      </ErrorBoundary>
    );

    expect(screen.getByText("Child content")).toBeTruthy();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByText("Test error message")).toBeTruthy();
    expect(screen.getByText("Try Again")).toBeTruthy();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<Text>Custom error view</Text>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error view")).toBeTruthy();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("logs error to console", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      "ErrorBoundary caught an error:",
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it("resets error state when retry button is pressed", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeTruthy();

    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.press(screen.getByText("Try Again"));

    expect(screen.getByText("Normal content")).toBeTruthy();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("shows fallback message when error is null", () => {
    const NullErrorComponent = () => {
      throw null;
    };

    render(
      <ErrorBoundary>
        <NullErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("An unexpected error occurred")).toBeTruthy();
  });
});

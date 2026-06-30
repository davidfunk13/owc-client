import { fireEvent, render } from "@testing-library/react-native";
import { Toast } from "@/components/Toast/Toast";
import { withTheme } from "../test-utils";
import type { ToastEntry } from "@/types/toast";

const buildToast = (overrides: Partial<ToastEntry> = {}): ToastEntry => ({
  id: "t1",
  message: "Hello",
  variant: "info",
  ...overrides,
});

describe("Toast", () => {
  it("renders the message", () => {
    const { getByText } = render(
      withTheme(<Toast toast={buildToast({ message: "Saved!" })} onDismiss={jest.fn()} />)
    );
    expect(getByText("Saved!")).toBeTruthy();
  });

  it("calls onDismiss with the toast id when pressed", () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      withTheme(
        <Toast toast={buildToast({ id: "abc", message: "Tap me" })} onDismiss={onDismiss} />
      )
    );
    fireEvent.press(getByLabelText("Tap me"));
    expect(onDismiss).toHaveBeenCalledWith("abc");
  });

  it("renders a non-default variant", () => {
    const { getByText } = render(
      withTheme(
        <Toast
          toast={buildToast({ message: "Saved!", variant: "success" })}
          onDismiss={jest.fn()}
        />
      )
    );
    expect(getByText("Saved!")).toBeTruthy();
  });

  it("defaults to info variant when none provided", () => {
    const toast: ToastEntry = { id: "x", message: "Default" };
    const { getByText } = render(withTheme(<Toast toast={toast} onDismiss={jest.fn()} />));
    expect(getByText("Default")).toBeTruthy();
  });
});

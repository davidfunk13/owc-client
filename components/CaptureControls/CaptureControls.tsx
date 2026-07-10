import type { FC } from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { useTheme } from "@/contexts/ThemeContext";
import type { CaptureControlsProps } from "@/types/capture";

const CaptureControlsComponent: FC<CaptureControlsProps> = ({
  controller,
  mode,
  source,
  onClose,
}) => {
  const { theme } = useTheme();
  const { status, permission, isCapturing } = controller;

  if (status === "unsupported") {
    return (
      <EmptyState
        title="Screen capture unavailable"
        description="Open the web app in a desktop browser to capture a window."
      />
    );
  }

  const barStyle = [styles.bar, { gap: theme.spacing.md, padding: theme.spacing.md }];

  if (source === "gallery") {
    return (
      <View style={barStyle}>
        <Button title="Pick screenshot" onPress={() => void controller.pickFromGallery?.()} />
        {onClose ? <Button title="Close" onPress={onClose} /> : null}
      </View>
    );
  }

  if (permission !== "granted") {
    return (
      <View style={barStyle}>
        <Button
          title={source === "screen" ? "Share a window" : "Enable camera"}
          onPress={() => void controller.requestPermission()}
        />
        {onClose ? <Button title="Close" onPress={onClose} /> : null}
      </View>
    );
  }

  return (
    <View style={barStyle}>
      {mode === "burst" ? <Body>Auto-capturing…</Body> : null}
      {mode === "still" ? (
        <Button
          title="Capture"
          onPress={() => void controller.captureStill()}
          disabled={isCapturing}
        />
      ) : null}
      {mode === "video" && status !== "recording" ? (
        <Button title="Record" onPress={() => void controller.startVideo()} />
      ) : null}
      {mode === "video" && status === "recording" ? (
        <Button title="Stop" variant="danger" onPress={() => void controller.stopVideo()} />
      ) : null}
      {onClose ? <Button title="Close" onPress={onClose} /> : null}
    </View>
  );
};

export const CaptureControls = memo(CaptureControlsComponent);

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});

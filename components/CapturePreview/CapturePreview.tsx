import type { FC } from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { CameraView } from "expo-camera";
import type { CapturePreviewProps } from "@/types/capture";

const CapturePreviewComponent: FC<CapturePreviewProps> = ({ binding }) => {
  if (binding.kind !== "camera" || !binding.active) {
    return <View style={styles.fill} testID="capture-preview-empty" />;
  }

  return (
    <CameraView
      style={styles.fill}
      facing={binding.facing}
      mode={binding.cameraMode}
      ref={(instance) => {
        binding.ref.current = instance;
      }}
      testID="capture-preview-camera"
    />
  );
};

export const CapturePreview = memo(CapturePreviewComponent);

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

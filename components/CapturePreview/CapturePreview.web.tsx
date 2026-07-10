import type { CSSProperties, FC } from "react";
import { memo, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import type { CapturePreviewProps } from "@/types/capture";

const videoStyle: CSSProperties = { width: "100%", height: "100%", objectFit: "contain" };

const CapturePreviewComponent: FC<CapturePreviewProps> = ({ binding }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stream = binding.kind === "stream" ? binding.stream : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.srcObject = stream;
    if (stream && typeof video.play === "function") {
      video.play().catch(() => undefined);
    }
  }, [stream]);

  return (
    <View style={styles.fill} testID="capture-preview-web">
      <video ref={videoRef} style={videoStyle} muted playsInline autoPlay />
    </View>
  );
};

export const CapturePreview = memo(CapturePreviewComponent);

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

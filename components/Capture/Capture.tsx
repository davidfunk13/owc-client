import type { FC } from "react";
import { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { CaptureControls } from "@/components/CaptureControls/CaptureControls";
import { CapturePreview } from "@/components/CapturePreview/CapturePreview";
import { useTheme } from "@/contexts/ThemeContext";
import { useCapture } from "@/hooks/useCapture";
import type { CaptureProps } from "@/types/capture";

const CaptureComponent: FC<CaptureProps> = ({
  mode = "still",
  source,
  burstIntervalMs,
  onCapture,
  onError,
  onClose,
}) => {
  const { theme } = useTheme();
  const resolvedSource = source ?? (Platform.OS === "web" ? "screen" : "camera");
  const controller = useCapture({
    mode,
    source: resolvedSource,
    burstIntervalMs,
    onCapture,
    onError,
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.preview}>
        <CapturePreview binding={controller.preview} />
      </View>
      <CaptureControls
        controller={controller}
        mode={mode}
        source={resolvedSource}
        onClose={onClose}
      />
    </View>
  );
};

export const Capture = memo(CaptureComponent);

const styles = StyleSheet.create({
  container: { flex: 1 },
  preview: { flex: 1, overflow: "hidden" },
});

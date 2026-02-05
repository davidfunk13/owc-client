import type { FC } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { EditScreenInfo } from "@/components/EditScreenInfo/EditScreenInfo";
import { Text, View } from "@/components/Themed/Themed";
import { useTheme } from "@/contexts/ThemeContext";

const ModalScreen: FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={[styles.separator, { backgroundColor: theme.colors.border.light }]} />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

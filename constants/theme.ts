import type { ColorPalette, Theme } from "@/types/theme";

const dark: ColorPalette = {
  background: { default: "#1a1a2e", paper: "#2a2a4e", highlight: "rgba(255,255,255,0.08)" },
  text: {
    primary: "#fff",
    secondary: "#888",
    disabled: "#666",
    muted: "rgba(255,255,255,0.8)",
    onAccent: "#fff",
  },
  primary: { main: "#00aeff" },
  error: { main: "#dc3545" },
  success: { main: "#28a745" },
  info: { main: "#17a2b8" },
  border: { light: "rgba(255,255,255,0.1)" },
};

const light: ColorPalette = {
  background: { default: "#ffffff", paper: "#f4f5fa", highlight: "rgba(0,0,0,0.08)" },
  text: {
    primary: "#1a1a2e",
    secondary: "#666",
    disabled: "#888",
    muted: "rgba(0,0,0,0.8)",
    onAccent: "#fff",
  },
  primary: { main: "#00aeff" },
  error: { main: "#dc3545" },
  success: { main: "#28a745" },
  info: { main: "#17a2b8" },
  border: { light: "#cfd0d8" },
};

const tokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 20, xl: 32 },
  radius: { sm: 8, md: 12, lg: 20, full: 50 },
  font: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 28 },
} as const;

export const darkTheme: Theme = { colors: dark, ...tokens };
export const lightTheme: Theme = { colors: light, ...tokens };

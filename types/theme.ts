export interface ColorPalette {
  background: { default: string; paper: string; highlight: string };
  text: { primary: string; secondary: string; disabled: string; muted: string };
  primary: { main: string };
  error: { main: string };
  border: { light: string };
}

export interface Theme {
  colors: ColorPalette;
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { sm: number; md: number; full: number };
  font: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
}

export type Spacing = keyof Theme["spacing"];
export type FontSize = keyof Theme["font"];

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

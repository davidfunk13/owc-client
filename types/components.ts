import type { ComponentProps, ReactNode } from "react";
import type {
  Text as DefaultText,
  View as DefaultView,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { Link } from "expo-router";

// Button
export type ButtonVariant = "primary" | "danger";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Card
export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Screen
export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ThemedText
export type TextVariant = "title" | "heading" | "stat" | "body" | "secondary" | "label" | "hint";

export interface ThemedTextProps {
  variant?: TextVariant;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

// Themed (legacy)
export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

// MonoText
export type MonoTextProps = TextProps;

// ExternalLink
export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

// EditScreenInfo
export interface EditScreenInfoProps {
  path: string;
}

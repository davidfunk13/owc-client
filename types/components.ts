import type { ComponentProps, ReactNode } from "react";
import type {
  Text as DefaultText,
  View as DefaultView,
  DimensionValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { Link } from "expo-router";

export type ButtonVariant = "primary" | "danger";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type SafeAreaEdge = "top" | "bottom" | "left" | "right";

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  edges?: SafeAreaEdge[];
}

export interface KeyboardSafeViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type HeadingSize = "lg" | "md" | "sm";

export interface HeadingProps {
  size?: HeadingSize;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export type BodySize = "md" | "sm";

export interface BodyProps {
  size?: BodySize;
  muted?: boolean;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface CaptionProps {
  tiny?: boolean;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface StatProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: DimensionValue;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export interface InputProps {
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url" | "decimal-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export type SelectValue = string | number;

export interface SelectOption {
  label: string;
  value: SelectValue;
}

export interface SelectProps {
  value: SelectValue;
  onValueChange: (value: SelectValue) => void;
  options: SelectOption[];
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "error" | "info";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

export interface AvatarProps {
  source?: string;
  fallback?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export interface ListItemProps {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export type MonoTextProps = TextProps;

export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export interface EditScreenInfoProps {
  path: string;
}

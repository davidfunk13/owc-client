import { memo } from "react";
import type { FC } from "react";
import { type Href, Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import type { ExternalLinkProps } from "@/types/components";

const ExternalLinkComponent: FC<ExternalLinkProps> = (props) => {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href as Href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href);
        }
      }}
    />
  );
};

export const ExternalLink = memo(ExternalLinkComponent);

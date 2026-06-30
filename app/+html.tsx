import type { FC, ReactNode } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

interface RootProps {
  children: ReactNode;
}

// Web-only HTML shell. Rendered by Expo Router during the static web build in
// a Node.js context — no DOM or browser APIs are available here. Anything
// runtime-interactive must live elsewhere.
const Root: FC<RootProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
};

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;

export default Root;

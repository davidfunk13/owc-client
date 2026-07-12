import type { FC } from "react";
import { Stack } from "expo-router";

export { ErrorBoundary } from "expo-router";

const AuthLayout: FC = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;

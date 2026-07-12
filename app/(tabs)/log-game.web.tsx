import type { FC } from "react";
import { useCallback } from "react";
import { router } from "expo-router";
import { LogGameForm } from "@/components/LogGameForm/LogGameForm";
import { Screen } from "@/components/Screen/Screen";

const LogGameScreen: FC = () => {
  const handleDone = useCallback((): void => {
    router.replace("/");
  }, []);

  return (
    <Screen scroll>
      <LogGameForm layout="page" onDone={handleDone} />
    </Screen>
  );
};

export default LogGameScreen;

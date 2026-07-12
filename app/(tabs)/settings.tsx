import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { Screen } from "@/components/Screen/Screen";
import { Switch } from "@/components/Switch/Switch";

const SettingsScreen: FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <Screen>
      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Appearance</Heading>
        <Switch label="Dark Mode" onValueChange={toggleTheme} value={isDark} />
      </Card>
    </Screen>
  );
};

export default SettingsScreen;

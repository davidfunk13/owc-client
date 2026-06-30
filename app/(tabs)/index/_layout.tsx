import type { ComponentProps, FC } from "react";
import type { ColorValue } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

interface TabIconProps {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: ColorValue;
  size: number;
}

const TabIcon: FC<TabIconProps> = ({ name, color, size }) => {
  return <FontAwesome name={name} size={size} color={color} />;
};

const HomeLayout: FC = () => {
  const { theme } = useTheme();

  return (
    <Tabs
      initialRouteName="overview"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.default,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
        },
      }}>
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => <TabIcon name="dashboard" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: "Recent",
          tabBarIcon: ({ color, size }) => <TabIcon name="history" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: ({ color, size }) => <TabIcon name="line-chart" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;

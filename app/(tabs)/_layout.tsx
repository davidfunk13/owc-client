import type { ComponentProps, FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface TabBarIconProps {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

const TabBarIcon: FC<TabBarIconProps> = (props) => {
  return <FontAwesome size={24} style={styles.tabIcon} {...props} />;
};

const styles = StyleSheet.create({
  tabIcon: {
    marginBottom: -3,
  },
});

const TabLayout: FC = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.default,
          borderTopColor: theme.colors.background.paper,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.default,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable onPress={logout} style={{ marginRight: theme.spacing.md }}>
              <FontAwesome name="sign-out" size={20} color={theme.colors.text.secondary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

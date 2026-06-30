import type { ComponentProps, FC } from "react";
import type { ColorValue } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Drawer,
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "expo-router/drawer";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const PERMANENT_BREAKPOINT = 1024;

interface DrawerIconProps {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: ColorValue;
  size: number;
}

const DrawerIcon: FC<DrawerIconProps> = ({ name, color, size }) => {
  return <FontAwesome name={name} size={size} color={color} />;
};

const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = (): void => {
    logout().catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentContainer}>
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      <View
        style={[
          styles.drawerFooter,
          { backgroundColor: theme.colors.background.paper, padding: theme.spacing.md },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={handleLogout}
          style={[styles.logoutButton, { padding: theme.spacing.sm }]}>
          <FontAwesome name="sign-out" size={20} color={theme.colors.text.secondary} />
          <Text
            style={[
              styles.logoutLabel,
              { color: theme.colors.text.primary, marginLeft: theme.spacing.sm },
            ]}>
            Sign out
          </Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const TabsLayout: FC = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const drawerType = width >= PERMANENT_BREAKPOINT ? "permanent" : "front";

  const handleHeaderLogout = (): void => {
    logout().catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType,
        drawerActiveTintColor: theme.colors.primary.main,
        drawerInactiveTintColor: theme.colors.text.secondary,
        drawerActiveBackgroundColor: theme.colors.background.highlight,
        drawerStyle: {
          backgroundColor: theme.colors.background.default,
          borderRightColor: theme.colors.border.light,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.default,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={handleHeaderLogout}
            style={[styles.headerLogout, { marginRight: theme.spacing.md }]}>
            <FontAwesome name="sign-out" size={20} color={theme.colors.text.secondary} />
          </Pressable>
        ),
        sceneStyle: {
          backgroundColor: theme.colors.background.default,
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => <DrawerIcon name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="stats"
        options={{
          title: "Stats",
          drawerIcon: ({ color, size }) => (
            <DrawerIcon name="bar-chart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => <DrawerIcon name="user" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => <DrawerIcon name="cog" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
  },
  drawerItems: {
    flex: 1,
  },
  drawerFooter: {},
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutLabel: {
    fontWeight: "500",
  },
  headerLogout: {
    padding: 4,
  },
});

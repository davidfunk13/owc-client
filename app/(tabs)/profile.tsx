import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Heading } from "@/components/Heading/Heading";
import { Screen } from "@/components/Screen/Screen";
import { Stat } from "@/components/Stat/Stat";

const ProfileScreen: FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const battletag = user?.battletag;

  const handleLogout = useCallback((): void => {
    logout().catch((error) => {
      console.error("Logout failed:", error);
    });
  }, [logout]);

  return (
    <Screen>
      <View style={[styles.profileHeader, { padding: theme.spacing.xl }]}>
        {user?.avatar ? (
          <Image
            accessibilityLabel="Avatar"
            source={{ uri: user.avatar }}
            contentFit="cover"
            transition={200}
            style={[
              styles.avatar,
              {
                borderRadius: theme.radius.full,
                marginBottom: theme.spacing.md,
                backgroundColor: theme.colors.background.paper,
              },
            ]}
          />
        ) : (
          <View
            accessibilityLabel="Avatar placeholder"
            style={[
              styles.avatarPlaceholder,
              {
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.background.paper,
                marginBottom: theme.spacing.md,
              },
            ]}>
            <Stat style={styles.avatarText}>{battletag?.charAt(0).toUpperCase()}</Stat>
          </View>
        )}
        <Heading size="lg">{battletag}</Heading>
      </View>

      <Card>
        <Heading style={{ marginBottom: theme.spacing.md }}>Account</Heading>
        <View style={[styles.infoRow, { paddingVertical: theme.spacing.sm }]}>
          <Body muted>Battle.net ID</Body>
          <Body>{user?.battlenet_id || "--"}</Body>
        </View>
      </Card>

      <Button title="Sign Out" onPress={handleLogout} variant="danger" />
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

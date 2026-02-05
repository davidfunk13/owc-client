import type { FC } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Screen } from "@/components/Screen/Screen";
import { Card } from "@/components/Card/Card";
import { ThemedText } from "@/components/ThemedText/ThemedText";
import { Button } from "@/components/Button/Button";

const ProfileScreen: FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const battletag = user?.battletag;

  return (
    <Screen>
      <View style={[styles.profileHeader, { padding: theme.spacing.xl }]}>
        {user?.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={[
              styles.avatar,
              { borderRadius: theme.radius.full, marginBottom: theme.spacing.md },
            ]}
          />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              {
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.background.paper,
                marginBottom: theme.spacing.md,
              },
            ]}>
            <ThemedText variant="stat" style={styles.avatarText}>
              {battletag?.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        )}
        <ThemedText variant="heading">{battletag}</ThemedText>
      </View>

      <Card>
        <ThemedText variant="title" style={{ marginBottom: theme.spacing.md }}>
          Account
        </ThemedText>
        <View style={[styles.infoRow, { paddingVertical: theme.spacing.sm }]}>
          <ThemedText variant="secondary">Battle.net ID</ThemedText>
          <ThemedText variant="body">{user?.battlenet_id || "--"}</ThemedText>
        </View>
      </Card>

      <Button title="Sign Out" onPress={logout} variant="danger" />
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

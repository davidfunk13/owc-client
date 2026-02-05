import type { FC } from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed/Themed";
import { useTheme } from "@/contexts/ThemeContext";

const NotFoundScreen: FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.colors.primary.main }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});

export default NotFoundScreen;

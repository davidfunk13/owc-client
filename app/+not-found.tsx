import type { FC } from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Body } from "@/components/Body/Body";
import { Heading } from "@/components/Heading/Heading";

const NotFoundScreen: FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Heading size="md">This screen doesn't exist.</Heading>

        <Link href="/" style={styles.link}>
          <Body>Go to home screen!</Body>
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

export default NotFoundScreen;

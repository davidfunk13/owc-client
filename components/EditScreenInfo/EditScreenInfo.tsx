import { memo } from "react";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { MonoText } from "@/components/StyledText/StyledText";
import { Text, View } from "@/components/Themed/Themed";
import { useTheme } from "@/contexts/ThemeContext";
import type { EditScreenInfoProps } from "@/types/components";

const EditScreenInfoComponent: FC<EditScreenInfoProps> = ({ path }) => {
  const { theme } = useTheme();

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={[styles.getStartedText, { color: theme.colors.text.muted }]}>
          Open up the code for this screen:
        </Text>

        <View
          style={[
            styles.codeHighlightContainer,
            styles.homeScreenFilename,
            { backgroundColor: theme.colors.background.highlight },
          ]}>
          <MonoText>{path}</MonoText>
        </View>

        <Text style={[styles.getStartedText, { color: theme.colors.text.muted }]}>
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={[styles.helpLinkText, { color: theme.colors.primary.main }]}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
};

export const EditScreenInfo = memo(EditScreenInfoComponent);

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});

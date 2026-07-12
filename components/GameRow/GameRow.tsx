import { memo, useCallback } from "react";
import type { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/Badge/Badge";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { formatGameDate, gameResultBadge, queueLabel, roleLabel } from "@/lib/game";
import type { GameRowProps } from "@/types/components";

const GameRowComponent: FC<GameRowProps> = ({ game, onPress }) => {
  const { theme } = useTheme();
  const badge = gameResultBadge(game.result);
  const heroes = (game.heroes ?? [])
    .map((hero) => hero.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const meta = [
    roleLabel(game.role_played),
    queueLabel(game.queue_type),
    formatGameDate(game.played_at),
  ]
    .filter(Boolean)
    .join(" · ");

  const handlePress = useCallback((): void => {
    onPress?.(game.id);
  }, [onPress, game.id]);

  const content = (
    <Card>
      <View style={[styles.row, { gap: theme.spacing.md }]}>
        <Badge label={badge.label} tone={badge.tone} />
        <View style={styles.body}>
          <Body>{game.map?.name ?? "No map"}</Body>
          <Caption tiny>{heroes ? `${heroes} · ${meta}` : meta}</Caption>
        </View>
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Game on ${game.map?.name ?? "no map"}, ${badge.label}`}
      onPress={handlePress}>
      {content}
    </Pressable>
  );
};

export const GameRow = memo(GameRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    flex: 1,
  },
});

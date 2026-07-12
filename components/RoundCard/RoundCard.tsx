import { memo, useCallback } from "react";
import type { FC } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/Badge/Badge";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { gameResultBadge } from "@/lib/game";
import type { GameRound } from "@/types/game";
import type { RoundCardProps } from "@/types/components";

const roundSummary = (round: GameRound): string => {
  const parts: string[] = [];
  if (round.submap?.name) {
    parts.push(round.submap.name);
  }
  if (round.side) {
    parts.push(round.side === "attack" ? "Attack" : "Defense");
  }
  if (round.checkpoints_reached !== null) {
    parts.push(`${round.checkpoints_reached} checkpoints`);
  }
  if (round.distance_meters !== null) {
    parts.push(`${round.distance_meters}m`);
  }
  if (round.score_team !== null && round.score_enemy !== null) {
    parts.push(`${round.score_team}–${round.score_enemy}`);
  }
  if (round.is_overtime) {
    parts.push("OT");
  }
  return parts.join(" · ");
};

const RoundCardComponent: FC<RoundCardProps> = ({ round, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const badge = gameResultBadge(round.result);
  const heroes = (round.heroes ?? [])
    .map((hero) => hero.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const summary = roundSummary(round);

  const handleEdit = useCallback((): void => onEdit?.(round), [onEdit, round]);
  const handleDelete = useCallback((): void => onDelete?.(round), [onDelete, round]);

  return (
    <Card>
      <View style={[styles.headerRow, { gap: theme.spacing.sm }]}>
        <Body>Round {round.round_number}</Body>
        <Badge label={badge.label} tone={badge.tone} />
        <View style={styles.spacer} />
        {onEdit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit round ${round.round_number}`}
            hitSlop={8}
            onPress={handleEdit}>
            <FontAwesome name="pencil" size={16} color={theme.colors.text.secondary} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete round ${round.round_number}`}
            hitSlop={8}
            onPress={handleDelete}>
            <FontAwesome name="trash" size={16} color={theme.colors.text.secondary} />
          </Pressable>
        ) : null}
      </View>
      {summary ? <Caption tiny>{summary}</Caption> : null}
      {heroes ? <Caption tiny>{heroes}</Caption> : null}
    </Card>
  );
};

export const RoundCard = memo(RoundCardComponent);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    flex: 1,
  },
});

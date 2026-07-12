import { memo } from "react";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Body } from "@/components/Body/Body";
import { Caption } from "@/components/Caption/Caption";
import { TIER_OPTIONS } from "@/constants/game";
import { roleLabel } from "@/lib/game";
import type { SnapshotSummaryProps } from "@/types/components";
import type { RankSnapshot } from "@/types/game";

const formatRank = (rank: RankSnapshot): string => {
  const tier = TIER_OPTIONS.find((option) => option.value === rank.tier)?.label ?? rank.tier;
  const tierPart = rank.division ? `${tier} ${rank.division}` : tier;
  const progress = rank.progress_percent !== null ? ` · ${rank.progress_percent}%` : "";
  return `${roleLabel(rank.role) ?? rank.role} · ${tierPart}${progress}`;
};

const SnapshotSummaryComponent: FC<SnapshotSummaryProps> = ({ game }) => {
  const { theme } = useTheme();
  const ranks = game.rank_snapshots ?? [];
  const heroSrs = game.hero_srs ?? [];

  if (ranks.length === 0 && heroSrs.length === 0) {
    return <Caption>No rank or SR recorded yet.</Caption>;
  }

  return (
    <View style={[styles.root, { gap: theme.spacing.xs }]}>
      {ranks.map((rank) => (
        <Body key={rank.id}>{formatRank(rank)}</Body>
      ))}
      {heroSrs.map((snapshot) => (
        <Caption key={snapshot.id} tiny>
          {`${snapshot.name ?? `Hero ${snapshot.hero_id}`} · ${snapshot.sr_value} SR`}
        </Caption>
      ))}
    </View>
  );
};

export const SnapshotSummary = memo(SnapshotSummaryComponent);

const styles = StyleSheet.create({
  root: {},
});

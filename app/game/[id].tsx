import type { FC, ReactElement } from "react";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/Badge/Badge";
import { Body } from "@/components/Body/Body";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import { Button } from "@/components/Button/Button";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Field } from "@/components/Field/Field";
import { Heading } from "@/components/Heading/Heading";
import { LogGameForm } from "@/components/LogGameForm/LogGameForm";
import { Modal } from "@/components/Modal/Modal";
import { RoundCard } from "@/components/RoundCard/RoundCard";
import { RoundForm } from "@/components/RoundForm/RoundForm";
import { Screen } from "@/components/Screen/Screen";
import { SnapshotForm } from "@/components/SnapshotForm/SnapshotForm";
import { SnapshotSummary } from "@/components/SnapshotSummary/SnapshotSummary";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useDeleteGame } from "@/hooks/useDeleteGame";
import { useDeleteRound } from "@/hooks/useDeleteRound";
import { useGame } from "@/hooks/useGame";
import { formatGameDate, gameResultBadge, queueLabel, roleLabel } from "@/lib/game";
import type { GameRound } from "@/types/game";

const GameDetailScreen: FC = () => {
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams<{ id: string }>();
  const gameId = Number(params.id);
  const gameQuery = useGame(gameId);
  const deleteGame = useDeleteGame();
  const deleteRound = useDeleteRound();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [roundSheetVisible, setRoundSheetVisible] = useState(false);
  const [editingRound, setEditingRound] = useState<GameRound | null>(null);
  const [deletingRound, setDeletingRound] = useState<GameRound | null>(null);
  const [snapshotSheetVisible, setSnapshotSheetVisible] = useState(false);

  const game = gameQuery.data;

  const goBack = useCallback((): void => {
    router.back();
  }, []);
  const openEdit = useCallback((): void => setEditing(true), []);
  const closeEdit = useCallback((): void => setEditing(false), []);
  const askDelete = useCallback((): void => setConfirmingDelete(true), []);
  const cancelDelete = useCallback((): void => setConfirmingDelete(false), []);

  const confirmDelete = useCallback((): void => {
    deleteGame.mutate(gameId, {
      onSuccess: () => {
        setConfirmingDelete(false);
        router.back();
      },
    });
  }, [deleteGame, gameId]);

  const openAddRound = useCallback((): void => {
    setEditingRound(null);
    setRoundSheetVisible(true);
  }, []);
  const openEditRound = useCallback((round: GameRound): void => {
    setEditingRound(round);
    setRoundSheetVisible(true);
  }, []);
  const closeRoundSheet = useCallback((): void => setRoundSheetVisible(false), []);
  const askDeleteRound = useCallback((round: GameRound): void => setDeletingRound(round), []);
  const cancelDeleteRound = useCallback((): void => setDeletingRound(null), []);
  const openSnapshots = useCallback((): void => setSnapshotSheetVisible(true), []);
  const closeSnapshots = useCallback((): void => setSnapshotSheetVisible(false), []);

  const confirmDeleteRound = useCallback((): void => {
    if (!deletingRound) {
      return;
    }
    deleteRound.mutate(deletingRound.id, {
      onSuccess: () => setDeletingRound(null),
    });
  }, [deleteRound, deletingRound]);

  const renderBody = (): ReactElement => {
    if (gameQuery.isLoading) {
      return (
        <View style={[styles.section, { gap: theme.spacing.md }]}>
          <Skeleton height={28} width="50%" />
          <Skeleton height={160} />
        </View>
      );
    }

    if (gameQuery.isError || !game) {
      return (
        <Card>
          <EmptyState
            title="Couldn't load game"
            description="It may have been deleted, or the server is unreachable."
            action={<Button title="Retry" onPress={gameQuery.refetch} />}
          />
        </Card>
      );
    }

    const badge = gameResultBadge(game.result);
    const heroes =
      (game.heroes ?? [])
        .map((hero) => (hero.is_primary ? `★ ${hero.name ?? ""}` : (hero.name ?? "")))
        .filter(Boolean)
        .join(", ") || "—";

    return (
      <View style={[styles.section, { gap: theme.spacing.md }]}>
        <View style={styles.badgeRow}>
          <Badge label={badge.label} tone={badge.tone} />
        </View>
        <Heading size="lg">{game.map?.name ?? "No map"}</Heading>
        <Caption>{formatGameDate(game.played_at, true)}</Caption>

        <Card>
          <View style={[styles.details, { gap: theme.spacing.md }]}>
            <Field label="Queue">
              <Body>{queueLabel(game.queue_type)}</Body>
            </Field>
            <Field label="Role">
              <Body>{roleLabel(game.role_played) ?? "—"}</Body>
            </Field>
            <Field label="Heroes">
              <Body>{heroes}</Body>
            </Field>
            <Field label="Notes">
              <Body>{game.notes ?? "—"}</Body>
            </Field>
          </View>
        </Card>

        <View style={[styles.rounds, { gap: theme.spacing.sm }]}>
          <Heading size="sm">Rounds</Heading>
          {(game.rounds ?? []).length === 0 ? (
            <Caption>No rounds logged yet. Add one per point or half as you play.</Caption>
          ) : (
            (game.rounds ?? []).map((round) => (
              <RoundCard
                key={round.id}
                onDelete={askDeleteRound}
                onEdit={openEditRound}
                round={round}
              />
            ))
          )}
          <Button title="＋ Add round" onPress={openAddRound} />
        </View>

        <View style={[styles.rounds, { gap: theme.spacing.sm }]}>
          <Heading size="sm">Rank & SR</Heading>
          <SnapshotSummary game={game} />
          <Button title="Edit rank & SR" onPress={openSnapshots} />
        </View>

        <View style={[styles.actions, { gap: theme.spacing.sm }]}>
          <Button title="Edit game" onPress={openEdit} />
          <Button variant="danger" title="Delete game" onPress={askDelete} />
        </View>
      </View>
    );
  };

  return (
    <Screen scroll edges={["top", "bottom"]}>
      <View
        style={[
          styles.header,
          {
            padding: theme.spacing.md,
            gap: theme.spacing.md,
            borderBottomColor: theme.colors.border.light,
          },
        ]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack}>
          <FontAwesome name="chevron-left" size={20} color={theme.colors.text.primary} />
        </Pressable>
        <Heading size="md">Game</Heading>
      </View>

      <View style={[styles.body, { padding: theme.spacing.md }]}>{renderBody()}</View>

      <BottomSheet onClose={closeEdit} title="Edit game" visible={editing}>
        <ScrollView style={[styles.sheetScroll, { maxHeight: height * 0.75 }]}>
          {game ? <LogGameForm game={game} layout="sheet" onDone={closeEdit} /> : null}
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        onClose={closeRoundSheet}
        title={editingRound ? "Edit round" : "Add round"}
        visible={roundSheetVisible}>
        <ScrollView style={[styles.sheetScroll, { maxHeight: height * 0.75 }]}>
          {game ? (
            <RoundForm
              key={editingRound?.id ?? "new"}
              game={game}
              onDone={closeRoundSheet}
              round={editingRound ?? undefined}
            />
          ) : null}
        </ScrollView>
      </BottomSheet>

      <BottomSheet onClose={closeSnapshots} title="Rank & SR" visible={snapshotSheetVisible}>
        <ScrollView style={[styles.sheetScroll, { maxHeight: height * 0.75 }]}>
          {game ? <SnapshotForm game={game} onDone={closeSnapshots} /> : null}
        </ScrollView>
      </BottomSheet>

      <Modal onClose={cancelDelete} title="Delete game?" visible={confirmingDelete}>
        <View style={[styles.confirm, { gap: theme.spacing.md }]}>
          <Body muted>This permanently removes the game and its heroes. This can't be undone.</Body>
          <Button
            disabled={deleteGame.isPending}
            variant="danger"
            title="Confirm delete"
            onPress={confirmDelete}
          />
        </View>
      </Modal>

      <Modal onClose={cancelDeleteRound} title="Remove round?" visible={deletingRound !== null}>
        <View style={[styles.confirm, { gap: theme.spacing.md }]}>
          <Body muted>This removes the round and the heroes logged on it.</Body>
          <Button
            disabled={deleteRound.isPending}
            variant="danger"
            title="Remove round"
            onPress={confirmDeleteRound}
          />
        </View>
      </Modal>
    </Screen>
  );
};

export default GameDetailScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  body: {},
  section: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
  },
  badgeRow: {
    flexDirection: "row",
  },
  details: {},
  rounds: {},
  actions: {},
  confirm: {},
  sheetScroll: {
    width: "100%",
  },
});

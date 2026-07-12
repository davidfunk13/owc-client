import type { FC, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { BottomSheet } from "@/components/BottomSheet/BottomSheet";
import { Body } from "@/components/Body/Body";
import { Button } from "@/components/Button/Button";
import { Caption } from "@/components/Caption/Caption";
import { Card } from "@/components/Card/Card";
import { Combobox } from "@/components/Combobox/Combobox";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Field } from "@/components/Field/Field";
import { GameRow } from "@/components/GameRow/GameRow";
import { Input } from "@/components/Input/Input";
import { LogGameForm } from "@/components/LogGameForm/LogGameForm";
import { Screen } from "@/components/Screen/Screen";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGames } from "@/hooks/useGames";
import { useHeroes } from "@/hooks/useHeroes";
import { useMaps } from "@/hooks/useMaps";
import { QUEUE_OPTIONS, RESULT_OPTIONS, ROLE_OPTIONS, STATUS_OPTIONS } from "@/constants/game";
import type { SelectOption, SelectValue } from "@/types/components";
import type { Game, GameFilters, GameResult, GameStatus, QueueType, Role } from "@/types/game";

const HomeRecent: FC = () => {
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const heroesQuery = useHeroes();
  const mapsQuery = useMaps();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<GameResult | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [queue, setQueue] = useState<QueueType | null>(null);
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [mapId, setMapId] = useState<number | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const filters = useMemo<GameFilters>(
    () => ({
      search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      result: result ?? undefined,
      role: role ?? undefined,
      queue_type: queue ?? undefined,
      status: status ?? undefined,
      hero_id: heroId ?? undefined,
      map_id: mapId ?? undefined,
    }),
    [debouncedSearch, result, role, queue, status, heroId, mapId]
  );

  const gamesQuery = useGames(filters);
  const advancedCount = [queue, status, heroId, mapId].filter((value) => value !== null).length;
  const hasFilters = Boolean(filters.search || result || role) || advancedCount > 0;

  const heroOptions = useMemo<SelectOption[]>(
    () => (heroesQuery.data ?? []).map((hero) => ({ label: hero.name, value: hero.id })),
    [heroesQuery.data]
  );
  const mapOptions = useMemo<SelectOption[]>(
    () => (mapsQuery.data ?? []).map((map) => ({ label: map.name, value: map.id })),
    [mapsQuery.data]
  );

  const openSheet = useCallback((): void => setSheetVisible(true), []);
  const closeSheet = useCallback((): void => setSheetVisible(false), []);
  const toggleMore = useCallback((): void => setShowMore((previous) => !previous), []);

  const handleResult = useCallback((value: SelectValue | null): void => {
    setResult(value as GameResult | null);
  }, []);
  const handleRole = useCallback((value: SelectValue | null): void => {
    setRole(value as Role | null);
  }, []);
  const handleQueue = useCallback((value: SelectValue | null): void => {
    setQueue(value as QueueType | null);
  }, []);
  const handleStatus = useCallback((value: SelectValue | null): void => {
    setStatus(value as GameStatus | null);
  }, []);
  const handleHero = useCallback((value: SelectValue | null): void => {
    setHeroId(value === null ? null : Number(value));
  }, []);
  const handleMap = useCallback((value: SelectValue | null): void => {
    setMapId(value === null ? null : Number(value));
  }, []);

  const clearAll = useCallback((): void => {
    setSearch("");
    setResult(null);
    setRole(null);
    setQueue(null);
    setStatus(null);
    setHeroId(null);
    setMapId(null);
  }, []);

  const openGame = useCallback((id: number): void => {
    router.push({ pathname: "/game/[id]", params: { id } });
  }, []);
  const renderItem = useCallback<ListRenderItem<Game>>(
    ({ item }) => <GameRow game={item} onPress={openGame} />,
    [openGame]
  );
  const keyExtractor = useCallback((game: Game): string => String(game.id), []);

  const renderEmpty = (): ReactElement => {
    if (gamesQuery.isLoading) {
      return (
        <View style={{ gap: theme.spacing.sm }}>
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </View>
      );
    }
    if (gamesQuery.isError) {
      return (
        <Card>
          <EmptyState
            title="Couldn't load games"
            description="Something went wrong reaching the server."
            action={<Button title="Retry" onPress={gamesQuery.refetch} />}
          />
        </Card>
      );
    }
    return (
      <Card>
        <EmptyState
          title={hasFilters ? "No games match" : "No games yet"}
          description={
            hasFilters ? "Try clearing a filter." : "Log your first game to fill this out."
          }
        />
      </Card>
    );
  };

  const renderFooter = (): ReactElement | null => {
    if (!gamesQuery.isFetchingNextPage) {
      return null;
    }
    return <ActivityIndicator color={theme.colors.primary.main} style={styles.footer} />;
  };

  return (
    <Screen>
      <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
        <Button title="＋ Log game" onPress={openSheet} />
        <Input onChangeText={setSearch} placeholder="Search notes…" value={search} />
        <Field label="Result">
          <SegmentedControl
            allowDeselect
            onChange={handleResult}
            options={RESULT_OPTIONS}
            value={result}
          />
        </Field>
        <Field label="Role">
          <SegmentedControl
            allowDeselect
            onChange={handleRole}
            options={ROLE_OPTIONS}
            value={role}
          />
        </Field>

        {showMore ? (
          <View style={{ gap: theme.spacing.md }}>
            <Field label="Queue">
              <Combobox
                clearable
                onChange={handleQueue}
                options={QUEUE_OPTIONS}
                placeholder="Any queue"
                value={queue}
              />
            </Field>
            <Field label="Map">
              <Combobox
                clearable
                loading={mapsQuery.isLoading}
                onChange={handleMap}
                options={mapOptions}
                placeholder="Any map"
                searchPlaceholder="Search maps…"
                value={mapId}
              />
              {mapsQuery.isError ? (
                <Caption tiny style={{ color: theme.colors.error.main }}>
                  Couldn&apos;t load maps.
                </Caption>
              ) : null}
            </Field>
            <Field label="Hero">
              <Combobox
                clearable
                loading={heroesQuery.isLoading}
                onChange={handleHero}
                options={heroOptions}
                placeholder="Any hero"
                searchPlaceholder="Search heroes…"
                value={heroId}
              />
              {heroesQuery.isError ? (
                <Caption tiny style={{ color: theme.colors.error.main }}>
                  Couldn&apos;t load heroes.
                </Caption>
              ) : null}
            </Field>
            <Field label="Status">
              <SegmentedControl
                allowDeselect
                onChange={handleStatus}
                options={STATUS_OPTIONS}
                value={status}
              />
            </Field>
          </View>
        ) : null}

        <View style={styles.controlRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showMore ? "Hide more filters" : "Show more filters"}
            onPress={toggleMore}>
            <Body size="sm" style={{ color: theme.colors.primary.main }}>
              {showMore ? "Fewer filters ▲" : "More filters ▼"}
              {!showMore && advancedCount > 0 ? ` (${advancedCount})` : ""}
            </Body>
          </Pressable>
          {hasFilters ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear filters"
              onPress={clearAll}>
              <Body size="sm" style={{ color: theme.colors.text.secondary }}>
                Clear all
              </Body>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        contentContainerStyle={[
          styles.listContent,
          { padding: theme.spacing.md, gap: theme.spacing.sm },
        ]}
        data={gamesQuery.items}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={renderFooter()}
        onEndReached={gamesQuery.fetchNextPage}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        style={styles.list}
      />
      <BottomSheet onClose={closeSheet} title="Log game" visible={sheetVisible}>
        <ScrollView style={[styles.sheetScroll, { maxHeight: height * 0.75 }]}>
          <LogGameForm layout="sheet" onDone={closeSheet} />
        </ScrollView>
      </BottomSheet>
    </Screen>
  );
};

export default HomeRecent;

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  footer: {
    marginVertical: 16,
  },
  sheetScroll: {
    width: "100%",
  },
});

export type Role = "tank" | "damage" | "support";

export type QueueType =
  "competitive_role_queue" | "competitive_open_queue" | "quick_play" | "arcade" | "custom";

export type GameResult = "win" | "loss" | "draw";

export type GameStatus = "in_progress" | "complete";

export interface Hero {
  id: number;
  name: string;
  slug: string;
  role: Role;
  sub_role: string;
  image_url: string | null;
}

export type MapType = "control" | "escort" | "hybrid" | "push" | "flashpoint";

export type RoundSide = "attack" | "defense";

export interface MapSubmap {
  id: number;
  map_id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface GameMap {
  id: number;
  name: string;
  slug: string;
  map_type: MapType;
  image_url: string | null;
  submaps?: MapSubmap[];
}

export interface RoundHero {
  hero_id: number;
  name: string | null;
}

export interface GameRound {
  id: number;
  game_id: number;
  round_number: number;
  map_submap_id: number | null;
  result: GameResult | null;
  side: RoundSide | null;
  score_team: number | null;
  score_enemy: number | null;
  distance_meters: number | null;
  checkpoints_reached: number | null;
  is_overtime: boolean;
  submap?: MapSubmap | null;
  heroes?: RoundHero[];
  created_at: string;
  updated_at: string;
}

export type RankTier =
  "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "grandmaster" | "champion";

export interface RankSnapshot {
  id: number;
  role: Role;
  tier: RankTier;
  division: number | null;
  rank_value: number | null;
  progress_percent: number | null;
}

export interface HeroSrSnapshot {
  id: number;
  hero_id: number;
  name: string | null;
  sr_value: number;
}

export interface GameHero {
  hero_id: number;
  name: string | null;
  is_primary: boolean;
  playtime_seconds: number | null;
}

export interface Game {
  id: number;
  play_session_id: number | null;
  map_id: number | null;
  queue_type: QueueType;
  result: GameResult | null;
  status: GameStatus;
  role_played: Role | null;
  played_at: string;
  duration_seconds: number | null;
  is_placement: boolean;
  data_source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  heroes?: GameHero[];
  map?: GameMap | null;
  rounds?: GameRound[];
  rank_snapshots?: RankSnapshot[];
  hero_srs?: HeroSrSnapshot[];
}

export type CreateGamePayload = {
  play_session_id?: number | null;
  map_id?: number | null;
  queue_type: QueueType;
  status?: GameStatus;
  result?: GameResult | null;
  role_played?: Role | null;
  played_at?: string;
  duration_seconds?: number | null;
  is_placement?: boolean;
  notes?: string | null;
  heroes?: number[];
  primary_hero_id?: number | null;
};

export type UpdateGamePayload = Partial<CreateGamePayload>;

export interface GameFormValues {
  result: GameResult | null;
  queue_type: QueueType;
  role_played: Role | null;
  map_id: number | null;
  heroes: number[];
  notes: string;
}

export interface GameFilters {
  result?: GameResult;
  role?: Role;
  queue_type?: QueueType;
  status?: GameStatus;
  map_id?: number;
  hero_id?: number;
  search?: string;
}

export interface RoundFormValues {
  result: GameResult | null;
  side: RoundSide | null;
  map_submap_id: number | null;
  heroes: number[];
  score_team: number | null;
  score_enemy: number | null;
  distance_meters: number | null;
  checkpoints_reached: number | null;
  is_overtime: boolean;
}

export type CreateRoundPayload = {
  result?: GameResult | null;
  side?: RoundSide | null;
  map_submap_id?: number | null;
  heroes?: number[];
  score_team?: number | null;
  score_enemy?: number | null;
  distance_meters?: number | null;
  checkpoints_reached?: number | null;
  is_overtime?: boolean;
};

export type UpdateRoundPayload = Partial<CreateRoundPayload>;

export interface HeroSrInput {
  hero_id: number;
  hero_name: string;
  sr_value: number | null;
}

export interface SnapshotFormValues {
  role: Role | null;
  tier: RankTier | null;
  division: number | null;
  progress_percent: number | null;
  hero_srs: HeroSrInput[];
}

export type RankInput = {
  role: Role;
  tier: RankTier;
  division?: number | null;
  progress_percent?: number | null;
};

export type SyncSnapshotsPayload = {
  ranks?: RankInput[];
  hero_srs?: { hero_id: number; sr_value: number }[];
};

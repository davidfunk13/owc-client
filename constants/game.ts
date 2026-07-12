import type { SegmentedOption, SelectOption } from "@/types/components";

export const RESULT_OPTIONS: SegmentedOption[] = [
  { label: "Win", value: "win", tone: "success" },
  { label: "Loss", value: "loss", tone: "error" },
  { label: "Draw", value: "draw", tone: "neutral" },
];

export const ROLE_OPTIONS: SegmentedOption[] = [
  { label: "Tank", value: "tank" },
  { label: "Damage", value: "damage" },
  { label: "Support", value: "support" },
];

export const QUEUE_OPTIONS: SelectOption[] = [
  { label: "Competitive · Role Queue", value: "competitive_role_queue" },
  { label: "Competitive · Open Queue", value: "competitive_open_queue" },
  { label: "Quick Play", value: "quick_play" },
  { label: "Arcade", value: "arcade" },
  { label: "Custom Game", value: "custom" },
];

export const STATUS_OPTIONS: SegmentedOption[] = [
  { label: "In progress", value: "in_progress" },
  { label: "Complete", value: "complete" },
];

export const ROUND_RESULT_OPTIONS: SegmentedOption[] = [
  { label: "Win", value: "win", tone: "success" },
  { label: "Loss", value: "loss", tone: "error" },
];

export const SIDE_OPTIONS: SegmentedOption[] = [
  { label: "Attack", value: "attack" },
  { label: "Defense", value: "defense" },
];

export const TIER_OPTIONS: SelectOption[] = [
  { label: "Bronze", value: "bronze" },
  { label: "Silver", value: "silver" },
  { label: "Gold", value: "gold" },
  { label: "Platinum", value: "platinum" },
  { label: "Diamond", value: "diamond" },
  { label: "Master", value: "master" },
  { label: "Grandmaster", value: "grandmaster" },
  { label: "Champion", value: "champion" },
];

export const DIVISION_OPTIONS: SegmentedOption[] = [
  { label: "5", value: 5 },
  { label: "4", value: 4 },
  { label: "3", value: 3 },
  { label: "2", value: 2 },
  { label: "1", value: 1 },
];

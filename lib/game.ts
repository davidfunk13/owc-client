import { QUEUE_OPTIONS, ROLE_OPTIONS } from "@/constants/game";
import type { BadgeTone } from "@/types/components";
import type { GameResult, QueueType, Role } from "@/types/game";

export function gameResultBadge(result: GameResult | null): { label: string; tone: BadgeTone } {
  if (result === "win") {
    return { label: "Win", tone: "success" };
  }
  if (result === "loss") {
    return { label: "Loss", tone: "error" };
  }
  if (result === "draw") {
    return { label: "Draw", tone: "neutral" };
  }
  return { label: "In progress", tone: "neutral" };
}

export function queueLabel(queue: QueueType): string {
  return QUEUE_OPTIONS.find((option) => option.value === queue)?.label ?? queue;
}

export function roleLabel(role: Role | null): string | null {
  if (role === null) {
    return null;
  }
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

const GAME_DATE_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatGameDate(iso: string, withYear = false): string {
  const date = new Date(iso);
  const base = `${GAME_DATE_MONTHS[date.getMonth()]} ${date.getDate()}`;
  return withYear ? `${base}, ${date.getFullYear()}` : base;
}

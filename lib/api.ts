import { Platform } from "react-native";
import { config } from "../config";
import { storage } from "./storage";
import { ApiError, NetworkError } from "@/types/errors";
import type { User } from "@/types/User";
import type { RequestOptions } from "@/types/api";
import type {
  CreateGamePayload,
  CreateRoundPayload,
  Game,
  GameFilters,
  GameMap,
  GameRound,
  Hero,
  SyncSnapshotsPayload,
  UpdateGamePayload,
  UpdateRoundPayload,
} from "@/types/game";
import type { Paginated } from "@/types/pagination";

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let token: string | null = null;

  try {
    token = await storage.getToken();
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
  }

  const { method = "GET", body, headers = {} } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Platform": Platform.OS,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(`${config.apiUrl}${endpoint}`, fetchOptions);
  } catch (error) {
    throw new NetworkError(
      error instanceof Error ? error.message : "Failed to connect to the server"
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedHandler?.();
    }

    let errorMessage: string | undefined;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message ?? errorBody.error;
    } catch {
      // Body wasn't JSON; fall through with errorMessage undefined.
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(response.status, "Invalid JSON", "Failed to parse response");
  }
}

export const api = {
  getUser: () => request<User>("/api/auth/user"),
  logout: () => request<{ message: string }>("/api/auth/logout", { method: "POST" }),
  exchangeCode: (code: string) =>
    request<{ token: string }>("/api/auth/exchange", { method: "POST", body: { code } }),
  getHeroes: () => request<Hero[]>("/api/heroes"),
  getMaps: () => request<GameMap[]>("/api/maps"),
  getGames: (filters?: GameFilters, page = 1) => {
    const query = [
      `page=${page}`,
      ...Object.entries(filters ?? {})
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`),
    ].join("&");
    return request<Paginated<Game>>(`/api/games?${query}`);
  },
  getGame: (id: number) => request<{ data: Game }>(`/api/games/${id}`).then((res) => res.data),
  createGame: (payload: CreateGamePayload) =>
    request<{ data: Game }>("/api/games", { method: "POST", body: payload }).then(
      (res) => res.data
    ),
  updateGame: (id: number, payload: UpdateGamePayload) =>
    request<{ data: Game }>(`/api/games/${id}`, { method: "PUT", body: payload }).then(
      (res) => res.data
    ),
  deleteGame: (id: number) =>
    request<{ message: string }>(`/api/games/${id}`, { method: "DELETE" }),
  createRound: (gameId: number, payload: CreateRoundPayload) =>
    request<{ data: GameRound }>(`/api/games/${gameId}/rounds`, {
      method: "POST",
      body: payload,
    }).then((res) => res.data),
  updateRound: (id: number, payload: UpdateRoundPayload) =>
    request<{ data: GameRound }>(`/api/rounds/${id}`, { method: "PUT", body: payload }).then(
      (res) => res.data
    ),
  deleteRound: (id: number) =>
    request<{ message: string }>(`/api/rounds/${id}`, { method: "DELETE" }),
  syncSnapshots: (gameId: number, payload: SyncSnapshotsPayload) =>
    request<{ data: Game }>(`/api/games/${gameId}/snapshots`, {
      method: "PUT",
      body: payload,
    }).then((res) => res.data),
};

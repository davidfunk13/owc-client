import * as Linking from "expo-linking";
import { storage } from "./storage";
import { api } from "./api";
import { config } from "../config";
import type { User } from "@/types/User";
import type { CallbackParams } from "@/types/auth";

export function getStoredToken(): Promise<string | null> {
  return storage.getToken();
}

export function saveToken(token: string): Promise<void> {
  return storage.setToken(token);
}

export function clearToken(): Promise<void> {
  return storage.removeToken();
}

export function fetchUser(): Promise<User> {
  return api.getUser();
}

export async function logout(): Promise<void> {
  try {
    await api.logout();
  } catch (error) {
    console.warn("Logout request failed; clearing local session anyway:", error);
  }
  await clearToken();
}

export function buildAuthUrl(platform: string): string {
  return `${config.apiUrl}/auth/battlenet/redirect?platform=${platform}`;
}

export function parseCallbackUrl(url: string): CallbackParams {
  const parsed = Linking.parse(url);
  return {
    code: parsed.queryParams?.code as string | undefined,
    error: parsed.queryParams?.error as string | undefined,
  };
}

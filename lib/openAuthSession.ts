import * as WebBrowser from "expo-web-browser";
import type { OpenAuthSessionResult } from "@/types/auth";

const REDIRECT_URL = "owc://auth/callback";

export async function openAuthSession(authUrl: string): Promise<OpenAuthSessionResult> {
  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URL);
  if (result.type === "success" && result.url) {
    return { url: result.url };
  }
  return { url: null };
}

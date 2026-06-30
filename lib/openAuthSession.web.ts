import type { OpenAuthSessionResult } from "@/types/auth";

export async function openAuthSession(authUrl: string): Promise<OpenAuthSessionResult> {
  window.location.href = authUrl;
  return { url: null };
}

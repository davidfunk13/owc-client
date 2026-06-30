import { Platform } from "react-native";
import { config } from "../config";
import { storage } from "./storage";
import { ApiError, NetworkError } from "@/types/errors";
import type { User } from "@/types/User";
import type { RequestOptions } from "@/types/api";

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
};

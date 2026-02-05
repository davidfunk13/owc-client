import type { FC, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "../lib/auth";
import { useAuthDeepLink } from "../hooks/useAuthDeepLink";
import type { AuthContextValue, AuthState } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const queryClient = useQueryClient();

  const fetchUser = useCallback(async (token: string) => {
    try {
      const user = await authService.fetchUser();
      setState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      await authService.clearToken();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const handleAuthCallback = useCallback(
    async (url: string) => {
      const { token } = authService.parseCallbackUrl(url);

      if (token) {
        await authService.saveToken(token);
        await fetchUser(token);
        router.replace("/(tabs)");
      }
    },
    [fetchUser]
  );

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const token = await authService.getStoredToken();
        if (token) {
          await fetchUser(token);
          return;
        }
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, [fetchUser]);

  useAuthDeepLink(handleAuthCallback);

  const login = useCallback(async () => {
    try {
      const authUrl = authService.buildAuthUrl(Platform.OS);

      if (Platform.OS === "web") {
        window.location.href = authUrl;
        return;
      }

      const redirectUrl = "owc://auth/callback";
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === "success" && result.url) {
        await handleAuthCallback(result.url);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, [handleAuthCallback]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    queryClient.clear();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

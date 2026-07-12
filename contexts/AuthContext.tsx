import type { FC, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "@/lib/auth";
import { api, setUnauthorizedHandler } from "@/lib/api";
import { openAuthSession } from "@/lib/openAuthSession";
import { useAuthDeepLink } from "@/hooks/useAuthDeepLink";
import { useUser } from "@/hooks/useUser";
import { queryKeys } from "@/hooks/queryKeys";
import type { AuthContextValue } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  const userQuery = useUser(token);

  useEffect(() => {
    let cancelled = false;
    authService
      .getStoredToken()
      .then((stored) => {
        if (!cancelled) {
          setToken(stored);
          setTokenChecked(true);
        }
      })
      .catch((error) => {
        console.error("Failed to check auth status:", error);
        if (!cancelled) {
          setTokenChecked(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      authService.clearToken().catch((error) => {
        console.error("Failed to clear invalid token:", error);
      });
      setToken(null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.user() });
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  const exchangingRef = useRef<string | null>(null);

  const completeAuth = useCallback(
    async (code: string): Promise<void> => {
      if (exchangingRef.current === code) {
        return;
      }
      exchangingRef.current = code;
      try {
        const { token: newToken } = await api.exchangeCode(code);
        await authService.saveToken(newToken);
        setToken(newToken);
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      } catch (error) {
        exchangingRef.current = null;
        throw error;
      }
    },
    [queryClient]
  );

  const handleAuthCallback = useCallback(
    async (url: string): Promise<void> => {
      const { code } = authService.parseCallbackUrl(url);

      if (code) {
        await completeAuth(code);
      }
    },
    [completeAuth]
  );

  useAuthDeepLink(handleAuthCallback);

  const login = useCallback(async (): Promise<void> => {
    const authUrl = authService.buildAuthUrl(Platform.OS);
    const result = await openAuthSession(authUrl);
    if (result.url) {
      await handleAuthCallback(result.url);
    }
  }, [handleAuthCallback]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const isLoading = !tokenChecked || (!!token && userQuery.isLoading);
  const user = token && userQuery.isSuccess ? userQuery.data : null;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        completeAuth,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

import type { User } from "./User";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeAuth: (code: string) => Promise<void>;
}

export interface CallbackParams {
  code?: string;
  error?: string;
}

export interface OpenAuthSessionResult {
  url: string | null;
}

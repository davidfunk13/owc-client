import type { AuthCallbackHandler } from "@/types/hooks";

export function useAuthDeepLink(_onCallback: AuthCallbackHandler): void {
  // Web auth is handled by the /auth/callback route (callback.web.tsx), which
  // exchanges the single-use code. This hook is a deliberate no-op on web so the
  // code is never consumed twice.
}

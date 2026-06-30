import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/auth";
import { queryKeys } from "@/hooks/queryKeys";
import type { ApiError, NetworkError } from "@/types/errors";
import type { User } from "@/types/User";

export function useUser(token: string | null): UseQueryResult<User, ApiError | NetworkError> {
  return useQuery<User, ApiError | NetworkError>({
    queryKey: queryKeys.auth.user(),
    queryFn: () => fetchUser(),
    enabled: !!token,
    retry: false,
  });
}

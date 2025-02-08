import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { User } from "@/lib/types";
import type { ApiError } from "@/lib/errors";

type UserQueryAction =
  | { type: "current_user" }
  | { type: "users" }
  | { type: "user"; userId: number };

type UserQueryResult<T extends UserQueryAction> = T extends {
  type: "current_user";
}
  ? User
  : T extends { type: "users" }
  ? User[]
  : T extends { type: "user" }
  ? User
  : never;

function useUserQuery<T extends UserQueryAction>(
  action: T,
  options?: Partial<UseQueryOptions<UserQueryResult<T>, ApiError>>
): UseQueryResult<UserQueryResult<T>, ApiError> {
  const queryKey = (() => {
    switch (action.type) {
      case "current_user":
        return [QUERY_KEYS.AUTH];
      case "users":
        return [QUERY_KEYS.USERS];
      case "user":
        return [QUERY_KEYS.USERS, action.userId];
      default:
        throw new Error(`Invalid action type: ${(action as never).type}`);
    }
  })();

  return useQuery<UserQueryResult<T>, ApiError>({
    ...options,
    queryKey,
    queryFn: async () => {
      switch (action.type) {
        case "current_user": {
          const { data } = await fetchWithHandler<{ data: User }>("/auth");
          return data as UserQueryResult<T>;
        }
        case "users": {
          const { data } = await fetchWithHandler<{ data: User[] }>("/users");
          return data as UserQueryResult<T>;
        }
        case "user": {
          const { data } = await fetchWithHandler<{ data: User }>(
            `/users/${action.userId}`
          );
          return data as UserQueryResult<T>;
        }
        default:
          throw new Error(`Invalid action type: ${(action as never).type}`);
      }
    },
  });
}

export default useUserQuery;

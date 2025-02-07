import { QUERY_KEYS, queryKeys } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Profile, User } from "@/lib/types";
import type { ApiError } from "@/lib/errors";

type Action =
  | {
      userId?: number;
      type: "profiles";
    }
  | {
      userId: number;
      type: "profile";
    };

function useProfileQuery(
  action: {
    userId?: number;
    type: "profiles";
  },
  queryOptions?: Partial<UseQueryOptions>
): UseQueryResult<Profile[], ApiError>;

function useProfileQuery(
  action: {
    userId: number;
    type: "profile";
  },
  queryOptions?: Partial<UseQueryOptions>
): UseQueryResult<Profile, ApiError>;

function useProfileQuery(
  action: Action,
  queryOptions: Partial<UseQueryOptions> = {} as UseQueryOptions
): UseQueryResult<Profile[] | Profile> {
  // Specify ApiError as the error type
  return useQuery<
    Profile[] | Profile,
    ApiError,
    Profile[] | Profile,
    readonly string[]
  >({
    ...queryOptions,
    queryFn: async () => {
      const route = `/users/${action.userId}/profile`;
      switch (action.type) {
        case "profiles": {
          const res = await fetchWithHandler<{ data: Profile[] }>("/profiles");
          const { data } = res;
          return data;
        }
        case "profile": {
          const res = await fetchWithHandler<{ data: Profile }>(route);
          const { data } = res;
          return data;
        }
        default: {
          throw new TypeError("Invalid useUserQuery action type");
        }
      }
    },
    queryKey:
      queryOptions.queryKey ?? (QUERY_KEYS.profilesKey as readonly string[]),
  });
}

export default useProfileQuery;

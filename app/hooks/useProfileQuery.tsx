import { QUERY_KEYS, queryKeys } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Profile, User } from "@/lib/types";

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
  queryOptions?: UseQueryOptions
): UseQueryResult<Profile[]>;

function useProfileQuery(
  action: {
    userId: number;
    type: "profile";
  },
  queryOptions?: UseQueryOptions
): UseQueryResult<Profile>;

function useProfileQuery(
  action: Action,
  queryOptions: Partial<UseQueryOptions> = {} as UseQueryOptions
): UseQueryResult<Profile[] | Profile> {
  return useQuery({
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
    queryKey: queryOptions.queryKey ?? QUERY_KEYS.profilesKey,
  });
}

export default useProfileQuery;

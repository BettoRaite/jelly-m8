import { queryKeys } from "@/lib/config";
import {
  useQuery,
  type QueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Profile, User } from "@/lib/types";

type Action =
  | {
      id?: number;
      type: "profiles";
      queryKey?: string[];
    }
  | {
      id?: number;
      type: "get_many";
      queryKey?: string[];
    }
  | {
      id: number;
      type: "get";
      queryKey?: string[];
    };

function useProfileQuery(
  action: {
    id?: number;
    type: "profiles";
    queryKey?: string[];
  },
  queryOptions?: QueryOptions
): UseQueryResult<Profile[]>;

function useProfileQuery(
  action: {
    id: number;
    type: "get";
    queryKey?: string[];
  },
  queryOptions?: QueryOptions
): UseQueryResult<Profile>;

function useProfileQuery(
  action: Action,
  queryOptions: QueryOptions = {}
): UseQueryResult<Profile[] | Profile> {
  return useQuery({
    queryKey: action.queryKey ?? queryKeys.profilesKey,
    queryFn: async () => {
      const route = `/profiles/${action.id ? action.id : ""}`;
      switch (action.type) {
        case "profiles": {
          const res = await fetchWithHandler<{ data: Profile[] }>(route);
          const { data } = res;
          return data;
        }
        case "get": {
          const res = await fetchWithHandler<{ data: Profile }>(route);
          const { data } = res;
          return data;
        }
        default: {
          throw new TypeError("Invalid useUserQuery action type");
        }
      }
    },
    ...queryOptions,
  });
}

export default useProfileQuery;

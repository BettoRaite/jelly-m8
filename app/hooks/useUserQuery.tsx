import { queryKeys } from "@/lib/config";
import {
  useQuery,
  type QueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { User } from "@/lib/types";

type Action =
  | {
      type: "current_user";
      queryKey: string[];
    }
  | {
      type: "users";
      queryKey: string[];
    };

// Overload signatures for useUserQuery
function useUserQuery(
  action: {
    type: "current_user";
    queryKey: string[];
  },
  queryOptions?: QueryOptions
): UseQueryResult<User>;

function useUserQuery(
  action: {
    type: "users";
    queryKey: string[];
  },
  queryOptions?: QueryOptions
): UseQueryResult<User[]>;

function useUserQuery(
  action: Action,
  queryOptions: QueryOptions = {}
): UseQueryResult<User | User[]> {
  return useQuery({
    queryKey: action.queryKey,
    queryFn: async () => {
      const route = "/users";
      switch (action.type) {
        case "current_user": {
          const { data } = await fetchWithHandler<{ data: User }>(
            `${route}/current`,
            undefined
          );
          return data;
        }
        case "users": {
          const res = await fetchWithHandler<{ data: User[] }>(
            route,
            undefined
          );
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

export default useUserQuery;

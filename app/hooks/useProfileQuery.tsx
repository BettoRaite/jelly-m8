import { queryKeys } from "@/lib/config";
import {
  useQuery,
  type QueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Profile, User } from "@/lib/types";

type Action = {
  type: "profiles";
  queryKey: string[];
};

function useProfileQuery(
  action: {
    type: "profiles";
    queryKey: string[];
  },
  queryOptions?: QueryOptions
): UseQueryResult<Profile[]>;

function useProfileQuery(
  action: Action,
  queryOptions: QueryOptions = {}
): UseQueryResult<Profile[]> {
  return useQuery({
    queryKey: action.queryKey,
    queryFn: async () => {
      const route = "/profiles";
      switch (action.type) {
        case "profiles": {
          const res = await fetchWithHandler<{ data: Profile[] }>(route);
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

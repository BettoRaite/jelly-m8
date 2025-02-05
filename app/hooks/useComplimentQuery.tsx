import { queryKeys } from "@/lib/config";
import {
  useQuery,
  type QueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Compliment, Profile, User } from "@/lib/types";

type Action = {
  type: "compliments";
  profileId: number;
};

// Overload signatures for useComplimentQuery
function useComplimentQuery(
  action: {
    type: "compliments";
    profileId: number;
  },
  queryOptions?: QueryOptions
): UseQueryResult<Compliment[]>;

function useComplimentQuery(
  action: Action,
  queryOptions: QueryOptions = {}
): UseQueryResult<Compliment[]> {
  return useQuery({
    queryKey: queryKeys.complimentsKey,
    queryFn: async () => {
      const route = `/profiles/${action.profileId}/compliments`;
      switch (action.type) {
        case "compliments": {
          const { data } = await fetchWithHandler<{ data: Compliment[] }>(
            route
          );
          return data;
        }
        default: {
          throw new TypeError("Invalid useComplimentQuery action type");
        }
      }
    },
    ...queryOptions,
  });
}

export default useComplimentQuery;

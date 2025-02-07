import { queryKeys } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Compliment } from "@/lib/types";
import type { ApiError } from "@/lib/errors";

type Action =
  | {
      type: "compliments";
      profileId: number;
    }
  | {
      type: "user-compliment";
      profileId: number;
    };

// Overload signatures for useComplimentQuery
function useComplimentQuery(
  action: {
    type: "compliments";
    profileId: number;
  },
  queryOptions?: Partial<UseQueryOptions<Compliment[], ApiError>>
): UseQueryResult<Compliment[], ApiError>;

function useComplimentQuery(
  action: {
    type: "user-compliment";
    profileId: number;
  },
  queryOptions?: Partial<UseQueryOptions<Compliment, ApiError>>
): UseQueryResult<Compliment, ApiError>;

function useComplimentQuery(
  action: Action,
  queryOptions: Partial<
    UseQueryOptions<Compliment[] | Compliment, ApiError>
  > = {}
): UseQueryResult<Compliment[] | Compliment, ApiError> {
  const { type, profileId } = action;

  return useQuery<Compliment[] | Compliment, ApiError>({
    queryKey: [queryKeys.complimentsKey, action.type, action.profileId],
    queryFn: async () => {
      let route = `/profiles/${profileId}/compliments`;
      switch (type) {
        case "compliments": {
          const { data } = await fetchWithHandler<{ data: Compliment[] }>(
            route
          );
          return data;
        }
        case "user-compliment": {
          route += "/current";
          const { data } = await fetchWithHandler<{ data: Compliment }>(route);
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

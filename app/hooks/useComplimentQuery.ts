import { QUERY_KEYS, queryKeys } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Compliment } from "@/lib/types";
import type { ApiError } from "@/lib/errors";
import { constructQueryString } from "@/lib/utils/strings";

type Action =
  | {
      type: "compliments";
      searchPattern?: string;
    }
  | {
      type: "compliment";
      profileId: number;
      complimentId: number;
    };

type ComplimentQueryResult<T extends Action> = T["type"] extends "compliments"
  ? Compliment[]
  : T["type"] extends "compliment"
  ? Compliment
  : never;

function useComplimentQuery<T extends Action>(
  action: T,
  options: Partial<UseQueryOptions<ComplimentQueryResult<T>, ApiError>> = {}
): UseQueryResult<ComplimentQueryResult<T>, ApiError> {
  let baseRoute = "/compliments";
  let queryKey: unknown[];

  switch (action.type) {
    case "compliments": {
      queryKey = [QUERY_KEYS.COMPLIMENTS];
      if (action.searchPattern) {
        queryKey.push(action.searchPattern);
        baseRoute += constructQueryString(action.searchPattern);
      }
      break;
    }
    case "compliment": {
      baseRoute = `/profiles/${action.profileId}/compliments/${action.complimentId}`;
      queryKey = [
        QUERY_KEYS.COMPLIMENTS,
        action.profileId,
        action.complimentId,
      ];
      break;
    }
    default: {
      const _exhaustiveCheck: never = action;
      throw new TypeError("Invalid useComplimentQuery action type");
    }
  }

  return useQuery<ComplimentQueryResult<T>, ApiError>({
    queryKey,
    queryFn: async () => {
      const { data } = await fetchWithHandler<{
        data: ComplimentQueryResult<T>;
      }>(baseRoute);
      return data;
    },
    ...options,
  });
}

export default useComplimentQuery;

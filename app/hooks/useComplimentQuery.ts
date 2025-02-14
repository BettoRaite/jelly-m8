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
      type: "profile/compliments";
      profileId: number;
      searchPattern?: string;
    }
  | {
      type: "compliment";
      profileId: number;
      complimentId: number;
      searchPattern?: string;
    };

type ComplimentQueryResult<T extends Action> = T["type"] extends "compliments"
  ? Compliment[]
  : T["type"] extends "profile/compliments"
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

      break;
    }
    case "profile/compliments": {
      baseRoute = `/profiles/${action.profileId}/compliments`;
      queryKey = [QUERY_KEYS.COMPLIMENTS, action.profileId];
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
      throw new TypeError("Invalid useComplimentQuery action type");
    }
  }

  if (action.searchPattern) {
    queryKey.push(action.searchPattern);
    baseRoute += constructQueryString(action.searchPattern);
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

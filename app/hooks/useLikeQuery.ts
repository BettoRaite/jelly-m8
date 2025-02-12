import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { ApiError } from "@/lib/errors";

type LikeQueryAction = {
  type: "has_liked";
  complimentId: number;
};

function useLikeQuery(
  action: LikeQueryAction,
  options: Partial<UseQueryOptions<boolean, ApiError>> = {}
): UseQueryResult<boolean, ApiError> {
  const { complimentId } = action;

  const baseRoute = `/compliments/${complimentId}/likes`;
  const queryKey = [QUERY_KEYS.LIKES, action.complimentId];

  return useQuery<boolean, ApiError>({
    queryKey,
    queryFn: async () => {
      const { data } = await fetchWithHandler<{ data: unknown }>(baseRoute);
      return Boolean(data);
    },
    ...options,
  });
}

export default useLikeQuery;

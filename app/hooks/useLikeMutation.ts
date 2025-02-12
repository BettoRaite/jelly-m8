import { QUERY_KEYS } from "@/lib/config";
import type { ApiError } from "@/lib/errors";
import type { Methods } from "@/lib/types";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

type Action =
  | {
      type: "create";
      complimentId: number;
    }
  | {
      type: "delete";
      complimentId: number;
    };

export function useLikeMutation({
  options,
  queryKey = [QUERY_KEYS.PROFILES],
}: {
  options?: UseMutationOptions<unknown, ApiError, Action>;
  queryKey?: string[];
} = {}) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, Action>({
    mutationFn: async (action) => {
      const baseUrl = `/compliments/${action.complimentId}/likes`;
      const method: Methods = action.type === "create" ? "POST" : "DELETE";

      await fetchWithHandler(baseUrl, {
        method,
      });
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LIKES, action.complimentId],
      });
    },
    ...options,
  });
}

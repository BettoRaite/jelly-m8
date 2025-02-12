import { QUERY_KEYS } from "@/lib/config";
import type {
  CreateComplimentPayload,
  UpdateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type Action =
  | {
      type: "create";
      profileId: number;
      payload: CreateComplimentPayload;
    }
  | {
      type: "delete";
      profileId: number;
      complimentId: number;
    }
  | {
      type: "update";
      profileId: number;
      complimentId: number;
      payload: UpdateComplimentPayload;
    };

export function useComplimentMutation(
  options?: UseMutationOptions<unknown, Error, Action>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      let route = `/profiles/${action.profileId}/compliments`;
      let method: "POST" | "PUT" | "DELETE" | "PATCH";
      let body: FormData | Record<string, unknown> | undefined;

      switch (action.type) {
        case "create":
          method = "POST";
          body = action.payload;
          break;
        case "delete":
          method = "DELETE";
          route += `/${action.complimentId}`;
          break;
        case "update":
          method = "PATCH";
          route += `/${action.complimentId}`;
          body = action.payload;
          break;
        default:
          throw new Error("Invalid action type");
      }
      return await fetchWithHandler(route, { method, body });
    },
    onSuccess: (_, action) => {
      switch (action.type) {
        case "create":
        case "delete":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.COMPLIMENTS],
          });
          break;
        case "update":
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.COMPLIMENTS,
              action.profileId,
              action.complimentId,
            ],
          });
          break;
      }
    },
    ...options,
  });
}

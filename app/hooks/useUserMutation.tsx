import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { CreateUserPayload } from "@/lib/schemas/user.schema";
import { QUERY_KEYS } from "@/lib/config";
// types/userActions.ts
export type UserAction =
  | {
      type: "create";
      userId?: number;
      payload: CreateUserPayload;
    }
  | {
      type: "update";
      userId: number;
      payload: Partial<CreateUserPayload>;
    }
  | {
      type: "delete";
      userId: number;
    }
  | {
      type: "invalidate-access-key";
      userId: number;
    };

export function useUserMutation(
  options?: UseMutationOptions<unknown, Error, UserAction>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UserAction>({
    mutationFn: async (action) => {
      const route = `/users/${action?.userId ?? ""}`;
      switch (action.type) {
        case "create": {
          await fetchWithHandler(route, {
            method: "POST",
            body: action.payload,
          });
          break;
        }
        case "update": {
          await fetchWithHandler(route, {
            method: "PUT",
            body: action.payload,
          });
          break;
        }
        case "delete": {
          await fetchWithHandler(route, {
            method: "DELETE",
          });
          break;
        }
        case "invalidate-access-key": {
          await fetchWithHandler(`${route}/access-secret/invalidate`, {
            method: "PATCH",
          });
          break;
        }
        default:
          throw new Error("Invalid action type");
      }
    },
    onSuccess: (_, action) => {
      switch (action.type) {
        case "create":
        case "delete":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USERS],
          });
          break;
        case "update":
        case "invalidate-access-key":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USERS, action.userId],
          });
      }
    },
    ...options,
  });
}

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { CreateUserPayload } from "@/lib/schemas/user.schema";
import { queryKeys } from "@/lib/config";

// types/userActions.ts
export type UserAction =
  | {
      type: "create";
      id?: number;
      payload: CreateUserPayload;
    }
  | {
      id?: number;
      type: "read";
    }
  | {
      type: "update";
      id: number | string;
      payload: Partial<CreateUserPayload>;
    }
  | {
      type: "delete";
      id: number | string;
    }
  | {
      type: "invalidate-access-key";
      id: number | string;
    };

export function useUserMutation(
  options?: UseMutationOptions<void, Error, UserAction>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserAction>({
    mutationFn: async (action) => {
      const route = `/users/${action?.id ?? ""}`;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usersKey });
    },
    ...options,
  });
}

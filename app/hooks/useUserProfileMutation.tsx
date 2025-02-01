import { queryKeys } from "@/lib/config";
import type { CreateProfilePayload } from "@/lib/schemas/profile.schema";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type Action =
  | {
      type: "create";
      userId: number;
      payload: FormData;
    }
  | {
      type: "update";
      userId: number;
      payload: FormData;
    }
  | {
      type: "delete";
      userId: number;
    };
// Profile is an entity that can be access through
// two separate routes like user/:userId/profile and profile/:profileId/
// This is user/:userId/profile route
export function useUserProfileMutation(
  options?: UseMutationOptions<unknown, Error, Action>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      const route = `/users/${action.userId}/profile`;
      let method: "POST" | "PUT" | "DELETE";
      let body: FormData | undefined;

      switch (action.type) {
        case "create":
          method = "POST";
          body = action.payload;
          break;
        case "update":
          method = "PUT";
          body = action.payload;
          break;
        case "delete":
          method = "DELETE";
          break;
        default:
          throw new Error("Invalid action type");
      }

      return await fetchWithHandler(route, { method, body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profilesKey });
    },
    ...options,
  });
}

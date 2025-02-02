import { queryKeys } from "@/lib/config";
import type { ProfileActivationPayload } from "@/lib/schemas/profile.schema";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type Action =
  | {
      type: "activate";
      profileId: number;
      payload: ProfileActivationPayload;
    }
  | {
      type: "deactivate";
      profileId: number;
    };
// Profile is an entity that can be access through
// two separate routes like user/:userId/profile and profile/:profileId/
// This is /profiles/:profileId route
export function useProfileMutation(
  options?: UseMutationOptions<unknown, Error, Action>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      let route = `/profiles/${action.profileId}`;
      let method: "POST" | "PUT" | "DELETE" | "PATCH";
      let body: FormData | Record<string, unknown> | undefined;

      switch (action.type) {
        case "activate":
          route += "/activate";
          method = "PATCH";
          body = action.payload;
          break;
        case "deactivate":
          route += "/deactivate";
          method = "PATCH";
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

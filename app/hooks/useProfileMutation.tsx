import { QUERY_KEYS } from "@/lib/config";
import type {
  CreateProfilePayload,
  ProfileActivationPayload,
  UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Methods } from "@/lib/types";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { ApiError } from "@/lib/errors";
import type { Profile } from "@/lib/types";

type ProfileMutationAction =
  | {
      type: "create";
      userId: number;
      payload: FormData | CreateProfilePayload;
    }
  | {
      type: "update";
      userId: number;
      payload: FormData | UpdateProfilePayload;
    }
  | {
      type: "delete";
      userId: number;
    }
  | {
      type: "activate";
      userId: number;
      payload: ProfileActivationPayload;
    };

export function useProfileMutation({
  options,
  queryKey = [QUERY_KEYS.PROFILES],
}: {
  options?: UseMutationOptions<unknown, ApiError, ProfileMutationAction>;
  queryKey?: string[];
} = {}) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, ProfileMutationAction>({
    mutationFn: async (action) => {
      const baseUrl = `/users/${action.userId}/profile`;
      let url: string;
      let method: Methods;
      let body: FormData | Record<string, unknown> | undefined;

      switch (action.type) {
        case "create":
          url = baseUrl;
          method = "POST";
          body = action.payload;
          break;
        case "update":
          url = baseUrl;
          method = "PATCH";
          body = action.payload;
          break;
        case "delete":
          url = baseUrl;
          method = "DELETE";
          break;
        case "activate":
          url = `${baseUrl}/activate`;
          method = "PATCH";
          body = action.payload;
          break;
        default:
          throw new Error(`Invalid action type: ${action as never}`);
      }

      await fetchWithHandler(url, {
        method,
        body,
      });
    },
    onSuccess: (_, action) => {
      switch (action.type) {
        case "create":
        case "delete":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PROFILES],
          });
          break;
        case "update":
        case "activate":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PROFILES, action.userId],
          });
      }
    },
    ...options,
  });
}

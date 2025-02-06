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

export type Action =
  | {
      type: "create";
      userId: number;
      payload: FormData;
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
  queryKey,
}: {
  options?: UseMutationOptions<unknown, Error, Action>;
  queryKey?: string[];
} = {}) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      let route = `/users/${action.userId}/profile`;
      let method: Methods;
      let body: FormData | Record<string, unknown> | undefined;

      switch (action.type) {
        case "create":
          method = "POST";
          body = action.payload;
          break;
        case "update":
          method = "PATCH";
          body = action.payload;
          break;
        case "delete":
          method = "DELETE";
          break;
        case "activate":
          method = "PATCH";
          body = action.payload;
          route += "/activate";
          break;
        default:
          throw new Error("Invalid action type");
      }
      const response = await fetchWithHandler(route, { method, body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey ?? QUERY_KEYS.profilesKey,
        exact: true,
        type: "active",
      });
    },
    ...options,
  });
}

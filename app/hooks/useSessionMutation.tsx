import { QUERY_KEYS } from "@/lib/config";
import type { UserLoginPayload } from "@/lib/schemas/login.schema";
import type { Methods } from "@/lib/types";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type Action =
  | {
      type: "login";
      payload: UserLoginPayload;
    }
  | {
      type: "logout";
    };

export function useSessionMutation({
  options,
  queryKey,
}: {
  options?: UseMutationOptions<unknown, Error, Action>;
  queryKey?: string[];
} = {}) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      const route = `/auth/${action.type}`;
      const method: Methods = "POST";
      let body: FormData | Record<string, unknown> | undefined;
      switch (action.type) {
        case "login":
          body = action.payload;
          break;
        case "logout":
          break;
        default:
          throw new Error("Invalid action type");
      }
      const response = await fetchWithHandler(route, { method, body });
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.AUTH,
      });
    },
    ...options,
  });
}

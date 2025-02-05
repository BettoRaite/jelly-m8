import { queryKeys } from "@/lib/config";
import type { CreateComplimentPayload } from "@/lib/schemas/compliment.schema";
import { fetchWithHandler } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type Action = {
  type: "create";
  profileId: number;
  payload: CreateComplimentPayload;
};

export function useComplimentMutation(
  options?: UseMutationOptions<unknown, Error, Action>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, Action>({
    mutationFn: async (action) => {
      const route = `/profiles/${action.profileId}/compliments`;
      let method: "POST" | "PUT" | "DELETE" | "PATCH";
      let body: FormData | Record<string, unknown> | undefined;

      switch (action.type) {
        case "create":
          method = "POST";
          body = action.payload;
          break;
        default:
          throw new Error("Invalid action type");
      }

      return await fetchWithHandler(route, { method, body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complimentsKey });
    },
    ...options,
  });
}

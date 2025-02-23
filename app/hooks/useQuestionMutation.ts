import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { CreateUserPayload } from "@/lib/schemas/user.schema";
import { QUERY_KEYS } from "@/lib/config";
import type { CreateQuestionPayload } from "@/lib/schemas/question.schema";
// types/userActions.ts
export type QuestionAction =
  | {
      type: "create";
      questionId?: number;
      payload: CreateQuestionPayload;
    }
  | {
      type: "update";
      questionId: number;
      payload: CreateQuestionPayload;
    }
  | {
      type: "delete";
      questionId: number;
    };

export function useQuestionMutation(
  options?: UseMutationOptions<unknown, Error, QuestionAction>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, QuestionAction>({
    mutationFn: async (action) => {
      const route = `/questions/${action?.questionId ?? ""}`;
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
        default:
          throw new Error("Invalid action type");
      }
    },
    onSuccess: (_, action) => {
      switch (action.type) {
        case "create":
        case "delete":
        case "update":
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.QUESTIONS],
          });
          break;
      }
    },
    ...options,
  });
}

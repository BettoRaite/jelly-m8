import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Question, User } from "@/lib/types";
import type { ApiError } from "@/lib/errors";

type QuestionQueryAction = { type: "questions" };

type QuestionQueryResult<T extends QuestionQueryAction> = T extends {
  type: "questions";
}
  ? Question[]
  : never;

function useQuestionQuery<T extends QuestionQueryAction>(
  action: T,
  options?: Partial<UseQueryOptions<QuestionQueryResult<T>, ApiError>>
): UseQueryResult<QuestionQueryResult<T>, ApiError> {
  const queryKey = (() => {
    switch (action.type) {
      case "questions":
        return [QUERY_KEYS.QUESTIONS];
      default:
        throw new Error(`Invalid action type: ${action as never}`);
    }
  })();

  return useQuery<QuestionQueryResult<T>, ApiError>({
    ...options,
    queryKey,
    queryFn: async () => {
      switch (action.type) {
        case "questions": {
          const { data } = await fetchWithHandler<{ data: Question[] }>(
            "/questions"
          );
          return data as QuestionQueryResult<T>;
        }
        default:
          throw new Error(`Invalid action type: ${action as never}`);
      }
    },
  });
}

export default useQuestionQuery;

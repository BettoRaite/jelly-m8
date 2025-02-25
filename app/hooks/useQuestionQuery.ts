import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Question, User } from "@/lib/types";
import type { ApiError } from "@/lib/errors";

type QuestionQueryAction = { type: "questions"; role: string };

type QuestionQueryResult<T extends QuestionQueryAction> = T extends {
  type: "questions";
}
  ? Question[]
  : never;

const SPECIAL_QUESTION: Question = {
  id: Number.MAX_SAFE_INTEGER,
  userId: 1,
  isApproved: true,
  content: "Ты что-то хотел мне сказать?",
  createdAt: new Date(),
};

function useQuestionQuery<T extends QuestionQueryAction>(
  action: T,
  options?: Partial<UseQueryOptions<QuestionQueryResult<T>, ApiError>>
): UseQueryResult<QuestionQueryResult<T>, ApiError> {
  const queryKey = (() => {
    switch (action.type) {
      case "questions":
        return [QUERY_KEYS.QUESTIONS, action.role];
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
          if (action.role === "teacher") {
            return [SPECIAL_QUESTION] as QuestionQueryResult<T>;
          }
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

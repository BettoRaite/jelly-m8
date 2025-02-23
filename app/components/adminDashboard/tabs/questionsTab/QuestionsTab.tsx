import { QUERY_KEYS } from "@/lib/config";
import FailedToLoad from "@/components/FailedToLoad";
import { HeartLoader } from "@/components/HeartLoader";
import useQuestionQuery from "@/hooks/useQuestionQuery";
import CreateQuestionForm from "./CreateQuestionForm";
import { QuestionCard } from "./QuestionCard";

export function QuestionsTab() {
  const {
    data: questions,
    refetch,
    status,
  } = useQuestionQuery({
    type: "questions",
  });

  if (status === "pending") {
    return <HeartLoader />;
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] mt-16 md:px-8 px-4">
      <CreateQuestionForm />
      {status !== "error" ? (
        <div className="mt-10 flex justify-center lg:justify-start  flex-wrap items-start gap-10 md:px-10 mb-60">
          {questions?.map((q) => {
            return <QuestionCard key={q.id} question={q} />;
          })}
        </div>
      ) : (
        <FailedToLoad description="Failed to load users" reload={refetch} />
      )}
    </div>
  );
}

import { TextInput } from "@/ui/form/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { capitalizeFirstChar, joinClasses } from "@/lib/utils/strings";
import { FormField } from "@/ui/formField/FormField";
import {
  type CreateQuestionPayload,
  createQuestionSchema,
} from "@/lib/schemas/question.schema";
import { useQuestionMutation } from "@/hooks/useQuestionMutation";

function CreateQuestionForm() {
  const methods = useForm<CreateQuestionPayload>({
    resolver: zodResolver(createQuestionSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const questionMutation = useQuestionMutation({
    onError: (err) => {
      try {
        // Server error message
        const { message } = JSON.parse(err.message);
        toast.error(capitalizeFirstChar(message));
      } catch {
        toast.error("Failed to create question. Unknown error");
      }
    },
  });

  const handleCreateQuestionSubmit = async (payload: CreateQuestionPayload) => {
    questionMutation.mutate({
      type: "create",
      payload,
    });
  };

  return (
    <FormProvider {...methods}>
      <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md w-max-96 w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Question
        </h2>
        <form
          onSubmit={handleSubmit(handleCreateQuestionSubmit)}
          className="flex flex-col gap-4 h-full"
        >
          <FormField<CreateQuestionPayload> fieldName="content">
            <FormField.TextArea
              className="placeholder:first-letter:uppercase h-96"
              placeholder="Enter question content"
            />
            <FormField.Error />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting || questionMutation.isPending}
            className={joinClasses(
              "w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700",
              "transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting || questionMutation.isPending
              ? "Creating..."
              : "Create Question"}
          </button>
        </form>
        <Toaster />
      </section>
    </FormProvider>
  );
}

export default CreateQuestionForm;

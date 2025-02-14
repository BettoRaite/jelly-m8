import { useUserMutation } from "@/hooks/useUserMutation";
import {
  type CreateUserPayload,
  createUserSchema,
} from "@/lib/schemas/user.schema";
import { TextInput } from "@/ui/form/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { capitalizeFirstChar, joinClasses } from "@/lib/utils/strings";
import { FormField } from "@/ui/formField/FormField";

export function CreateUser() {
  const methods = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;
  const userMutation = useUserMutation();
  // Handle form submission
  const handleCreateUserSubmit = async (payload: CreateUserPayload) => {
    userMutation.mutate(
      {
        type: "create",
        payload,
      },
      {
        onError: (err) => {
          try {
            // Server error message
            const { message } = JSON.parse(err.message);
            toast.error(capitalizeFirstChar(message));
          } catch {
            toast.error("Failed to create user. Unknown error");
          }
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md h-96 w-max-96 w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>
        <form
          onSubmit={handleSubmit(handleCreateUserSubmit)}
          className="flex flex-col gap-4 h-full"
        >
          <FormField<CreateUserPayload> fieldName="username">
            <FormField.TextInput className="placeholder:first-letter:uppercase" />
            <FormField.Error />
          </FormField>

          <FormField<CreateUserPayload> fieldName="userRole">
            <FormField.Select
              options={[
                {
                  label: "User",
                  value: "user",
                },
              ]}
            />
          </FormField>
          <button
            type="submit"
            disabled={isSubmitting || userMutation.isPending}
            className={joinClasses(
              "w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700",
              "transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting || userMutation.isPending
              ? "Creating..."
              : "Create User"}
          </button>
        </form>
        <Toaster />
      </section>
    </FormProvider>
  );
}

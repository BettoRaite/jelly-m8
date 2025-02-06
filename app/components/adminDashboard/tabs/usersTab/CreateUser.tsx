import { useUserMutation } from "@/hooks/useUserMutation";
import {
  type CreateUserPayload,
  createUserSchema,
} from "@/lib/schemas/user.schema";
import { TextInput } from "@/ui/form/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { capitalizeFirstChar } from "@/lib/utils/strings";

export function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
  });

  const mutation = useUserMutation();

  // Handle form submission
  const handleCreateUserSubmit = async (payload: CreateUserPayload) => {
    mutation.mutate(
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
    <form
      onSubmit={handleSubmit(handleCreateUserSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md h-96 w-96"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>

      {/* Username Field */}
      <TextInput
        register={register}
        errors={errors}
        fieldName="username"
        placeholder="Enter username"
        className="mb-4"
      />

      {/* Role Field */}
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1 mt-4"
        >
          Select Role:
        </label>
        <select
          id="role"
          {...register("userRole")}
          defaultValue="user"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          aria-invalid={errors.userRole ? "true" : "false"}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.userRole && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.userRole.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || mutation.isLoading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting || mutation.isLoading ? "Creating..." : "Create User"}
      </button>
      <Toaster />
    </form>
  );
}

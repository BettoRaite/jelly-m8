import { useUserMutation } from "@/hooks/useUserMutation";
import {
  type CreateUserPayload,
  createUserSchema,
} from "@/lib/schemas/user.schema";
import { TextInput } from "@/ui/form/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
  });
  const mutation = useUserMutation();
  function handleCreateUserSubmit(payload: CreateUserPayload) {
    mutation.mutate({
      type: "create",
      payload,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateUserSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md h-min"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>

      {<TextInput register={register} errors={errors} fieldName="username" />}
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Role:
        </label>
        <select
          id="role"
          {...register("userRole")}
          defaultValue="user"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.userRole && (
          <p className="text-red-500 text-sm mt-1">{errors.userRole.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Create User
      </button>
    </form>
  );
}

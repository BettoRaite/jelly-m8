import { useForm } from "react-hook-form";
import {
  type CreateUserSchema,
  createUserSchema,
} from "@/lib/schemas/users.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { constructFetchUrl } from "@/lib/utils";
import { queryClient, queryKeys } from "@/lib/config";

export function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const mutation = useMutation({
    mutationFn: async (creds: CreateUserSchema) => {
      console.log(creds);
      const formData = new FormData();
      formData.append("name", creds.name);
      formData.append("profileImage", creds.profileImage);
      formData.append("role", creds.role);
      const response = await fetch(constructFetchUrl("/users"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log(await response.text());
      if (response.status === 400) {
        throw new Error(await response.text());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersKey,
      });
    },
    onError: (err) => {
      // Handle error (e.g., show a toast notification)
    },
  });

  function handleCreateUserSubmit(creds: CreateUserSchema) {
    mutation.mutate(creds);
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateUserSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>

      <div className="mb-4">
        <label
          htmlFor="profileImage"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Profile image:
        </label>
        <input
          {...register("profileImage")}
          type="file"
          id="profileImage"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
        {errors.profileImage && (
          <p className="text-red-500 text-sm mt-1">
            {errors?.profileImage?.message as string}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name:
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your name"
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Role:
        </label>
        <select
          id="role"
          {...register("role")}
          defaultValue="user"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
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

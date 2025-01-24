import { useForm } from "react-hook-form";
import {
  type CreateUserSchema,
  createUserSchema,
} from "@/lib/schemas/users.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, queryKeys } from "@/lib/config";
import {
  createProfileSchema,
  type CreateProfileSchema,
} from "@/lib/schemas/profiles.schema";
import { runProfilesFetch } from "@/api/profiles.api";

export function CreateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProfileSchema>({
    resolver: zodResolver(createProfileSchema),
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (profileData: CreateProfileSchema) => {
      const res = await runProfilesFetch({
        type: "create",
        profileData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profilesKey,
      });
    },
  });

  function handleCreateProfileSubmit(profileData: CreateProfileSchema) {
    console.log("submit");
    mutation.mutate(profileData);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateProfileSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create profile
      </h2>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name:
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          id="name"
          className={`text-sm mt-1 block w-full p-2 border ${
            errors.name ? "border-red-500" : "border-gray-200"
          } rounded-md focus:outline-none focus:border-gray-400 duration-300`}
          placeholder="Name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Bio:
        </label>
        <textarea
          placeholder="Bio"
          id="bio"
          {...register("bio", { required: "Bio is required" })}
          className={`w-full border ${
            errors.bio ? "border-red-500" : "border-gray-200"
          } rounded-lg focus:outline-0 focus:border-gray-400 duration-300 p-2 text-sm`}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Create profile
      </button>
    </form>
  );
}

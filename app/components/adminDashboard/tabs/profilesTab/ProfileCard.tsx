import type { User } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { IoIosRemove } from "react-icons/io";
import { createMutateUsersFn } from "@/api/users.api";
import { queryClient, queryKeys } from "@/lib/config";
import type { CreateProfileSchema } from "@/lib/schemas/profiles.schema";
import { runProfilesFetch } from "@/api/profiles.api";

type Props = {
  profile: CreateProfileSchema;
};

export function ProfileCard({ profile }: Props) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await runProfilesFetch({
        type: "delete",
        id: profile.id,
      });
      if (!res.ok) {
        throw new Error(`Failed to delete profile with id ${profile.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profilesKey,
      });
    },
  });

  function handleDeleteUserClick() {
    mutation.mutate();
  }

  return (
    <section className="flex p-6 items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800 capitalize">
          {profile.name}
        </h1>

        <p className="text-gray-600 mt-1">
          <span className="font-medium">{profile.bio}</span>
        </p>
      </div>
      <button
        className="bg-red-100 rounded-lg p-4 hover:bg-red-300 duration-300"
        type="button"
        onClick={handleDeleteUserClick}
      >
        <IoIosRemove />
      </button>
    </section>
  );
}

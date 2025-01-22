import type { User } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { IoIosRemove } from "react-icons/io";
import { createMutateUsersFn } from "@/api/users.api";
import { queryClient, queryKeys } from "@/lib/config";

type Props = {
  user: User;
};

export function UserCard({ user }: Props) {
  const mutation = useMutation({
    mutationFn: createMutateUsersFn({
      type: "delete",
      id: user.id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersKey,
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
          {user.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Access Key: <span className="font-medium">{user.accessKey}</span>
        </p>
        <p className="text-gray-600 mt-1">
          Role: <span className="font-medium">{user.role}</span>
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

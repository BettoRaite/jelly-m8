import type { User } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { IoIosRemove } from "react-icons/io";
import { createMutateUsersFn } from "@/api/users.api";
import { queryClient, queryKeys } from "@/lib/config";
import { useUserMutation } from "@/hooks/useUserMutation";
import { MdKey } from "react-icons/md";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

type Props = {
  user: User;
};

export function UserCard({ user }: Props) {
  const [panelUnlocked, setPanelUnlocked] = useState(false);
  const { userDeleteMutation } = useUserMutation({
    type: "delete",
    id: user.id,
  });

  const { userInvalidateAccessKeyMutation } = useUserMutation({
    type: "invalidate-access-key",
    id: user.id,
  });

  function handleDeleteUserClick() {
    userDeleteMutation.mutate();
  }

  function handleInvalidateAccessKeyClick() {
    userInvalidateAccessKeyMutation.mutate();
  }

  function handleUnlockClick() {
    setPanelUnlocked(!panelUnlocked);
  }

  const { name, accessKey, role, profileImageUrl } = user;
  return (
    <section className="w-96 flex p-6 items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 gap-4">
      <div className="flex flex-col">
        <img
          src={profileImageUrl}
          alt={`image of ${name}`}
          className="rounded-full h-32 w-32 object-cover self-center mb-4 border border-gray-200"
        />
        <h1 className="text-xl font-semibold text-gray-800 capitalize text-center">
          {name}
        </h1>
        <p className="text-gray-600 mt-2">
          Access Key:{" "}
          <span className="font-medium bg-gray-600 hover:bg-white transition-colors duration-300">
            {accessKey}
          </span>
        </p>
        <p className="text-gray-600 mt-1">
          Role: <span className="font-medium">{role}</span>
        </p>
      </div>

      <div className="h-60 w-[1px] bg-gray-200 shadow-lg" />

      <div
        className={`flex flex-col gap-4 ${
          !panelUnlocked && "pointer-events-none bg-gray-200"
        } p-4 rounded-lg transition duration-300`}
      >
        <button
          className="rounded-lg p-4 border border-gray-300 shadow-lg hover:border-purple-300 transition duration-300 ease-in-out transform hover:scale-105"
          type="button"
          onClick={handleDeleteUserClick}
        >
          <IoIosRemove />
        </button>
        <button
          className="rounded-lg p-4 border border-gray-300 shadow-lg hover:border-purple-300 transition duration-300 ease-in-out transform hover:scale-105"
          type="button"
          onClick={handleInvalidateAccessKeyClick}
        >
          <MdKey className="text-gray-600" />
        </button>
      </div>
      <button
        className="rounded-lg p-4 border border-gray-300 shadow-lg hover:border-purple-300 transition duration-300 ease-in-out transform hover:scale-105"
        type="button"
        onClick={handleUnlockClick}
      >
        {panelUnlocked ? (
          <FaLockOpen className="text-gray-700" />
        ) : (
          <FaLock className="text-gray-600" />
        )}
      </button>
    </section>
  );
}

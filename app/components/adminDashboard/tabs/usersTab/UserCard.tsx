import { useUserMutation } from "@/hooks/useUserMutation";
import type { User } from "@/lib/types";
import { useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { IoIosRemove } from "react-icons/io";
import { MdKey } from "react-icons/md";
import { motion } from "motion/react";
import { BiCopy } from "react-icons/bi";
import toast from "react-hot-toast";
import useUserQuery from "@/hooks/useUserQuery";
import ItemLoader from "@/components/ItemLoader";
import FailedToLoad from "@/components/FailedToLoad";
type Props = {
  initialUser: User;
};

export function UserCard({ initialUser }: Props) {
  const {
    data: user,
    status,
    refetch,
  } = useUserQuery(
    {
      type: "user",
      userId: initialUser.id,
    },
    {
      initialData: initialUser,
      enabled: false,
    }
  );
  const [panelUnlocked, setPanelUnlocked] = useState(false);
  const userMutation = useUserMutation();

  if (status === "pending") {
    return <ItemLoader />;
  }

  if (status === "error") {
    return <FailedToLoad description="Failed to load uer" />;
  }

  function handleDeleteUserClick() {
    userMutation.mutate({
      type: "delete",
      userId: user?.id as number,
    });
  }

  function handleInvalidateAccessKeyClick() {
    userMutation.mutate(
      {
        type: "invalidate-access-key",
        userId: user?.id as number,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  }

  function handleUnlockClick() {
    setPanelUnlocked(!panelUnlocked);
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      })
      .then(() => {
        toast("Copied to clipboard");
      });
  };

  const { username, accessSecret, userRole, id } = user;
  return (
    <motion.section
      animate={{
        scale: [0, 1],
      }}
      className=" w-96 flex p-6 items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 gap-4"
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 capitalize">
          {username}
        </h1>
        <p className="text-gray-600 mt-2">
          Access Key:{" "}
          <span className="font-medium bg-gray-600 active:bg-white transition-colors duration-300">
            {accessSecret}
          </span>
        </p>

        <p className="text-gray-600 mt-1">
          Role: <span className="font-medium">{userRole}</span>
        </p>
        <p className="text-gray-600 mt-1">
          ID: <span className="font-medium">{id}</span>
        </p>
      </div>

      <button
        type="button"
        className="my-4 flex items-center justify-center bg-gray-400 p-2 rounded-full hover:bg-gray-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
        onClick={() => handleCopyToClipboard(accessSecret)}
      >
        <BiCopy className="text-white" size={24} />
      </button>
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
    </motion.section>
  );
}

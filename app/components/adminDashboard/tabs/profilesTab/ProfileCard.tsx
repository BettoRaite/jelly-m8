import { useProfileMutation } from "@/hooks/useProfileMutation";
import useProfileQuery from "@/hooks/useProfileQuery";
import { QUERY_KEYS } from "@/lib/config";
import type { Profile } from "@/lib/types";
import { useState } from "react";
import { IoIosRemove } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import ProfileForm from "./ProfileForm";
import Button from "@/ui/Button";
import IconButton from "@/ui/IconButton";
import StatusBadge from "@/ui/StatusBadge";
import { BiCopy, BiLock } from "react-icons/bi";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";

type Props = {
  initialProfile: Profile;
};
function ProfileCard({ initialProfile }: Props) {
  const {
    data: profile,
    status,
    refetch,
  } = useProfileQuery(
    {
      type: "profile",
      userId: initialProfile.userId,
    },
    {
      initialData: initialProfile,
      enabled: false,
    }
  );
  const profileMutation = useProfileMutation();

  const [isEditing, setIsEditing] = useState(false);

  if (status === "pending") {
    return "loading";
  }
  if (status === "error") {
    return "error";
  }
  function handleDeleteProfileClick() {
    if (!profile) return;
    profileMutation.mutate({
      type: "delete",
      userId: profile.userId,
    });
  }

  function handleActivation() {
    if (!profile) return;
    profileMutation.mutate(
      {
        type: "update",
        userId: profile.userId,
        payload: {
          isActivated: !profile.isActivated,
        },
      },
      {
        onSuccess: () => refetch(),
      }
    );
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

  return (
    <motion.section
      exit={{
        scale: 0.0,
      }}
      animate={{
        scale: [0.5, 1],
      }}
      className="flex flex-col p-6 bg-white rounded-lg shadow-md relative
      hover:shadow-lg transition-shadow gap-4 min-w-[280px] w-full max-w-[400px]"
    >
      <div className="flex items-center justify-between ">
        <div className="flex flex-col gap-4">
          <img
            src={profile.profileImageUrl}
            alt={profile.displayName}
            className="w-24 h-24 md:w-32 md:h-32 object-cover  rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {profile.displayName}
            </h1>
          </div>
          <StatusBadge isActive={profile.isActivated} />
          <div className="flex items-center gap-2 absolute -bottom-6 right-4 opacity-70">
            <p className="text-slate-600">{profile.activationSecret}</p>
            <button
              type="button"
              className="scale-75 h-min w-min text-sm my-4 flex items-center justify-center bg-gray-400 p-2 rounded-full hover:bg-gray-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              onClick={() => handleCopyToClipboard(profile.activationSecret)}
            >
              <BiCopy className="text-white" size={24} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 md:ml-20">
          <IconButton
            icon={<MdEdit />}
            onClick={() => setIsEditing(!isEditing)}
            color="primary"
            aria-label="Edit profile"
          />
          <IconButton
            icon={<IoIosRemove />}
            onClick={handleDeleteProfileClick}
            color="danger"
            aria-label="Delete profile"
          />
          <IconButton
            icon={<BiLock />}
            onClick={handleActivation}
            color="secondary"
            aria-label={`${
              profile.isActivated ? "Deactivate" : "Activate"
            } profile`}
          />
        </div>
      </div>

      {isEditing && (
        <ProfileForm
          profile={profile}
          formType="edit"
          onRefetch={refetch}
          onClose={() => setIsEditing(!isEditing)}
        />
      )}
    </motion.section>
  );
}

export default ProfileCard;

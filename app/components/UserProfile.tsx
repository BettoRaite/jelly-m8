import { FaEdit, FaTimes } from "react-icons/fa"; // Import the icons
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/ui/formField/FormField";
import { MdEdit } from "react-icons/md";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/config";
import { jsonToFormData } from "@/lib/utils/conversion";
import ComplimentForm from "./userDashboard/ComplimentForm";
type Props = {
  profile: Profile;
  isOwner: boolean;
};

function UserProfile({ profile, isOwner }: Props) {
  const methods = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: profile.displayName,
      biography: profile.biography,
    },
  });
  const mutation = useProfileMutation();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSubmit = (payload: Omit<UpdateProfilePayload, "isActivated">) => {
    mutation.mutate({
      type: "update",
      userId: profile.userId,
      payload: payload.imageFile ? jsonToFormData(payload) : payload,
    });
    setTimeout(() => {
      handleEditToggle();
    }, 100);
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        animate={{
          scale: [0.2, 1],
        }}
        className="relative bg-white border border-white rounded-xl shadow-lg w-[25%] mt-10"
      >
        <img src={profile.profileImageUrl} alt="" className="w-full rounded" />
        <p>{profile.displayName}</p>
        <ComplimentForm profileId={profile.id} />
      </motion.div>
    </FormProvider>
  );
}

export default UserProfile;

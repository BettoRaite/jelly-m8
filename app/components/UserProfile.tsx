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
import GlassyBackground from "./Backgrounds/GlassyBackground";
import Button from "@/ui/Button";
import { joinClasses } from "@/lib/utils/strings";
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
  const [isComplimenting, setIsComplimenting] = useState(false);

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
      <motion.main
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        }}
        className={joinClasses(
          "relative bg-white border border-white max-h-11/12 shadow-lg",
          "rounded-2xl shadow-xl shadow-purple-100/50 w-full max-w-[450px] mx-auto"
        )}
      >
        <div className="relative h-64 max-h-64 w-full bg-transparent z-10">
          <img
            src={profile.profileImageUrl}
            alt={`${profile.displayName}'s cover`}
            className="object-contain w-full h-full"
          />
          <img
            src={profile.profileImageUrl}
            alt={`${profile.displayName}'s cover`}
            className="object-cover w-full h-full absolute top-0 -z-20 rounded-xl"
          />
          <GlassyBackground
            className="-z-10 w-full h-full hover rounded-xl"
            intensity="medium"
          />
        </div>

        {/* Profile Section */}
        <motion.div
          className="flex items-start px-6 pb-2 -mt-12 relative z-10 bg"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={profile.profileImageUrl}
            alt={profile.displayName}
            className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
          />
          <div className="ml-2 mt-14 self-end">
            <h2
              className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text
              text-transparent "
            >
              {/* {profile.displayName} */}
            </h2>
          </div>
        </motion.div>
        {!isComplimenting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* <Button
              onClick={() => setIsComplimenting(false)}
              className="mx-auto mt-2 text-sm
              font-jost font-bold bg-gradient-to-br from-pink-500 to-pink-600
              text-white rounded-2xl hover:scale-105 transition duration-300
              shadow-lg hover:shadow-xl opacity-100"
            >
              ✨ Написать комлимент
            </Button> */}
          </motion.div>
        )}
        <div
          className="mt-4 flex items-center flex-col h-40 p-4
          rounded-xl mx-10 shadow-lg"
        >
          <p className="font-caveat text-xl text-slate-600">
            {profile.biography}
          </p>
        </div>
      </motion.main>
    </FormProvider>
  );
}

export default UserProfile;

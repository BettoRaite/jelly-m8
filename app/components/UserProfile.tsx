import { FaEdit, FaTimes } from "react-icons/fa"; // Import the icons
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
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
import { div } from "motion/react-client";
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
          "mt-20 sm:mt-0 relative bg-white rounded-xl w-full max-w-[400px] overflow-hidden",
          "border border-purple-600"
        )}
      >
        <div className="relative h-64 max-h-64 w-full bg-transparent z-10 shadow-lg">
          <img
            src={profile.profileImageUrl}
            alt={`${profile.displayName}'s cover`}
            className="object-contain w-full h-full"
          />
          <img
            src={profile.profileImageUrl}
            alt={`${profile.displayName}'s cover`}
            className="object-cover w-full h-full absolute top-0 -z-20 rounded-t-xl"
          />
          <GlassyBackground
            className="-z-10 w-full h-full hover rounded-t-xl"
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
            className="w-24 h-24 rounded-2xl border-4 border-purple-600 shadow-lg object-cover"
          />
          <div className="ml-2 mt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">
              {profile.displayName}
            </h2>
            <h2 className="mt-4 sm:mt-3 text-2xl sm:text-lg font-bold text-slate-300 lowercase">
              @{profile.displayName}
            </h2>
          </div>
        </motion.div>
        <div className="flex justify-center">
          <Button
            onClick={() => setIsComplimenting(true)}
            className="mt-2 ml-6 mb-4 text-sm
                  font-jost font-bold bg-gradient-to-br from-pink-500 to-pink-600
                  text-white rounded-2xl hover:scale-105 transition duration-300
                  shadow-lg hover:shadow-xl opacity-100"
          >
            ✨ Написать комлимент
          </Button>
        </div>
        <div className="mt-2 bg-gray-100 h-40 mx-4 rounded-lg p-2">
          <p className="ml-2 font-caveat text-xl text-slate-500">
            {profile.biography}
          </p>
        </div>
      </motion.main>
      <AnimatePresence>
        {isComplimenting && (
          <motion.div
            animate={{
              opacity: [0, 1],
            }}
            className="absolute z-20 bg-black bg-opacity-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center"
          >
            <ComplimentForm
              key={profile.id}
              profile={profile}
              onClose={() => setIsComplimenting(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </FormProvider>
  );
}

export default UserProfile;

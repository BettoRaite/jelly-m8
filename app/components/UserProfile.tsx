import { useProfileMutation } from "@/hooks/useProfileMutation";
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from "@/lib/schemas/profile.schema";
import type { Profile } from "@/lib/types";
import { jsonToFormData } from "@/lib/utils/conversion";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdEdit, MdMessage } from "react-icons/md";
import GlassyBackground from "./Backgrounds/GlassyBackground";
import ComplimentForm from "./userDashboard/ComplimentForm";
import { BiEdit } from "react-icons/bi";
import UserProfileEditForm from "./UserProfileEditForm";

type Props = {
  profile: Profile;
  isOwner: boolean;
};

function UserProfile({ profile, isOwner }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isComplimenting, setIsComplimenting] = useState(false);
  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
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
        "mt-20 sm:mt-0 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl w-full max-w-[400px] overflow-hidden",
        "border border-white"
      )}
    >
      {isEditMode && (
        <div className="absolute z-50 w-full bottom-0 top-0">
          <UserProfileEditForm
            profile={profile}
            onEditToggle={handleEditToggle}
          />
        </div>
      )}
      {!isEditMode && isOwner && (
        <Button
          onClick={handleEditToggle}
          className="text-white z-50 absolute top-2 right-2"
        >
          <MdEdit />
        </Button>
      )}
      {/* Cover image */}
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

      {/* Profile avatar section */}
      <motion.div
        className="flex items-start px-6 pb-2 -mt-12 relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={profile.profileImageUrl}
          alt={profile.displayName}
          className="w-28 h-28 rounded-full border-4 border-purple-600 shadow-lg object-cover relative"
        />
        <div className="ml-auto mr-10 mt-8">
          <div className="flex">
            {!isOwner && (
              <Button
                variant="outline"
                onClick={() => setIsComplimenting(true)}
                className="text-sm bottom-0
                          font-jost font-bold  bg-gradient-to-br from-gray-100 to-gray-200
                          text-white rounded-xl hover:scale-125 transition duration-300
                          shadow-lg hover:shadow-xl"
              >
                <MdMessage className="text-2xl text-blue-500" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <h2 className="ml-6 text-2xl sm:text-[2rem] font-bold text-slate-800">
        {profile.displayName}
      </h2>
      <div className="mt-6 bg-gray-100 h-40 mx-6 rounded-lg py-2 overflow-y-auto">
        <p className="ml-2 font-jost text-xl text-slate-500">
          {profile.biography}
        </p>
      </div>
      {/* Compliment form */}
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
    </motion.main>
  );
}

export default UserProfile;

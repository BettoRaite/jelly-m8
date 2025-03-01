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
import { MdEdit, MdFavorite, MdMessage } from "react-icons/md";
import GlassyBackground from "./Backgrounds/GlassyBackground";
import ComplimentForm from "./userDashboard/ComplimentForm";
import { BiEdit } from "react-icons/bi";
import UserProfileEditForm from "./UserProfileEditForm";
import toast from "react-hot-toast";
import { FiBookOpen, FiShield, FiUser } from "react-icons/fi";

type Props = {
  profile: Profile;
  role: "owner" | "user" | "unauthenticated";
};

function UserProfile({ profile, role }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isComplimenting, setIsComplimenting] = useState(false);
  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleOpenChat = () => {
    if (role === "user") {
      return setIsComplimenting(true);
    }
    toast("Сперва тебе нужно зарегистрироваться и создать свой профиль");
  };

  return (
    <motion.main
      initial={{ scale: 0.95, opacity: 0 }}
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
        "relative bg-slate-200 rounded-lg  sm:rounded-2xl w-full max-w-4xl mx-auto my-8 overflow-hidden shadow-2xl",
        {
          "border-2 border-yellow-200 shadow-yellow-100/30":
            profile.occupation === "teacher",
          "border-2 border-white shadow-purple-100/30":
            profile.occupation === "student",
        }
      )}
    >
      {isEditMode && (
        <div className="absolute z-50 inset-0 bg-white/90 backdrop-blur-sm">
          <UserProfileEditForm
            profile={profile}
            onEditToggle={handleEditToggle}
          />
        </div>
      )}

      {/* Header Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20">
        {/* Cover Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={profile.profileImageUrl}
            alt={`${profile.displayName}'s cover`}
            className="object-cover w-full h-full"
          />
          <GlassyBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent" />
        </div>

        {/* Profile Header Content */}
        <div className="relative z-10 flex flex-col items-center pt-16 text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="relative group">
            <img
              src={profile.profileImageUrl}
              alt={profile.displayName}
              className={joinClasses(
                "w-40 h-40 rounded-full shadow-2xl object-cover border-4",
                {
                  "border-yellow-400": profile.occupation === "teacher",
                  "border-purple-500": profile.occupation === "student",
                }
              )}
            />
            {!isEditMode && role === "owner" && (
              <Button
                onClick={handleEditToggle}
                className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
              >
                <MdEdit className="text-xl text-gray-700" />
              </Button>
            )}
          </motion.div>

          <h1 className="mt-6 text-2xl font-bold text-white font-playfair">
            {profile.displayName}
            {profile.occupation === "teacher" && (
              <span className="ml-3 text-2xl text-yellow-600">🎓</span>
            )}
          </h1>

          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center px-4 py-2 rounded-full bg-white backdrop-blur-sm">
              <FiBookOpen
                className={joinClasses("mr-2", {
                  "text-yellow-600": profile.occupation === "teacher",
                  "text-purple-600": profile.occupation === "student",
                })}
              />
              <span
                className={joinClasses("font-semibold capitalize", {
                  "text-yellow-700": profile.occupation === "teacher",
                  "text-purple-700": profile.occupation === "student",
                })}
              >
                {profile.occupation}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Header section end */}

      {/* Main Content */}
      <div className="grid gap-8 px-4 py-8 sm:px-6 md:px-8 md:grid-cols-2 lg:px-12 lg:py-12">
        {/* Biography Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl font-playfair">
            Обо мне
          </h2>
          <div className="p-6 rounded-2xl bg-white/50 border border-white/30 backdrop-blur-lg transition-shadow duration-300 sm:p-8">
            <p className="text-base leading-relaxed text-gray-700 sm:text-[1.1rem] font-jost">
              {profile.biography || "No biography yet..."}
            </p>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="space-y-6 sm:space-y-8">
          {/* Action Buttons */}
          {role !== "owner" && (
            <div className="flex space-x-4">
              <Button
                onClick={handleOpenChat}
                className="flex-1 py-4 font-jost text-base text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 sm:py-6 sm:text-lg"
              >
                <MdMessage className="mr-2 text-xl" />
                Написать комплимент
              </Button>
            </div>
          )}

          {/* Additional Info */}
          <div className="p-6 rounded-2xl bg-white/50 border border-white/40 backdrop-blur-lg sm:p-8">
            <h3 className="mb-4 text-xl font-bold text-gray-700 sm:text-2xl font-playfair">
              Детали
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {/* Gender Section */}
              <div className="flex items-center">
                <FiUser className="mr-3 text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
                <span
                  className={`font-medium text-base first-letter:capitalize sm:text-lg ${
                    profile?.gender === "male"
                      ? "text-blue-600"
                      : "text-pink-600"
                  }`}
                >
                  {profile?.gender || "Not specified"}
                </span>
              </div>

              {/* Activation Status Section */}
              <div className="flex items-center">
                <FiShield className="mr-3 text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-medium text-base text-gray-800 sm:text-lg">
                  Статус профиля:
                </span>
                <span
                  className={`ml-2 text-base sm:text-lg ${
                    profile?.isActivated ? "text-green-600" : "text-slate-600"
                  }`}
                >
                  {profile?.isActivated ? "Открыт" : "В ожидании"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliment Form Overlay */}
      <AnimatePresence>
        {isComplimenting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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

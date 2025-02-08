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
        className="relative bg-white p-8 py-20 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Edit Mode Toggle Button */}
          {isOwner && (
            <button
              type="button"
              onClick={handleEditToggle}
              className="text-xl text-blue-500 flex items-center gap-1 absolute top-4 right-4"
            >
              {isEditMode ? <FaTimes /> : <MdEdit />}
            </button>
          )}

          {/* Profile Image */}
          <div className="flex gap-3 items-center">
            {isEditMode ? (
              <FormField fieldName="imageFile">
                <FormField.Upload
                  type="display-image"
                  defaultImage={profile.profileImageUrl}
                />
              </FormField>
            ) : (
              <img
                src={profile.profileImageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 transition-transform duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* Display Name */}
          <div className="flex gap-3 items-center">
            {isEditMode ? (
              <FormField fieldName="displayName">
                <FormField.TextInput />
              </FormField>
            ) : (
              <h1 className="text-3xl font-extrabold text-gray-800">
                {profile.displayName}
              </h1>
            )}
          </div>

          {/* Biography */}
          <div className="flex gap-3 items-center">
            {isEditMode ? (
              <FormField fieldName="biography">
                <FormField.TextArea />
              </FormField>
            ) : (
              <p className="text-gray-600 text-center text-lg">
                {profile.biography || "No biography provided."}
              </p>
            )}
          </div>

          {/* Submit Button */}
          {isEditMode && (
            <button
              type="button"
              onClick={methods.handleSubmit(handleSubmit)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </FormProvider>
  );
}

export default UserProfile;

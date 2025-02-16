import { FadeInExpand } from "@/components/animations/FadeInExpand";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import {
  profileActivationSchema,
  type ProfileActivationPayload,
} from "@/lib/schemas/profile.schema";
import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Confetti from "react-confetti";
import { FormProvider, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { MdSend } from "react-icons/md";

const TEXTURE = `
  bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIxIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xMTYiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjE1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHJlc3VsdD0idHVyYnVsZW5jZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICAgICAgICAgIDxmZVNwZWN1bGFyTGlnaHRpbmcgc3VyZmFjZVNjYWxlPSIxNyIgc3BlY3VsYXJDb25zdGFudD0iMC43IiBzcGVjdWxhckV4cG9uZW50PSIyMCIgbGlnaHRpbmctY29sb3I9IiM3OTU3QTgiIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgaW49InR1cmJ1bGVuY2UiIHJlc3VsdD0ic3BlY3VsYXJMaWdodGluZyI+CiAgICAgICAgICAgICAgPGZlRGlzdGFudExpZ2h0IGF6aW11dGg9IjMiIGVsZXZhdGlvbj0iMTAwIj48L2ZlRGlzdGFudExpZ2h0PgogICAgICAgICAgICA8L2ZlU3BlY3VsYXJMaWdodGluZz4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0ic3BlY3VsYXJMaWdodGluZyIgcmVzdWx0PSJjb2xvcm1hdHJpeCI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPC9kZWZzPgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0PgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSIjNzk1N2E4IiBmaWx0ZXI9InVybCgjbm5ub2lzZS1maWx0ZXIpIj48L3JlY3Q+CiAgICAgIDwvc3ZnPgogICAg')] bg-blend-overlay
`;

type Props = {
  profile: Profile;
  onRefetchProfile: () => void;
};

export function ProfileActivationOverlay({ profile, onRefetchProfile }: Props) {
  const [showForm, setShowForm] = useState(!profile.isActivated);
  const mutation = useProfileMutation();
  const methods = useForm<ProfileActivationPayload>({
    resolver: zodResolver(profileActivationSchema),
  });
  const {
    formState: { errors },
    setError,
  } = methods;
  const toggleForm = () => setShowForm(!showForm);

  const handleUnlockProfile = (payload: ProfileActivationPayload) => {
    mutation.mutate(
      {
        type: "activate",
        payload,
        userId: profile.userId,
      },

      {
        onError: () => {
          setError("activationSecret", {
            message: "❌",
          });
        },
        onSuccess() {
          onRefetchProfile();
        },
      }
    );
  };

  if (!showForm) {
    return (
      <div className="flex justify-center items-center">
        <button
          type="button"
          className="absolute bottom-8 rounded-lg p-4 shadow-lg duration-300 hover:scale-125 z-10"
          aria-label="Unlock profile"
          onClick={toggleForm}
        >
          <FadeInExpand>
            <FaLock className="text-4xl text-white opacity-40 hover:opacity-100 duration-200" />
          </FadeInExpand>
        </button>
        <Confetti className="w-full h-full" />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-rows-2 justify-center items-center absolute w-screen h-screen bg-black z-20 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-20 backdrop-saturate-100 backdrop-contrast-100 ${TEXTURE}`}
    >
      {/* Avatar with name */}
      <div key={profile.id} className="flex flex-col items-center">
        <motion.img
          animate={{
            scale: [0, 1.5],
          }}
          src={profile.profileImageUrl}
          alt=""
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
        />
        <motion.div
          animate={{
            scale: [0, 1.5],
          }}
          className="relative"
        >
          <h1
            className={joinClasses(
              "relative -top-2 hover:scale-125 cursor-pointer",
              "transition-all duration-300 first-letter:uppercase",
              "font-bold rounded-lg font-caveat",
              "bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text p-2"
            )}
          >
            <span className="text-4xl md:text-6xl">{profile.displayName}</span>
          </h1>
        </motion.div>
      </div>
      {/* */}

      {/* Input section */}
      <FormProvider {...methods}>
        <form
          className=" flex gap-4 justify-center items-center px-10 self-start"
          onSubmit={(e) => {
            e.stopPropagation();
            methods.handleSubmit(handleUnlockProfile)(e);
          }}
        >
          <FadeInExpand>
            <FormField<ProfileActivationPayload>
              fieldName="activationSecret"
              className="relative flex justify-center"
            >
              <FormField.TextInput
                placeholder="Секрет"
                className={joinClasses(
                  "placeholder:text-gray-300 focus:text-white text-gray-300 bg-transparent",
                  "font-bold font-comfortaa text-lg px-4 py-4 border-opacity-10",
                  "hover:border-opacity-20 shadow-xl focus:scale-110 focus:border-opacity-20 focus:border-purple-600 rounded-xl",
                  {
                    "border-red-600": errors.activationSecret,
                    "border-purple-500": !errors.activationSecret,
                  }
                )}
              />

              <AnimatePresence>
                {errors.activationSecret && (
                  <motion.p
                    key="error-activation-secret"
                    exit={{
                      scale: [1, 0],
                    }}
                    animate={{
                      scale: [0.5, 1.5],
                      opacity: [0.0, 1],
                    }}
                    className="absolute -bottom-14"
                  >
                    {errors.activationSecret.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </FormField>
          </FadeInExpand>

          <button
            className="bg-white bg-opacity-10 p-4 rounded-full hover:shadow-sm border border-white
            border-opacity-10
            hover:border text-white  hover:border-pink-200 shadow-lg
            h-min hover:scale-125 transition-all duration-500"
            type="submit"
            aria-label="Submit activation secret"
          >
            <MdSend />
          </button>
        </form>
      </FormProvider>
      {/* */}
    </div>
  );
}

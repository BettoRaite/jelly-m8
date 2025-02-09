import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import ComplimentCardLayout from "@/components/userDashboard/ComplimentCardLayout";
import { getAuth, useAuth } from "@/hooks/useAuth";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useProfileQuery from "@/hooks/useProfileQuery";
import useUserQuery from "@/hooks/useUserQuery";
import {
  createComplimentSchema,
  type CreateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import { FormField } from "@/ui/formField/FormField";
import NavButton from "@/ui/NavButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { MdEdit } from "react-icons/md";

export default function UserDashboard() {
  const { data: profiles, status } = useProfileQuery({
    type: "profiles",
    searchParams: "gender=female",
  });
  const mutation = useComplimentMutation();
  const [profileIndex, setProfileIndex] = useState(0);
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
  });

  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return <ErrorScreen description="Не получилось загрузить профили" />;
  }
  if (profiles.length === 0) {
    return "no profiles";
  }

  const currentProfile = profiles.at(profileIndex) as Profile;
  const len = profiles.length;

  function handleShiftTo(dir: "prev" | "next") {
    if (dir === "prev" && profileIndex > 0) {
      setProfileIndex(profileIndex - 1);
    }
    if (dir === "next" && profileIndex < len - 1) {
      setProfileIndex(profileIndex + 1);
    }
  }
  function handleCreateCompliment(payload: CreateComplimentPayload) {
    mutation.mutate({
      type: "create",
      profileId: currentProfile.id,
      payload,
    });
  }

  return (
    <main className="relative flex justify-center items-center flex-col">
      <GoBack to="/" className="hover:text-gray-700" theme="dark" />
      <GlassyBackground className="bg-gray-200 h-full" />

      <div className="relative rounded-xl p-4 mt-20 flex flex-col items-center">
        {/* Profile Card Section */}
        <AnimatePresence>
          <motion.div
            key={currentProfile.id}
            className="h-auto w-[70%] max-w-[600px] relative"
          >
            <motion.img
              animate={{ scale: [0, 1] }}
              className="object-cover rounded-xl w-full h-[400px] shadow-2xl"
              src={currentProfile.profileImageUrl}
              alt={currentProfile?.displayName}
            />

            {/* Profile Name */}
            <h1 className="text-center text-6xl font-bold mt-8 text-pink-500">
              {currentProfile.displayName}
            </h1>

            <NavButton
              direction="left"
              onClick={() => handleShiftTo("prev")}
              className="ml-4 absolute top-[50%] -left-40"
            />
            <NavButton
              direction="right"
              onClick={() => handleShiftTo("next")}
              className="mr-4 absolute top-[50%] -right-40"
            />
          </motion.div>
        </AnimatePresence>

        {/* Compliment Form Section */}
        <section className="mt-16 w-[70%] max-w-[600px]">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleCreateCompliment)}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                Удиви девушку, напиши комплимент
                <MdEdit className="text-pink-400" />
              </h2>

              <div className="space-y-6">
                {/* Theme Select Field */}
                <FormField<CreateComplimentPayload> fieldName="title">
                  <FormField.Label
                    content="Teма"
                    className="text-[1rem] font-medium text-gray-600"
                  />
                  <FormField.Select
                    options={[
                      {
                        value: "Если бы мы встречались",
                        label: "Если бы мы встречались",
                      },
                    ]}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-pink-300 focus:ring-pink-300"
                  />
                </FormField>

                {/* Compliment Text Area */}
                <FormField<CreateComplimentPayload> fieldName="content">
                  <FormField.TextArea
                    placeholder="Напиши что-нибудь..."
                    className="min-h-[150px] w-full p-4 border border-gray-200 rounded-xl focus:border-pink-300 focus:ring-pink-300"
                  />
                </FormField>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-4 bg-gray-300 p-2 rounded-xl"
                >
                  <span className="font-bold bg-gradient-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text ">
                    Отправить
                  </span>
                </button>
              </div>
            </form>
          </FormProvider>
        </section>
      </div>

      <div className="mt-20">
        <h2 className="text-4xl font-bold text-gray-800 text-center w-full font-amatic bg-pink-300">
          Ищешь вдохновение?
        </h2>
        <p className="text-3xl font-bold text-gray-800 text-center w-full font-amatic">
          Тебе сюда
        </p>
      </div>
      <section className="w-[50%]">
        <ComplimentCardLayout
          key={currentProfile.id}
          profileId={currentProfile.id}
        />
      </section>
      <Toaster />
    </main>
  );
}

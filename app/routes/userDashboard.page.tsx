import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import { Tabs } from "@/components/userDashboard/Tabs";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useProfileQuery from "@/hooks/useProfileQuery";
import {
  createComplimentSchema,
  type CreateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

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
    <main className="bg-transparent">
      <Tabs />

      <GoBack
        to="/"
        className="hover:text-gray-700 bg-white/80 backdrop-blur-sm"
        theme="dark"
      />
    </main>
  );
}

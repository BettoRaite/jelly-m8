import CozyBackground from "@/components/Backgrounds/CozyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useProfileQuery from "@/hooks/useProfileQuery";
import {
  type CreateComplimentPayload,
  createComplimentSchema,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const { data: profiles, status } = useProfileQuery({
    type: "profiles",
    searchParams: "gender=female",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showComplimentForm, setShowComplimentForm] = useState(false);
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
  });
  const mutation = useComplimentMutation();
  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return <ErrorScreen description="Не получилось загрузить профили" />;
  }
  if (profiles.length === 0) {
    return "no profiles";
  }

  const handleMoveClick = (indexDelta: number) => {
    setActiveIndex((prev) => {
      const newIndex = prev + indexDelta;
      return Math.max(0, Math.min(newIndex, profiles.length - 1));
    });
  };

  function handleCreateCompliment(payload: CreateComplimentPayload) {
    mutation.mutate({
      type: "create",
      profileId: currentProfile.id,
      payload,
    });
  }
  const currentProfile = profiles.at(activeIndex) as Profile;
  return (
    <main className="pt-52 relative min-h-screen bg-white">
      <GoBack to="/" />
      <CozyBackground />
      <h1
        className="mb-20 w-full text-center text-7xl md:text-5xl font-bold text-pink-400
        drop-shadow-[0_0_10px_rgba(255,192,203,0.8)] sticky top-4 z-30 font-caveat"
      >
        <span className="bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent">
          TheGirls.
        </span>
      </h1>
      <div className="flex justify-center">
        <SearchBar onSearch={(s: string) => {}} />
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto
        relative z-20 rounded-xl shadow-lg"
      >
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </main>
  );
}

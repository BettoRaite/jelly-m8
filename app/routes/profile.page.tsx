import CreateProfileForm from "@/components/CreateProfileForm";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { QUERY_KEYS } from "@/lib/config";
import { useNavigate } from "react-router";
import type { Route } from "./+types/profile.page";
import { GoBack } from "@/components/GoBack";
import { motion } from "motion/react";
import UserProfile from "@/components/UserProfile";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";

export default function ProfilePage({ params }: Route.ComponentProps) {
  const userId = Number.parseInt(params.userId);
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const {
    data: profile,
    status: profileStatus,
    error: profileError,
  } = useProfileQuery(
    {
      type: "profile",
      userId: userId,
    },
    {
      queryKey: QUERY_KEYS.createProfileKey(userId ?? 0),
      retry: false,
    }
  );
  // Validate userId
  if (!Number.isFinite(userId) || userId < 0) {
    navigate("/");
    return null;
  }

  // Show loader while auth or profile data is loading
  if (profileStatus === "pending") {
    return <HeartLoader />;
  }

  // Handle profile fetch errors (excluding 404)
  if (profileStatus === "error" && profileError?.status !== 404) {
    return <div>An error occurred while fetching the profile.</div>;
  }
  const isOwner = user?.id === userId;
  return (
    <main className="flex justify-center items-center min-h-dvh p-4">
      <GoBack theme="dark" to="/" />
      {!profile && isOwner && <CreateProfileForm userId={userId} />}
      {!profile && !isOwner && (
        <h1 className="text-xl font-comfortaa font-bold">
          Упс... кажись пусто 👀
        </h1>
      )}
      {profile && <UserProfile profile={profile} isOwner={isOwner} />}
      <GlassyBackground className="bg-gray-200" />
    </main>
  );
}

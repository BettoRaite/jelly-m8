import CreateProfileForm from "@/components/CreateProfileForm";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/profile.page";
import { GoBack } from "@/components/GoBack";
import UserProfile from "@/components/UserProfile";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import { BiHeart, BiSearch, BiUser } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import PrivateComplimentsTab from "@/components/PrivateComplimentsTab";

export default function ProfilePage({ params }: Route.ComponentProps) {
  const userId = Number.parseInt(params.userId);
  const navigate = useNavigate();
  const { data: user, status } = useAuth();
  const [tab, setTab] = useState<"profile" | "compliments">("profile");
  const {
    data: profile,
    status: profileStatus,
    error: profileError,
    refetch,
  } = useProfileQuery(
    {
      type: "profile",
      userId: userId,
    },
    {
      retry: 2,
      enabled: status !== "pending",
    }
  );
  const {
    data: viewerProfile,
    status: viewerProfileStatus,
    error: viewerProfileError,
  } = useProfileQuery(
    {
      type: "profile",
      userId: user?.id as number,
    },
    {
      retry: 2,
      enabled: status !== "pending",
    }
  );

  // Validate userId
  if (!Number.isFinite(userId) || userId < 0) {
    navigate("/");
    return null;
  }

  // Show loader while auth or profile data is loading
  if (profileStatus === "pending" || viewerProfileStatus === "pending") {
    return <HeartLoader />;
  }

  // Handle profile fetch errors (excluding 404)
  if (profileStatus === "error" && profileError?.status !== 404) {
    return <ErrorScreen description="Что-то пошло не так" />;
  }
  const role =
    user?.id === userId
      ? "owner"
      : user && viewerProfile
      ? "user"
      : "unauthenticated";
  return (
    <div className="flex justify-center min-h-dvh py-10 px-2 bg-gradient-to-tr to-slate-100 from-slate-400 ">
      <GoBack />
      {!profile && role === "owner" && (
        <CreateProfileForm userId={userId} onProfileRefetch={refetch} />
      )}
      {!profile && role !== "owner" && (
        <p className="text-xl font-comfortaa font-bold">
          Упс... кажись пусто 👀
        </p>
      )}
      {profile && tab === "profile" && (
        <UserProfile profile={profile} role={role} />
      )}
      {profile && role === "owner" && tab === "compliments" && (
        <PrivateComplimentsTab />
      )}
      {/* <img
        src="../public/tokyopeople.jpg"
        alt=""
        className="absolute w-full h-full bottom-0 -z-20 blur-xl"
      /> */}
      <nav className="font-comfortaa backdrop-blur-sm text-sm fixed bottom-3 left-1/2 transform -translate-x-1/2">
        <ul
          className="flex flex-row gap-2 shadow-lg p-2 sm:p-3 text-xs sm:text-sm rounded-xl
                     relative bg-white  bg-opacity-30 border-gray-300 border
                     hover:bg-opacity-40 transition-all duration-300"
        >
          <li
            className="px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:bg-opacity-50
                       transition-all duration-200 active:scale-95"
          >
            <button
              onClick={() => setTab("profile")}
              type="button"
              className="text-slate-700 font-bold hover:text-gray-800 transition-colors duration-200
              flex items-center gap-2"
            >
              <BiUser /> Профиль
            </button>
          </li>
          {role === "owner" && (
            <li
              className="px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:bg-opacity-50
                       transition-all duration-200 active:scale-95"
            >
              <button
                type="button"
                onClick={() => setTab("compliments")}
                className="text-slate-700 font-bold hover:text-gray-800 transition-colors duration-200
                flex items-center gap-2"
              >
                <BiHeart />
                Мои комплименты
              </button>
            </li>
          )}
        </ul>
      </nav>
      <GlassyBackground className="-z-10" intensity="medium" />
    </div>
  );
}

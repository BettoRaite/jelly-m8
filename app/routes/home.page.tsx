import { Link } from "react-router";
import type { Route } from "./+types/home";
import { queryClient } from "@/lib/config";
import { useUser } from "@/hooks/useUser";
import { Loader } from "@/components/Loader";
import { AppScene } from "@/components/AppScene";
import { Vector3 } from "three";
import { HomeStage } from "@/components/models/HomeStage";
import { OrbitControls } from "@react-three/drei";
import { FaDashcube } from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BiShow } from "react-icons/bi";
import { LuEyeClosed } from "react-icons/lu";
import { RxEyeOpen } from "react-icons/rx";

import { useState } from "react";
import { GlowingCard } from "@/components/models/GlowingCard";
import GradientBackground from "@/components/GradientBackground";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data: getUserResponse, status } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  if (status === "pending") {
    return <Loader />;
  }

  const { role } = getUserResponse?.data ?? {};

  const createLink = (to: string, name = to, Icon?: IconType) => {
    if (Icon) {
      return (
        <Link
          to={to}
          className="absolute right-4 top-4 capitalize z-10 bg-white"
        >
          <Icon className="text-4xl" />
        </Link>
      );
    }
    return (
      <Link
        to={to}
        className="text-400 text-blue-600 text-2xl font-bold p-2 rounded-lg absolute right-4 top-4 capitalize z-10 bg-white"
      >
        {name}
      </Link>
    );
  };

  return (
    <div className="relative" style={{ width: "100dvw", height: "100dvh" }}>
      <GradientBackground />
      {!role && createLink("login", "Рег")}
      {role === "admin" && createLink("dashboard")}
      {role === "user" && createLink("user-profile", "Профиль")}
      <AppScene cameraPosition={new Vector3(0, 5, 30)}>
        <ambientLight color="0x999999" position={[0, 0, 0]} scale={10} />
        <HomeStage />
      </AppScene>
      <div className="flex w-full absolute bottom-0 justify-center mb-8">
        <Link
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-white rounded-lg p-2 shadow-lg hover:p-4 duration-300"
          to={"/profiles"}
        >
          {isHovered && <RxEyeOpen className="text-5xl" />}
          {!isHovered && <LuEyeClosed className="text-5xl" />}
        </Link>
      </div>
    </div>
  );
}

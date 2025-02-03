import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import { Loader } from "@/components/Loader";
import { HomeStage } from "@/components/models/HomeStage";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import type { IconType } from "react-icons/lib";
import { Link } from "react-router";
import { Vector3 } from "three";

export default function Home() {
  const { data: getUserResponse, status } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  if (status === "pending") {
    return <Loader />;
  }
  const { userRole: role } = getUserResponse ?? {};

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
      <AnimatedGradientBackground />
      {!role && createLink("login", "Рег")}
      {role === "admin" && createLink("dashboard")}
      {role === "user" && createLink("user-profile", "Профиль")}
      <AppScene cameraPosition={new Vector3(0, 5, 30)}>
        <ambientLight color="0x999999" position={[0, 0, 0]} scale={10} />
        <HomeStage />
      </AppScene>
      <div className="flex w-full absolute bottom-0 gap-4 justify-center mb-8">
        <Link
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
          to={"/cards"}
        >
          <HiOutlineSquare2Stack className="text-3xl text-cyan-50" />
        </Link>
        <Link
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
          to={"/user-dashboard"}
        >
          <FaUser className="text-3xl text-cyan-50" />
        </Link>
      </div>
    </div>
  );
}

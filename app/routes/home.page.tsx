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
import {
  MdDashboard,
  MdLogin,
  MdLogout,
  MdOutlineLogout,
  MdSpaceDashboard,
} from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";

import { FaRegComments } from "react-icons/fa";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { RiProfileFill } from "react-icons/ri";
import { useSessionMutation } from "@/hooks/useSessionMutation";

export default function Home() {
  const { data: user, status } = useAuth();
  const session = useSessionMutation();
  const [isHovered, setIsHovered] = useState(false);
  if (status === "pending") {
    return <Loader />;
  }
  const { userRole: role } = user ?? {};

  function handleLogout() {
    session.mutate({
      type: "logout",
    });
  }
  console.log(user);
  return (
    <div className="relative" style={{ width: "100dvw", height: "100dvh" }}>
      <AnimatedGradientBackground />
      <AppScene>
        <OrbitControls />
        <PerspectiveCamera
          position={new Vector3(0, 6, 25)}
          makeDefault
          fov={45}
        />
        <ambientLight color="0x999999" position={[0, 0, 0]} scale={10} />
        <HomeStage />
      </AppScene>
      <div className="flex w-full absolute bottom-0 gap-4 justify-center mb-8">
        <Link
          className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
          to={"/cards"}
        >
          <HiOutlineSquare2Stack className="text-3xl text-cyan-50" />
        </Link>
        {user && (
          <Link
            className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
            to={"/user-dashboard"}
          >
            <FaRegComments className="text-3xl text-cyan-50" />
          </Link>
        )}
        {role === "admin" && (
          <Link
            className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
            to={"/dashboard"}
          >
            <MdDashboard className="text-3xl text-cyan-50" />
          </Link>
        )}
        {user && (
          <Link
            className=" rounded-lg p-2 shadow-lg hover:scale-125 duration-500"
            to={`/profile/${user.id}`}
          >
            <FaUser className="text-3xl text-cyan-50" />
          </Link>
        )}
      </div>
      {user ? (
        <button
          type="button"
          onClick={handleLogout}
          className="absolute top-4 right-4"
        >
          <MdOutlineLogout className="text-3xl text-cyan-50" />
        </button>
      ) : (
        <Link to={"/login"} className="absolute top-4 right-4">
          <IoMdLogIn className="text-3xl text-cyan-50" />
        </Link>
      )}
    </div>
  );
}

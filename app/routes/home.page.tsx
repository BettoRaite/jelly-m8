import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { IoMdLogIn } from "react-icons/io";
import { MdDashboard, MdOutlineLogout } from "react-icons/md";
import { Link } from "react-router";
import { Vector3 } from "three";

import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { useSessionMutation } from "@/hooks/useSessionMutation";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { FaRegComments } from "react-icons/fa";
import { joinClasses } from "@/lib/utils/strings";
import { HeartLoader } from "@/components/HeartLoader";

export default function Home() {
  const { data: user, status } = useAuth();
  const session = useSessionMutation();
  const [isHovered, setIsHovered] = useState(false);
  if (status === "pending") {
    return <HeartLoader className="bg-black" />;
  }
  const { userRole: role } = user ?? {};

  function handleLogout() {
    session.mutate({
      type: "logout",
    });
  }

  const links = [
    {
      isShown: true,
      icon: <HiOutlineSquare2Stack className="text-3xl text-cyan-50" />,
      to: "/cards",
    },
    {
      isShown: !!user,
      icon: <FaRegComments className="text-3xl text-cyan-50" />,
      to: "/user-dashboard",
    },
    {
      isShown: role === "admin",
      icon: <MdDashboard className="text-3xl text-cyan-50" />,
      to: "/dashboard",
    },
    {
      isShown: !!user,
      icon: <FaUser className="text-3xl text-cyan-50" />,
      to: `/profile/${user?.id}`,
    },
  ];

  return (
    <div
      className="relative bg-black"
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <AnimatedGradientBackground />
      <GlassyBackground className="w-full h-full z-0" />
      <AppScene>
        <OrbitControls />
        <PerspectiveCamera
          position={new Vector3(0, 6, 25)}
          makeDefault
          fov={45}
        />
        <directionalLight position={[0, 0, 5]} color={"white"} />
        {/* <HomeStage /> */}
      </AppScene>
      <div className="flex w-full absolute bottom-0 gap-4 justify-center mb-8">
        <div
          className={joinClasses(
            "relative flex gap-4 justify-center p-2 rounded-xl shadow-lg",
            "border border-gray-100 border-opacity-25 bg-opacity-10 bg-white"
          )}
        >
          {links.map((link, index) => {
            return (
              link.isShown && (
                <Link
                  key={link.to}
                  className={joinClasses(
                    "rounded-full p-2 shadow-xl hover:scale-125 duration-500",
                    "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]",
                    "from-[#9d174d] via-[#d946ef] to-[#f0abfc]"
                  )}
                  to={link.to}
                >
                  {link.icon}
                </Link>
              )
            );
          })}
        </div>
      </div>

      {user ? (
        <button
          type="button"
          onClick={handleLogout}
          className={joinClasses(
            "text-lg font-bold hover:scale-75 transition-transform duration-500 absolute top-4 right-4",
            "bg-gradient-to-l from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text"
          )}
        >
          Выйти
        </button>
      ) : (
        <Link
          to={"/login"}
          className={joinClasses(
            "text-xl font-bold hover:scale-125 transition-transform duration-500 absolute top-4 right-4",
            "bg-white bg-opacity-20"
          )}
        >
          Логин
        </Link>
      )}
    </div>
  );
}

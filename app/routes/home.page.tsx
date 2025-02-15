import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import { useSessionMutation } from "@/hooks/useSessionMutation";
import { ERROR_MESSAGES } from "@/lib/constants";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegComments, FaUser } from "react-icons/fa";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router";
import { Vector3 } from "three";

export default function Home() {
  const { data: user, status, refetch } = useAuth();
  const session = useSessionMutation();
  const handleLogout = useCallback(async () => {
    try {
      await session.mutateAsync({ type: "logout" });
      refetch();
    } catch (err) {
      console.error(err);
      toast(ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }, [session, refetch]);

  const { userRole: role } = user ?? {};
  const links = [
    {
      isShown: true,
      icon: (
        <HiOutlineSquare2Stack className="text-xl md:text-3xl text-cyan-50" />
      ),
      to: "/cards",
    },
    {
      isShown: true,
      icon: <FaRegComments className="text-xl md:text-3xl text-cyan-50" />,
      to: "/discovery",
    },
    {
      isShown: role === "admin",
      icon: <MdDashboard className="text-xl md:text-3xl text-cyan-50" />,
      to: "/dashboard",
    },
    {
      isShown: true,
      icon: <FaUser className="text-xl md:text-3xl text-cyan-50" />,
      to: user ? `/users/${user?.id}/profile` : "/login",
    },
  ];

  if (status === "pending") {
    return <HeartLoader className="bg-black" />;
  }

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
                  viewTransition
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

      {user && (
        <Button
          type="button"
          onClick={handleLogout}
          className={joinClasses(
            " absolute top-4 right-4 text-white font-bold opacity-60 hover:opacity-100"
          )}
        >
          Выйти
        </Button>
      )}
      <Toaster />
    </div>
  );
}

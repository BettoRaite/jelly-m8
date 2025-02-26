import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
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
import { motion } from "motion/react";
import { ParticlesWrapper } from "@/components/ParticlesWrapper";
import ReactConfetti from "react-confetti";
import { FiInfo } from "react-icons/fi";
export default function Home() {
  const { data: user, status, refetch } = useAuth();
  const session = useSessionMutation();
  const { data: profiles, status: profilesStatus } = useProfileQuery({
    type: "profiles",
  });
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
      icon: <FaRegComments className="text-xl md:text-3xl text-cyan-50" />,
      to: "/discovery",
    },
    {
      isShown: true,
      icon: (
        <HiOutlineSquare2Stack className="text-xl md:text-3xl relative text-cyan-50" />
      ),
      to: "/cards",
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

  if (status === "pending" || profilesStatus === "pending") {
    return <HeartLoader className="bg-black" />;
  }
  const unlockedCount =
    profiles?.filter((profile) => profile.isActivated).length || 0;

  return (
    <div
      className="relative bg-black flex justify-center items-center overflow-hidden"
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <span className="absolute z-10 top-32 font-caveat mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-8xl box-content font-extrabold text-transparent text-center select-none">
        JellyM8
      </span>
      <motion.h1
        animate={{
          scale: [0, 1.1, 1],
          y: [0, -40, 0],
          rotate: [0, 20, -20, 0],
          opacity: [0, 1],
        }}
        transition={{
          delay: 0.4,
        }}
        className="pr-2 absolute z-10 top-32 font-caveat w-fit h-auto py-4 text-6xl  sm:text-8xl
        bg-gradient-to-tr from-pink-200  to-white bg-clip-text text-transparent"
      >
        JellyM
        <span className="text-pink-500 absolute rotate-[15deg] bottom-0 sm:-bottom-4 sm:-right-6">
          8
        </span>
      </motion.h1>
      <motion.img
        fetchPriority="high"
        animate={{
          y: [0, 2, 0, -2, 0], // Subtle vertical sway
          x: [0, 3, 0, -3, 0], // Subtle horizontal sway
          rotate: [0, 0.5, 0, -0.5, 0], // Very slight rotation
        }}
        transition={{
          duration: 8, // Longer duration for a calmer effect
          ease: "easeInOut", // Smooth easing
          repeat: Number.POSITIVE_INFINITY, // Infinite loop
          repeatType: "mirror", // Mirror the animation for seamless looping
        }}
        src="/nihongoyama.jpg"
        className="absolute z-0 w-full h-full object-cover"
      />
      <GlassyBackground className="w-full h-full z-0" />
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
      {/* <ReactConfetti friction={0.985} /> */}
      {user ? (
        <Button
          type="button"
          onClick={handleLogout}
          className={joinClasses(
            " absolute top-4 right-4 text-white font-bold opacity-60 hover:opacity-100"
          )}
        >
          Выйти
        </Button>
      ) : (
        <Link
          type="button"
          to={"/login"}
          className={joinClasses(
            " absolute top-4 right-4 text-white font-bold opacity-60 hover:opacity-100 bg-white bg-opacity-20",
            "p-2 rounded-xl border border-white border-opacity-20 transition-all duration-300"
          )}
        >
          Войти
        </Link>
      )}
      <Toaster />
      <div className="font-jost w-52 h-52 absolute bottom-10 bg-white bg-opacity-20 border border-white  right-20 rounded-xl p-4">
        <p className="text-white text-sm text-center">Профилей активированно</p>
        <p className="text-white text-sm text-center">
          {unlockedCount}/{profiles?.length ?? 0}
        </p>
      </div>
      <Button className="scale-90 absolute z-10 bottom-4 right-4 rounded-[100%] ">
        <FiInfo className="text-white md:my-2" />
      </Button>
    </div>
  );
}

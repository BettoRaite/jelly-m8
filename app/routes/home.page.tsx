import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { useSessionMutation } from "@/hooks/useSessionMutation";
import { ERROR_MESSAGES } from "@/lib/constants";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { useCallback, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegComments, FaUser } from "react-icons/fa";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router";
import { motion } from "motion/react";
import ReactConfetti from "react-confetti";
import { FiInfo, FiPlay } from "react-icons/fi";
import TypingTextEffect from "@/components/TypingText";

export default function Home() {
  const { data: user, status, refetch } = useAuth();
  const session = useSessionMutation();
  const { data: profiles, status: profilesStatus } = useProfileQuery({
    type: "profiles",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const handleLogout = useCallback(async () => {
    try {
      await session.mutateAsync({ type: "logout" });
      refetch();
    } catch (err) {
      console.error(err);
      toast(ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }, [session, refetch]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

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
  const areAllProfilesActivated = unlockedCount === profiles?.length;

  const currentDate = new Date();
  const isMarch = currentDate.getMonth() === 2;
  const is8thMarch = isMarch && currentDate.getDate() === 8;

  return (
    <div
      className="relative bg-black flex justify-center items-center overflow-hidden"
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <audio ref={audioRef} src="/music/leateq_tokyo.mp3" />
      <span className="absolute z-10 top-32 font-caveat mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-8xl box-content font-extrabold text-transparent text-center select-none">
        JellyM8
      </span>
      <div className="absolute z-10 top-32 flex justify-center items-center flex-col">
        <motion.h1
          animate={{
            scale: [0, 1.1, 1],
            y: [0, -40, 0],
            opacity: [0, 1],
          }}
          transition={{
            delay: 0.4,
            duration: 0.1,
            type: "spring",
            mass: 0.75,
            damping: 6,
          }}
          className="pr-2 relative font-caveat w-fit h-auto py-4 text-6xl  sm:text-8xl
          bg-gradient-to-tr from-pink-200  to-white bg-clip-text text-transparent"
        >
          JellyM
          <span className="text-pink-500 absolute rotate-[15deg] bottom-0 sm:-bottom-4 sm:-right-6">
            8
          </span>
        </motion.h1>
        <Button
          onClick={togglePlayPause}
          roundedness="rounded-full"
          className="mt-10 scale-75 opacity-60 hover:scale-100 transition-all duration-500"
        >
          <FiPlay className="text-white md:my-2" />
        </Button>
        {isPlaying && (
          <div className="overflow-hidden rounded-xl">
            <Link
              to={"https://www.youtube.com/watch?v=qR4jvErGitg"}
              className="text-sm text-white text-opacity-80 font-jost animate-slideRight"
            >
              Leat'eq - Tokyo
            </Link>
          </div>
        )}
      </div>
      <motion.img
        fetchPriority="high"
        animate={{
          y: [0, 2, 0, -2, 0], // Subtle vertical sway
          x: [0, 4, 0, -4, 0], // Subtle horizontal sway
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
      {is8thMarch && <ReactConfetti friction={0.985} />}
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
      {/* Info panel */}
      {showInfoPanel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100, x: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          className="font-jost w-52 h-52 sm:w-64 sm:h-64 absolute bottom-10 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white
          border-opacity-30 right-14 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center space-y-4"
        >
          {!areAllProfilesActivated && (
            <>
              <p className="text-white text-lg text-center font-bold">
                Осталось активировать профилей
              </p>
              <p className="text-white text-2xl text-center font-semibold">
                {unlockedCount}/{profiles?.length ?? 0}
              </p>
            </>
          )}
          {areAllProfilesActivated && (
            <p className="text-white text-[1rem] text-center font-bold">
              Поздравляю вы активировали все профили 🥳
            </p>
          )}
          {/* Video Link */}
          {areAllProfilesActivated && (
            <Link
              to="https://drive.google.com/file/d/1v8sNHC4vEcWHi7Y6yrYcBgCd_WVzuQpH/view?usp=drive_link" // Replace with your video link
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Watch Video
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
          )}
        </motion.div>
      )}
      {/* cta text */}
      {areAllProfilesActivated && !showInfoPanel && (
        <motion.div
          className="z-10 bottom-5 md:bottom-6 md:right-20 right-14 absolute"
          animate={{
            scale: [0.9, 1, 0.9],
          }}
          transition={{
            delay: 1,
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <TypingTextEffect
            className="font-caveat text-white text-sm md:text-lg"
            text="Кажись тут что-то есть 👉"
          />
        </motion.div>
      )}
      {/* toggle info panel btn */}
      <Button
        onClick={() => setShowInfoPanel((s) => !s)}
        className="scale-90 absolute z-10 bottom-4 right-4 rounded-[100%]"
      >
        <FiInfo className="text-white md:my-2" />
      </Button>
      <Link
        to={"/about"}
        className=" absolute text-sm sm:text-[1.2rem] bottom-1 sm:left-2 text-slate-300 text-opacity-30 font-caveat"
      >
        Made by bettoraite
      </Link>
    </div>
  );
}

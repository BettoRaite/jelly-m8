import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import { GlowingCard } from "@/components/models/GlowingCard";
import { ParticlesWrapper } from "@/components/ParticlesWrapper";
import { ProfileActivationOverlay } from "@/components/ProfileActivationOverlay";
import SearchBar from "@/components/SearchBar";
import { SmoothCamera } from "@/components/SmoothCamera";
import useProfileQuery from "@/hooks/useProfileQuery";
import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import NavButton from "@/ui/NavButton";
import * as motion from "motion/react-client";
import { forwardRef, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { BiHeart } from "react-icons/bi";
import { FaQuestion, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { Vector3 } from "three";
import { BsStars } from "react-icons/bs";

const CAM_MOVE_DIST = 1.2;

export default function Cards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);
  const [displayParticles, setDisplayParticles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: profiles,
    status,
    refetch,
  } = useProfileQuery(
    {
      type: "profiles",
      searchParams: "gender=female",
    },
    {
      retry: false,
    }
  );

  if (status === "pending") return <HeartLoader />;
  if (status === "error")
    return (
      <ErrorScreen description="Что-то пошло не так с загрузкой профилей" />
    );
  const profile: Profile | undefined = searchQuery
    ? profiles?.find((p) =>
        p.displayName
          .trim()
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      )
    : profiles?.[activeIndex];

  function handleMoveClick(indexDelta: number) {
    if (searchQuery) {
      setSearchQuery("");
      setOpenSearch(false);
    }
    setActiveIndex((prev) => {
      const newIndex = prev + indexDelta;
      return Math.max(0, Math.min(newIndex, (profiles?.length ?? 1) - 1));
    });
  }
  function handleSearch(s: string) {
    setSearchQuery(s);
  }
  return (
    <main
      className={"overflow-hidden bg-transparent relative"}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <AnimatedGradientBackground />
      {profile && !profile.isActivated && (
        <ProfileActivationOverlay
          profile={profile}
          onRefetchProfile={refetch}
        />
      )}
      <GlassyBackground className="opacity-50" intensity="medium" />
      <GoBack to="/" className="opacity-20 hover:opacity-80" />
      {displayParticles && <ParticlesWrapper key="particles" />}

      {/* Search bar */}
      <div className="w-[50%] flex justify-end items-center gap-2 absolute top-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setOpenSearch(!openSearch)}
          className="text-white text-opacity-40 rounded-full bg-white p-3
          flex justify-center items-center bg-opacity-20
          hover:text-opacity-100 transition duration-300 "
        >
          <FaSearch />
        </button>
        {openSearch && (
          <SearchBar
            onChange={handleSearch}
            classNameContainer="w-full max-w-60"
            className="bg-opacity-10 bg-white border-none text-white w-full"
            showSearchBtn={false}
          />
        )}
      </div>

      {/* Card scene */}
      {profile?.isActivated && (
        <AppScene>
          <SmoothCamera targetPos={new Vector3(0, 0, 1)} />
          <GlowingCard
            showSpecialEffects={!displayParticles}
            key={profile.id}
            profile={profile}
          />
        </AppScene>
      )}
      {/* --- */}
      <header className="flex justify-center">
        <h1
          className={joinClasses(
            "z-20 flex absolute top-[10%] md:top-[40%] md:left-[10%] hover:scale-125 cursor-pointer",
            "active:text-pink-600 transition-all duration-300 first-letter:uppercase",
            "lg:text-8xl md:text-7xl text-6xl font-bold text-white p-4 rounded-lg font-amatic",
            {
              "top-[23%] left-auto": !profile?.isActivated,
            }
          )}
        >
          {(profile?.isActivated && profile.displayName) ?? "Тут пустенько..."}
          <ReactConfetti className="h-full w-full" />
        </h1>
      </header>
      {/* Navigation menu */}
      <div className="flex justify-center w-screen absolute z-20 bottom-0 left-0 gap-20">
        <NavButton
          direction="left"
          onClick={() => handleMoveClick(-1)}
          disabled={activeIndex === 0}
          ariaLabel="Previous profile"
          className={joinClasses(
            "z-40 border-none cursor-pointer hover:text-gray-100 text-gray-500",
            {
              "opacity-15 pointer-events-none": activeIndex === 0,
            }
          )}
          classNameIcon="duration-300"
        />
        <Link
          to={`tribute/${profile?.userId}`}
          viewTransition
          className={joinClasses(
            "p-4 bg-gray-200 rounded-full opacity-60 relative -bottom-4 hover:bottom-4",
            "transition-all duration-500 hover:opacity-100 hover:shadow-xl hover:shadow-pink-500",
            "hover:text-pink-500",
            {
              "opacity-10 pointer-events-none": !profile?.isActivated,
            }
          )}
        >
          <BiHeart />
        </Link>
        <NavButton
          direction="right"
          onClick={() => handleMoveClick(1)}
          disabled={activeIndex === (profiles?.length ?? 1) - 1}
          ariaLabel="Next profile"
          className={joinClasses(
            "z-40 border-none cursor-pointer hover:text-gray-100 text-gray-500",
            {
              "opacity-15 pointer-events-none":
                activeIndex === (profiles?.length ?? 1) - 1,
            }
          )}
          classNameIcon="duration-300"
        />
      </div>
      {/* Toggle particles */}
      <button
        className="absolute bottom-4 right-4 z-20 opacity-60
        hover:opacity-100 hover:scale-125 transition-all duration-300 active:scale-90"
        type="button"
        onClick={() => setDisplayParticles(!displayParticles)}
      >
        <BsStars className="text-3xl text-white" />
      </button>

      {/* --- */}
      <p
        className="z-50 absolute bottom-14 md:bottom-10 left-4 md:left-10 text-white font-jost bg-white bg-opacity-10 p-3 md:p-6
        rounded-2xl  flex justify-center items-center backdrop-blur-sm shadow-lg opacity-50 md:opacity-100"
      >
        <motion.span
          key={profile?.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-xl md:text-3xl font-bold text-white"
        >
          {activeIndex + 1}
        </motion.span>
        <span className="md:text-lg text-white opacity-80 mx-1">/</span>
        <span className="md:text-xl text-white opacity-80">
          {profiles?.length}
        </span>
      </p>
    </main>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { Vector3 } from "three";
import * as motion from "motion/react-client";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { AppScene } from "@/components/AppScene";
import { GoBack } from "@/components/GoBack";
import { Loader } from "@/components/Loader";
import { GlowingCard } from "@/components/models/GlowingCard";
import { ProfileActivationOverlay } from "@/components/ProfileActivationOverlay";
import { ParticlesWrapper } from "@/components/ParticlesWrapper";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import useProfileQuery from "@/hooks/useProfileQuery";
import { queryKeys } from "@/lib/config";
import { joinClasses } from "@/lib/utils/strings";
import type { Profile } from "@/lib/types";
import ReactConfetti from "react-confetti";
import { forwardRef } from "react";
import NavButton from "@/ui/NavButton";
import { SmoothCamera } from "@/components/SmoothCamera";
import ErrorScreen from "@/components/ErrorScreen";
const CAM_MOVE_DIST = 1.2;

// Extracted ProfileScene Component
const ProfileScene = ({ profile }: { profile: Profile }) => (
  <AppScene>
    <SmoothCamera targetPos={new Vector3(0, 0, 1)} />
    {profile.isActivated && <GlowingCard key={profile.id} profile={profile} />}
  </AppScene>
);

// Extracted ScrollSection Component
const ScrollSection = forwardRef(
  (
    {
      children,
      hasScrolled,
    }: {
      children: React.ReactNode;
      hasScrolled: boolean;
    },
    ref
  ) => (
    <section
      ref={ref}
      className={`${
        hasScrolled ? "overflow-y-scroll" : "overflow-hidden"
      } bg-transparent relative`}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      {children}
    </section>
  )
);

export default function Cards() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const profileSectionRef = useRef<HTMLElement>(null);
  const cardsSectionRef = useRef<HTMLElement>(null);

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

  if (status === "pending") return <Loader />;
  if (status === "error")
    return (
      <ErrorScreen description="Что-то пошло не так с загрузкой профилей" />
    );
  console.log(profiles);
  const profile: Profile | undefined =
    profiles.length === 0 ? undefined : profiles[activeIndex];

  const handleMoveClick = (indexDelta: number) => {
    setActiveIndex((prev) => {
      const newIndex = prev + indexDelta;
      return Math.max(0, Math.min(newIndex, (profiles?.length ?? 1) - 1));
    });
  };

  const handleScroll = (target: "down" | "up") => {
    const section =
      target === "down" ? profileSectionRef.current : cardsSectionRef.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolled(target === "down");
      setTimeout(() => {
        navigate(`tribute/${profile?.userId}`);
      }, 500);
    }
  };

  return (
    <div
      className={`${hasScrolled ? "overflow-y-scroll" : "overflow-hidden"}
      bg-transparent relative`}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <ScrollSection ref={cardsSectionRef} hasScrolled={hasScrolled}>
        <AnimatedGradientBackground />
        {profile && !profile.isActivated && (
          <ProfileActivationOverlay
            profile={profile}
            onRefetchProfile={refetch}
          />
        )}
        {/* <div className="absolute z-0 opacity-100 top-0 left-0 h-full w-full bg-[url('../public/hearts-no-bg.png')] bg-repeat bg-center animate-scroll" /> */}
        <GoBack to="/" className="opacity-20 hover:opacity-80" />
        {!hasScrolled && <ParticlesWrapper />}

        {profile && <ProfileScene profile={profile} />}

        <header className="flex justify-center">
          <h1
            className={joinClasses(
              "z-20 flex absolute top-[40%] left-[10%] hover:scale-125 cursor-pointer",
              "active:text-pink-600 transition-all duration-300 first-letter:uppercase",
              "text-8xl font-bold text-white p-4 rounded-lg font-amatic",
              {
                "top-[23%] left-auto": !profile?.isActivated,
              }
            )}
          >
            {(profile?.isActivated && profile.displayName) ?? "Пусто"}
            <ReactConfetti className="h-full w-full" />
          </h1>
        </header>
        <NavButton
          direction="left"
          onClick={() => handleMoveClick(-1)}
          disabled={activeIndex === 0}
          ariaLabel="Previous profile"
          className={joinClasses(
            "z-40 absolute bottom-4 left-4 border-none cursor-pointer hover:text-gray-100 text-gray-500",
            {
              "opacity-15 pointer-events-none": activeIndex === 0,
            }
          )}
          classNameIcon="duration-300"
        />

        <NavButton
          direction="right"
          onClick={() => handleMoveClick(1)}
          disabled={activeIndex === (profiles?.length ?? 1) - 1}
          ariaLabel="Next profile"
          className={joinClasses(
            "z-40 absolute bottom-4 right-4 border-none cursor-pointer hover:text-gray-100 text-gray-500",
            {
              "opacity-15 pointer-events-none":
                activeIndex === (profiles?.length ?? 1) - 1,
            }
          )}
          classNameIcon="duration-300"
        />

        {profile?.isActivated && (
          <div className="flex justify-center w-screen absolute z-20 bottom-0 left-0">
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="p-4 bg-gray-200 rounded-full opacity-60 relative -bottom-4 hover:bottom-4 transition-all duration-500 hover:opacity-100"
              onClick={() => handleScroll("down")}
              aria-label="View profile details"
            >
              <BiHeart />
            </motion.button>
          </div>
        )}
      </ScrollSection>

      <section ref={profileSectionRef} className="h-dvh w-dvh bg-black">
        {hasScrolled && <ReactConfetti className="h-full w-full" />}
      </section>
    </div>
  );
}

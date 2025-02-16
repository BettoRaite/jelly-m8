import { AppScene } from "@/components/AppScene";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import { GlowingCard } from "@/components/models/GlowingCard";
import { ParticlesWrapper } from "@/components/ParticlesWrapper";
import { ProfileActivationOverlay } from "@/components/ProfileActivationOverlay";
import { SmoothCamera } from "@/components/SmoothCamera";
import useProfileQuery from "@/hooks/useProfileQuery";
import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import NavButton from "@/ui/NavButton";
import * as motion from "motion/react-client";
import { forwardRef, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { BiHeart } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import { Vector3 } from "three";
const CAM_MOVE_DIST = 1.2;

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

  if (status === "pending") return <HeartLoader />;
  if (status === "error")
    return (
      <ErrorScreen description="Что-то пошло не так с загрузкой профилей" />
    );
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

        {profile && (
          <AppScene>
            <SmoothCamera targetPos={new Vector3(0, 0, 1)} />
            {profile.isActivated && (
              <GlowingCard key={profile.id} profile={profile} />
            )}
          </AppScene>
        )}

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
              "transition-all duration-500 hover:opacity-100",
              {
                "opacity-5 pointer-events-none": !profile?.isActivated,
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
      </ScrollSection>
      {/*

  <motion.button
    whileTap={{ scale: 0.8 }}
    className="p-4 bg-gray-200 rounded-full opacity-60 relative -bottom-4 hover:bottom-4 transition-all duration-500 hover:opacity-100"
    onClick={() => handleScroll("down")}
    aria-label="View profile details"
  >
    <BiHeart />
  </motion.button>
  */}
      <section ref={profileSectionRef} className="h-dvh w-dvh bg-black">
        {hasScrolled && <ReactConfetti className="h-full w-full" />}
      </section>
    </div>
  );
}

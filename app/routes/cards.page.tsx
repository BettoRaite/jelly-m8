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
const CAM_MOVE_DIST = 1.2;

// Extracted NavButton Component
// const NavButton = ({
//   direction,
//   onClick,
//   disabled,
//   ariaLabel,
// }: {
//   direction: "left" | "right";
//   onClick?: () => void;
//   disabled?: boolean;
//   ariaLabel?: string;
// }) => {
//   const Icon = direction === "left" ? FaChevronLeft : FaChevronRight;

//   return (
//     <motion.button
//       whileTap={{ scale: 0.8 }}
//       onClick={onClick}
//       className={`z-20 absolute top-[45%] ${
//         direction === "left" ? "left-4" : "right-4"
//       }
//         p-4 bg-gray-200 rounded-full transition-all duration-300 ${
//           disabled ? "pointer-events-none opacity-20" : ""
//         }`}
//       aria-label={ariaLabel}
//       disabled={disabled}
//     >
//       <Icon />
//     </motion.button>
//   );
// };

// Extracted ProfileScene Component
const ProfileScene = ({ profile }: { profile: Profile }) => (
  <AppScene cameraPosition={new Vector3(0, 0, 1)}>
    {profile.isActivated && (
      <GlowingCard key={profile.id} position={[0, 0, -50]} profile={profile} />
    )}
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

export default function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const profileSectionRef = useRef<HTMLElement>(null);
  const cardsSectionRef = useRef<HTMLElement>(null);

  const { data: profiles, status } = useProfileQuery(
    { type: "profiles", queryKey: queryKeys.profilesKey },
    { retry: false }
  );

  const handleMoveClick = useCallback(
    (indexDelta: number) => {
      setActiveIndex((prev) => {
        const newIndex = prev + indexDelta;
        return Math.max(0, Math.min(newIndex, (profiles?.length ?? 1) - 1));
      });
    },
    [profiles?.length]
  );

  const handleScroll = (target: "down" | "up") => {
    const section =
      target === "down" ? profileSectionRef.current : cardsSectionRef.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolled(target === "down");
      setTimeout(() => {
        navigate(`profiles/${profile.id}`);
      }, 500);
    }
  };

  if (status === "pending") return <Loader />;
  if (status === "error" || profiles.length === 0 || !profiles)
    return navigate("/");

  const profile = profiles[activeIndex] ?? {};

  return (
    <div
      className={`${hasScrolled ? "overflow-y-scroll" : "overflow-hidden"}
      bg-transparent relative`}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <ScrollSection ref={cardsSectionRef} hasScrolled={hasScrolled}>
        <AnimatedGradientBackground preset="DEFAULT" />
        {!profile.isActivated && <ProfileActivationOverlay profile={profile} />}
        {/* <div className="absolute z-0 opacity-100 top-0 left-0 h-full w-full bg-[url('../public/hearts-no-bg.png')] bg-repeat bg-center animate-scroll" /> */}
        <GoBack to="/" />
        {!hasScrolled && <ParticlesWrapper />}

        <ProfileScene profile={profile} />

        <header className="flex justify-center">
          <h1
            className={joinClasses(
              "z-20 flex absolute top-[40%] left-[10%] hover:scale-125 cursor-pointer",
              "active:text-pink-600 transition-all duration-300 first-letter:uppercase",
              "font-bold text-7xl text-white p-4 rounded-lg",
              {
                "top-[23%] left-auto": !profile.isActivated,
              }
            )}
          >
            {(profile.isActivated && profile.displayName) ?? "..."}
            <ReactConfetti className="h-full w-full" />
          </h1>
        </header>
        <NavButton
          direction="left"
          onClick={() => handleMoveClick(-1)}
          disabled={activeIndex === 0}
          ariaLabel="Previous profile"
          className="z-40 absolute bottom-4 left-4"
          classNameIcon="text-gray-200"
        />

        <NavButton
          direction="right"
          onClick={() => handleMoveClick(1)}
          disabled={activeIndex === (profiles?.length ?? 1) - 1}
          ariaLabel="Next profile"
          className="z-40 absolute bottom-4 right-4 border-gray-700"
          classNameIcon="text-gray-200"
        />

        {profile.isActivated && (
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

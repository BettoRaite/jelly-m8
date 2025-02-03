import type { Route } from "./+types/profile.page";
import useProfileQuery from "@/hooks/useProfileQuery";
import { HeartLoader } from "@/components/HeartLoader";
import { useMemo, useState } from "react";
import { joinClasses } from "@/lib/utils/strings";
import { motion, AnimatePresence } from "motion/react"; // Use `framer-motion` directly
import classNames from "classnames";
import type { HTMLProps } from "react";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import CozyBackground from "@/components/Backgrounds/CozyBackground";
import NavButton from "@/ui/NavButton";
import type { Profile } from "@/lib/types";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

type Props = {
  profile: Profile;
};

type AnimationInstance = {
  delay: number;
  scale: number;
  className?: string;
};

const animationConfig: AnimationInstance[] = [
  {
    delay: 0.5,
    scale: 1.5,
  },
  {
    delay: 1.2,
    scale: 1.2,
    className: "absolute left-[20%] top-[20%]",
  },
  {
    delay: 1.5,
    scale: 0.8,
    className: "absolute left-[70%] top-[10%]",
  },
];

function Slide1({ profile }: Props) {
  return (
    <motion.section
      exit={{ opacity: 0, scale: 0.1 }} // Exit animation
      initial={{ opacity: 0 }} // Initial animation
      animate={{ opacity: 1 }} // Animate in
      transition={{ duration: 0.5 }} // Transition duration
      className="flex items-center h-screen w-screen overflow-hidden"
    >
      <div className="flex w-dvw justify-center">
        {animationConfig.map((a, i) => {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: a.scale }}
              transition={{
                duration: 0.8,
                delay: a.delay,
                ease: [0, 0.76, 0.2, 1.01],
              }}
              className={a.className}
            >
              <motion.img
                className={joinClasses(
                  "w-40 rounded-full transition-transform duration-500 cursor-pointer shadow-2xl border-8 border-pink-100",
                  {
                    "border border-yellow-400": i === 0,
                  }
                )}
                src={profile.profileImageUrl}
                alt={profile.displayName}
              />
            </motion.div>
          );
        })}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{
            duration: 0.8,
            delay: 2,
            ease: [0, 0.76, 0.2, 1.01],
          }}
          className="text-6xl text-pink-400 font-bold"
        >
          {profile.displayName}
        </motion.h1>
      </div>
    </motion.section>
  );
}

function Slide2({ profile }: Props) {
  return (
    <motion.section
      animate={{ opacity: [0, 1], scale: [0.9, 1] }} // Exit animation
      transition={{ duration: 0.7 }} // Transition duration
      className="flex justify-center items-center h-screen w-screen overflow-hidden"
    >
      <div className="w-[50%] relative">
        <FaQuoteLeft className="absolute -top-6 -left-10 text-gray-500 text-4xl" />
        <h1
          className={joinClasses(
            "w-[100%] text-gray-500 font-bold text-5xl",
            "bg-gradient-to-tl from-gray-950 via-gray-600 to-gray-400 bg-clip-text text-transparent"
          )}
        >
          Юность тщеславна: в зрачках открыто Читается жажда «Быть знаменитой!»
          Зрелость скептичнее: «Слава крылата. Верней и надежнее жить богато». И
          знает лишь мудрость порой одна, Какая всем этим мечтам цена: Все дело
          в здоровье. Его, друзья, Ни славой, ни златом купить нельзя!
        </h1>
        <FaQuoteRight className="absolute -bottom-6 -right-10 text-gray-500 text-4xl" />
      </div>
    </motion.section>
  );
}

export default function ProfilePage({ params }: Route.LoaderArgs) {
  const { data: profile, status } = useProfileQuery({
    type: "get",
    id: Number.parseInt(params.profileId),
  });
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = useMemo(() => {
    return [
      <Slide1
        key="slide1" // Unique key for AnimatePresence
        profile={profile}
      />,
      <Slide2
        key="slide2" // Unique key for AnimatePresence
        profile={profile}
      />,
    ];
  }, [profile]);

  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return "Опс ошибочка";
  }

  return (
    <main className="flex items-center h-screen w-screen overflow-hidden">
      {/* <AnimatedGradientBackground className="-z-20 bg-white" /> */}
      <GlassyBackground className="-z-20 bg-gray-400" />
      <CozyBackground className="-z-10" />
      <NavButton
        onClick={() => {
          setSlideIndex(slideIndex + 1);
        }}
        direction="right"
        className="right-4 absolute z-10 bottom-4 bg-transparent border border-gray-200"
      />
      {slideIndex !== 0 && (
        <NavButton
          onClick={() => {
            setSlideIndex(slideIndex - 1);
          }}
          direction="left"
          className="left-4 absolute z-10 bottom-4 text-gray-600 bg-pink-400"
        />
      )}
      <AnimatePresence mode="wait">{slides[slideIndex]}</AnimatePresence>
    </main>
  );
}

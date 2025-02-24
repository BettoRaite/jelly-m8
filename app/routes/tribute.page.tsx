import type { Route } from "./+types/tribute.page";
import useProfileQuery from "@/hooks/useProfileQuery";
import { HeartLoader } from "@/components/HeartLoader";
import { useEffect, useMemo, useState } from "react";
import { joinClasses } from "@/lib/utils/strings";
import { motion, AnimatePresence } from "motion/react";
import classNames from "classnames";
import type { HTMLProps } from "react";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import CozyBackground from "@/components/Backgrounds/CozyBackground";
import NavButton from "@/ui/NavButton";
import type { Compliment, Profile } from "@/lib/types";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import ComplimentCard from "@/components/complimentCard/ComplimentCard";
import { GoBack } from "@/components/GoBack";
import TypingTextEffect from "@/components/TypingText";

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
    className: "absolute left-[20%] top-[20%] hidden lg:block",
  },
  {
    delay: 1.5,
    scale: 0.8,
    className: "absolute left-[70%] top-[10%]  hidden lg:block",
  },
];

export default function TributePage({ params }: Route.LoaderArgs) {
  const { data: profile, status } = useProfileQuery({
    type: "profile",
    userId: Number.parseInt(params.userId),
  });
  const { data: compliments, status: complimentLoadStatus } =
    useComplimentQuery(
      {
        type: "profile/compliments",
        profileId: profile?.id as number,
      },
      {
        enabled: Boolean(profile),
      }
    );
  const [slideIndex, setSlideIndex] = useState(0);
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false);
  const slides = useMemo(() => {
    if (!profile) {
      return [];
    }
    return [
      <Slide3
        key="slide3" // Unique key for AnimatePresence
        profile={profile}
      />,
      <Slide1
        key="slide1" // Unique key for AnimatePresence
        profile={profile}
      />,
      <Slide2
        key="slide2" // Unique key for AnimatePresence
        profile={profile}
      />,
      <Slide4 key="slide4" profile={profile} compliments={compliments} />,
      <Slide5 key="slide5" profile={profile} />,
    ];
  }, [profile, compliments]);

  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return "Опс ошибочка";
  }
  const sliderState = {
    showImage: slideIndex > 0 && slideIndex < 3,
  };
  function handleSlideNav(direction: number) {
    const next = slideIndex + direction;
    if (next < slides.length && next > -1) {
      setSlideIndex(next);
    }
  }
  return (
    <main className="overflow-y-scroll">
      <p className="absolute top-4 right-4 text-black text-opacity-20 z-50 text-5xl font-bold">
        {slideIndex + 1}
      </p>
      {sliderState.showImage && (
        <>
          <motion.img
            initial={{
              rotate: -10,
              scale: 0.7,
              y: 100,
              x: -100,
            }}
            animate={
              isInitialAnimationDone
                ? {
                    rotate: [2, 5, 0], // Swaying motion
                    scale: [0.75, 0.76, 0.75], // Subtle scaling
                    y: [5, 30, 10], // Slight vertical movement
                    x: [0, -5, 0], // Slight horizontal movement
                  }
                : {
                    rotate: [-10, 2],
                    scale: [0.7, 0.75],
                    y: [100, 5],
                    x: [-100, 0],
                  }
            }
            transition={
              isInitialAnimationDone
                ? {
                    rotate: {
                      duration: 5, // Duration of one sway cycle
                      repeat: Number.POSITIVE_INFINITY, // Repeat infinitely
                      repeatType: "mirror", // Smooth back-and-forth motion
                      ease: "easeInOut", // Smooth easing
                    },
                    scale: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    x: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }
                : {
                    type: "spring",
                    damping: 10,
                    mass: 0.75,
                    stiffness: 100,
                    duration: 1,
                  }
            }
            onAnimationComplete={() => setIsInitialAnimationDone(true)} // Trigger state change
            src="/flowersleft.png"
            alt="Decorative flowers on the left"
            className="fixed -bottom-26 -left-40"
          />

          {/* Right Flower Image */}
          <motion.img
            initial={{
              rotate: 10,
              scale: 0.7,
              y: 100,
              x: 100,
            }}
            animate={
              isInitialAnimationDone
                ? {
                    rotate: [2, -5, -2], // Swaying motion
                    scale: [0.75, 0.76, 0.75], // Subtle scaling
                    y: [5, 30, 5], // Slight vertical movement
                    x: [0, 5, 0], // Slight horizontal movement
                  }
                : {
                    rotate: [10, 2],
                    scale: [0.7, 0.75],
                    y: [100, 5],
                    x: [100, 0],
                  }
            }
            transition={
              isInitialAnimationDone
                ? {
                    rotate: {
                      duration: 5, // Duration of one sway cycle
                      repeat: Number.POSITIVE_INFINITY, // Repeat infinitely
                      repeatType: "mirror", // Smooth back-and-forth motion
                      ease: "easeInOut", // Smooth easing
                    },
                    scale: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    x: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }
                : {
                    type: "spring",
                    damping: 10,
                    mass: 0.75,
                    stiffness: 100,
                    duration: 1,
                  }
            }
            onAnimationComplete={() => setIsInitialAnimationDone(true)} // Trigger state change
            src="/flowersright.png"
            alt="Decorative flowers on the right"
            className="fixed -bottom-26 -right-40"
          />
        </>
      )}

      <NavButton
        onClick={() => {
          handleSlideNav(1);
        }}
        direction="right"
        className={joinClasses(
          "right-4 fixed z-10 bottom-4 bg-white bg-opacity-20",
          {
            "text-white bg-gray-200": slideIndex === 0,
            "text-slate-700": slideIndex !== 0,
          }
        )}
      />
      <NavButton
        onClick={() => {
          handleSlideNav(-1);
        }}
        direction="left"
        className={joinClasses(
          "left-4 fixed z-10 bottom-4 text-gray-600 bg-pink-200",
          {
            "opacity-0 pointer-events-none": slideIndex === 0,
            "text-slate-700": slideIndex !== 0,
          }
        )}
      />
      <AnimatePresence mode="wait">{slides[slideIndex]}</AnimatePresence>
    </main>
  );
}

function Slide1({ profile }: DefaultProps) {
  return (
    <motion.section
      exit={{ opacity: 0, scale: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
                  "w-28 h-28 md:w-40 md:h-40 rounded-full transition-transform duration-500 cursor-pointer shadow-2xl border-4 lg:border-8 border-pink-100",
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
          animate={{ opacity: [0, 1], scale: 1.5, y: [0, -100] }}
          transition={{
            duration: 0.8,
            delay: 2,
            ease: [0, 0.76, 0.2, 1.01],
          }}
          className="absolute -bottom-10 text-7xl bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-indigo-600 via-indigo-700 to-blue-200 bg-clip-text text-transparent font-bold font-caveat"
        >
          {profile.displayName}.
        </motion.h1>
      </div>
    </motion.section>
  );
}

type DefaultProps = {
  profile: Profile;
};

type ComplimentProps = { profile: Profile; compliments: Compliment[] };

function Slide2({ profile }: DefaultProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="flex justify-center items-center h-screen w-screen"
    >
      <div className="w-[90%] md:w-[50%] relative p-8 bg-white rounded-lg shadow-2xl border border-opacity-10 border-gray-300">
        <FaQuoteLeft className="absolute -top-6 -left-6 text-gray-400 text-3xl md:text-4xl transform rotate-12" />

        {/* Quote text */}
        <motion.h1
          animate={{ y: [50, 0] }}
          className="text-slate-700 font-nunito italic text-lg md:text-[1.7rem] font-bold leading-relaxed text-center"
        >
          {profile.quote}
        </motion.h1>

        <FaQuoteRight className="absolute -bottom-6 -right-6 text-gray-400 text-3xl md:text-4xl transform -rotate-12" />
      </div>
    </motion.section>
  );
}

function Slide3({ profile }: DefaultProps) {
  return (
    <motion.section
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-screen w-screen overflow-hidden bg-black"
    >
      <GoBack />
      <h1
        className={
          "text-8xl bg-clip-text animate-animateBG bg-repeat font-bold text-transparent"
        }
        style={{
          backgroundImage: `url(${profile.profileImageUrl})`,
        }}
      >
        {profile?.displayName}
      </h1>
    </motion.section>
  );
}

function Slide4({ profile, compliments }: ComplimentProps) {
  return (
    <motion.section
      exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1],
      }}
      className="relative mx-auto px-4 pt-20 pb-4 w-full min-h-screen bg-slate-100"
    >
      <div className="max-w-2xl mx-auto flex flex-col relative z-20">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center text-3xl md:text-4xl lg:text-5xl text-slate-700 font-thin mb-16 md:mb-24 font-caveat"
        >
          Посмотри что о{" "}
          <span className="text-pink-400 font-jost font-bold">тебе </span>
          думают другие
        </motion.h1>

        <div className="grid gap-6 md:gap-8">
          {compliments?.map((c) => (
            <ComplimentCard
              key={c.id}
              className="w-full transform transition-transform hover:scale-[1.02]"
              initialCompliment={c}
              isOwner={false}
              variant={c.isAdmin ? "special" : "default"}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Slide5({ profile }: DefaultProps) {
  const text = `
    С Международным женским днем! 🌷 Сегодня мы отмечаем твою силу, красоту
    и вдохновение. Ты — невероятная женщина, и твоя энергия наполняет мир
    светом. Пусть каждый день приносит тебе радость, счастье и новые
    возможности. Желаю, чтобы все твои мечты сбывались, а жизнь была полна
    ярких моментов и любви. Ты заслуживаешь только самого лучшего! С
    праздником!
    `;
  const speed = 60;

  return (
    <motion.section
      exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
      animate={{
        opacity: [0, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      }}
      className="bg-slate-50 text-slate-800  w-full h-screen flex flex-col justify-center items-center"
    >
      <GoBack theme="dark" />
      <h1 className="text-center text-4xl font-caveat mb-4">
        Дорогая,{" "}
        <span className="text-pink-400 font-bold">{profile.displayName}</span>
      </h1>
      <TypingTextEffect
        text={text}
        className="font-caveat md:text-xl w-[50%] max-w-[500px]"
        typingSpeed={60}
      />
    </motion.section>
  );
}

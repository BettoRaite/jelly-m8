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
    showImage: slideIndex === 1,
  };
  function handleSlideNav(direction: number) {
    const next = slideIndex + direction;
    if (next < slides.length && next > -1) {
      setSlideIndex(next);
      setIsInitialAnimationDone(false);
    }
  }
  return (
    <main className="overflow-y-scroll overflow-hidden">
      <p className="absolute top-4 right-4 text-black text-opacity-20 z-50 text-5xl font-bold">
        {slideIndex + 1}
      </p>
      <div className={sliderState.showImage ? "" : "hidden"}>
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
                  rotate: [2, 5], // Swaying motion
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
                    duration: 2, // Duration of one sway cycle
                    repeat: Number.POSITIVE_INFINITY, // Repeat infinitely
                    repeatType: "mirror", // Smooth back-and-forth motion
                    ease: "easeInOut", // Smooth easing
                  },
                  scale: {
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  x: {
                    duration: 5,
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
                }
          }
          onAnimationComplete={() => setIsInitialAnimationDone(true)} // Trigger state change
          src="/flowersleft.png"
          alt="Decorative flowers on the left"
          className="fixed -bottom-12 lg:-bottom-32 -left-24 sm:-bottom-20 sm:-left-28 md:-left-36 sm: scale-150"
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
                  rotate: [-2, -5],
                  scale: [0.75, 0.76, 0.75], // Subtle scaling
                  y: [5, 30, 5], // Slight vertical movement
                  x: [0, 10, 0], // Slight horizontal movement
                }
              : {
                  rotate: [10, -2],
                  scale: [0.7, 0.75],
                  y: [100, 5],
                  x: [100, 0],
                }
          }
          transition={
            isInitialAnimationDone
              ? {
                  rotate: {
                    duration: 2, // Duration of one sway cycle
                    repeat: Number.POSITIVE_INFINITY, // Repeat infinitely
                    repeatType: "mirror", // Smooth back-and-forth motion
                    ease: "easeInOut", // Smooth easing
                  },
                  scale: {
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  x: {
                    duration: 5,
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
          className="fixed -bottom-16 -right-32 sm:-right-44 sm:-bottom-48 lg:-bottom-26 lg:-right-40"
        />
      </div>

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
      {/* Enhanced background with overlay */}

      <div
        className={`absolute inset-0 -z-30  ${
          sliderState.showImage && "hidden"
        }`}
      >
        <img
          src="/tokyonight.jpg"
          alt="Decorative background"
          className="object-cover w-full h-full blur-[2px] opacity-90"
        />
        <GlassyBackground intensity="none" className="blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-950/80" />
      </div>
    </main>
  );
}

type AnimationInstance = {
  delay: number;
  scale: number;
  className?: string;
};
// Second slide with flowers/name
function Slide1({ profile }: DefaultProps) {
  const animationConfig: AnimationInstance[] = [
    {
      delay: 0.5 + 0.4,
      scale: 1.5,
      className: "z-20 shadow-2xl rounded-full shadow-pink-400", // Added z-index for main image
    },
    {
      delay: 1.2 + 0.4,
      scale: 1.2,
      className:
        "absolute left-[15%] top-[15%] hidden lg:block filter drop-shadow-2xl",
    },
    {
      delay: 1.5 + 0.4,
      scale: 0.8,
      className:
        "absolute right-[17%] top-[15%] hidden lg:block filter drop-shadow-2xl",
    },
  ];

  return (
    <motion.section
      exit={{ opacity: 0, scale: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex flex-col items-center justify-center h-screen w-screen overflow-y-scroll"
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <div className="relative w-full max-w-4xl flex justify-center">
          {animationConfig.map((a, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: 0,
                filter: "blur(1px)",
              }}
              animate={{
                opacity: 1,
                scale: a.scale,
                rotate: i === 0 ? 0 : i % 2 === 0 ? 10 : -10,
                filter: "blur(0px)",
                y: [300, 0],
              }}
              transition={{
                duration: 0.8,
                delay: a.delay,
                ease: [0, 0.76, 0.2, 1.01],
              }}
              className={a.className}
            >
              <motion.img
                className={joinClasses(
                  "w-32 h-32 md:w-48 md:h-48 rounded-full",
                  "border-4 transition-transform duration-500 cursor-pointer object-cover",
                  "shadow-lg hover:shadow-2xl hover:scale-105",
                  i === 0 ? "border-amber-400" : ""
                )}
                src={profile.profileImageUrl}
                alt={profile.displayName}
                whileHover={{ scale: 1.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Enhanced name animation */}
        <motion.h1
          animate={{
            scale: [0, 1],
            y: [200, 0],
          }}
          transition={{
            duration: 0.5,
            delay: 2.2,
            type: "spring",
            mass: 0.75,
            damping: 7,
          }}
          className="text-8xl md:text-9xl font-bold text-center font-caveat absolute z-30 bottom-[15%]"
        >
          <span className="pr-2 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-amber-200 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
            {profile.displayName}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="ml-2 text-4xl md:text-6xl text-cyan-300"
          >
            ✨
          </motion.span>
        </motion.h1>
      </div>
    </motion.section>
  );
}
type DefaultProps = {
  profile: Profile;
};

type ComplimentProps = { profile: Profile; compliments: Compliment[] };

// Quote slide
function Slide2({ profile }: DefaultProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="flex justify-center items-center h-screen w-screen overflow-hidden bg-gray-100"
    >
      <CozyBackground />
      <motion.div
        animate={{
          scale: [0, 1],
        }}
        transition={{
          mass: 0.75,
          type: "spring",
          damping: 7,
          duration: 0.1,
        }}
        className="w-[90%] md:w-[50%] relative p-8 bg-white rounded-lg shadow-2xl border border-opacity-10 border-gray-300"
      >
        <FaQuoteLeft className="absolute -top-6 -left-6 text-gray-400 text-3xl md:text-4xl transform rotate-12" />

        {/* Quote text */}
        <motion.h1 className="max-h-96 overflow-y-scroll text-slate-700 font-nunito italic text-lg md:text-[1.4rem] font-bold leading-relaxed text-center">
          {profile.quote}
        </motion.h1>

        <FaQuoteRight className="absolute -bottom-6 -right-6 text-gray-400 text-3xl md:text-4xl transform -rotate-12" />
      </motion.div>
    </motion.section>
  );
}

// First slide with name
function Slide3({ profile }: DefaultProps) {
  return (
    <motion.section
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      className="relative flex items-center justify-center h-screen w-screen overflow-hidden bg-black"
    >
      <GoBack className="absolute top-6 left-6 z-20 text-white/80 hover:text-white transition-colors" />

      <motion.h1
        className="relative z-10 text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter text-center px-4"
        animate={{
          y: 0,
          opacity: [0, 1],
          transition: { delay: 0.3, duration: 1.0 },
        }}
      >
        <span className="font-amatic bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">
          {profile?.displayName}
        </span>
      </motion.h1>

      {/* Animated particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(12)].map((_, i) => {
          const sign = Math.random() > 0.5;
          const f = sign ? -1 : 1;
          return (
            <motion.div
              animate={{
                y: [f * 100 * Math.random(), 0],
                x: [f * 100 * Math.random(), 0],
              }}
              transition={{
                y: {
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
                x: {
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
              }}
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          );
        })}
      </motion.div>
    </motion.section>
  );
}

// Compliments slide
function Slide4({ profile, compliments }: ComplimentProps) {
  return (
    <motion.section
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      className="relative mx-auto px-4 md:px-8 pt-20 pb-4 w-full min-h-screen bg-gradient-to-br from-pink-50/20 to-blue-50/20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto flex flex-col relative z-20">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.2 },
          }}
          className="text-center text-3xl md:text-4xl lg:text-5xl text-slate-800/90 font-medium mb-12 md:mb-20 font-caveat drop-shadow-md"
        >
          Посмотри, что о{" "}
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent font-jost font-bold tracking-tight"
          >
            {profile.occupation === "teacher" ? "вас" : "тебе"}
          </motion.span>{" "}
          <motion.span
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-block"
          >
            думают другие
          </motion.span>
        </motion.h1>

        <motion.div
          className="grid gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
          }}
        >
          {compliments?.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <ComplimentCard
                className="w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                initialCompliment={c}
                isOwner={false}
                variant={c.isAdmin ? "special" : "default"}
              />
            </motion.div>
          ))}
        </motion.div>
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

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

  return (
    <main className="overflow-y-scroll">
      <CozyBackground className="-z-10" />
      <NavButton
        onClick={() => {
          setSlideIndex(slideIndex + 1);
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
          setSlideIndex(slideIndex - 1);
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

function Slide1({ profile }: Props) {
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{
            duration: 0.8,
            delay: 2,
            ease: [0, 0.76, 0.2, 1.01],
          }}
          className="text-5xl text-pink-400 font-bold font-caveat"
        >
          {profile.displayName}
        </motion.h1>
      </div>
    </motion.section>
  );
}

function Slide2() {
  return (
    <motion.section
      exit={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: [0, 1], scale: [0, 1] }} // Exit animation
      className="flex justify-center items-center h-screen w-screen overflow-y-scroll bg-slate-50"
    >
      <div className="w-[50%] relative">
        <FaQuoteLeft className="absolute -top-6 -left-10 text-gray-500 text-2xl" />
        <h1
          className={joinClasses(
            "w-[100%] text-slate-500 font-bold text-sm md:text-2xl"
          )}
        >
          Юность тщеславна: в зрачках открыто Читается жажда «Быть знаменитой!»
          Зрелость скептичнее: «Слава крылата. Верней и надежнее жить богато». И
          знает лишь мудрость порой одна, Какая всем этим мечтам цена: Все дело
          в здоровье. Его, друзья, Ни славой, ни златом купить нельзя!
        </h1>
        <FaQuoteRight className="absolute -bottom-6 -right-10 text-gray-500 text-2xl" />
      </div>
    </motion.section>
  );
}
function Slide3({ profile }: Props) {
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

function Slide4({ profile, compliments }: Props) {
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

function Slide5({ profile }: { profile: Profile; compliments: Compliment[] }) {
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

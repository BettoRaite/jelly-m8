import { AppScene } from "@/components/AppScene";
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
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Selection,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { BlendFunction } from "postprocessing";
import { useState } from "react";
import ReactConfetti from "react-confetti";
import { FaSearch } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { GoNorthStar } from "react-icons/go";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router";
import { Vector3 } from "three";

const CAM_MOVE_DIST = 1.2;

export default function Cards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);
  const [enableEffects, setEnableEffects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
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
      className={
        "overflow-hidden bg-transparent relative bg-gradient-to-bl from-pink-500 via-[#1e1a78] to-black "
      }
      style={{ width: "100dvw", height: "100dvh" }}
    >
      {/* <AnimatedGradientBackground /> */}
      {profile && !profile.isActivated && (
        <ProfileActivationOverlay
          profile={profile}
          onRefetchProfile={refetch}
        />
      )}
      <GoBack to="/" className="opacity-20 hover:opacity-80" />
      {!enableEffects && <ParticlesWrapper key="particles" />}

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
            styles={{
              text: "placeholder:text-slate-200",
            }}
          />
        )}
      </div>

      {/* Card scene */}
      {profile?.isActivated && (
        <AppScene>
          <SmoothCamera targetPos={new Vector3(0, 0, 1)} />
          {enableEffects && (
            <EffectComposer depthBuffer={true} multisampling={0}>
              <SMAA />
              <Bloom
                luminanceSmoothing={0.05}
                intensity={0.8}
                blendFunction={BlendFunction.SCREEN}
              />
              <ChromaticAberration
                offset={[0.001, 0.002]}
                radialModulation={true}
                modulationOffset={0.15}
                layers={[0]}
              />
              <Vignette
                offset={0.3}
                darkness={0.01}
                eskil={false}
                blendFunction={BlendFunction.MULTIPLY}
              />
            </EffectComposer>
          )}
          <Selection enabled>
            <GlowingCard
              showSpecialEffects={enableEffects}
              key={profile.id}
              profile={profile}
            />
          </Selection>
        </AppScene>
      )}
      {/* Menu */}
      <div className="w-[30%] sm:w-[35%] h-full flex items-start justify-center flex-col absolute right-0 top-0 ">
        <div className="relative">
          <AnimatePresence>
            {isPopoverVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="font-jost bg-white bg-opacity-20 backdrop-blur-md h-70 overflow-y-auto w-56 md:w-64 lg:w-72 absolute right-[110%] bottom-[70%] sm:right-[120%] sm:bottom-[80%] md:right-[130%] md:bottom-[90%] rounded-xl shadow-lg border border-white border-opacity-20 overflow-hidden"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4"
                >
                  <p className="text-white text-base sm:text-lg">
                    Имя:{" "}
                    <span className="font-bold">{profile?.displayName}</span>
                  </p>
                  <p className="text-white mt-2 text-sm sm:text-base">
                    Статус:{" "}
                    <span className="text-green-500 font-bold">
                      {profile?.isActivated
                        ? "Профиль Активирован"
                        : "Не активирован"}
                    </span>
                  </p>
                  <center>
                    <Link
                      to={`tribute/${profile?.userId}`}
                      className="font-bold font-caveat mt-4 inline-block px-4 py-2 bg-white bg-opacity-30 text-white rounded-lg hover:bg-opacity-50 transition-all duration-300 text-sm sm:text-base"
                    >
                      открыть секрет
                    </Link>
                  </center>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center  gap-4 items-center">
            <Button
              onClick={() => setIsPopoverVisible(!isPopoverVisible)}
              roundedness="rounded-full"
              className="opacity-30 hover:opacity-100 scale-[60%] hover:scale-100 text-white text-opacity-30 hover:text-opacity-100"
            >
              <FiInfo className="md:my-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* The top line */}
      {profile?.isActivated && (
        <div className="absolute w-full top-10 flex items-center justify-center">
          <span className="opacity-40 h-[1px] sm:w-52  border-b-[1px] border-dotted" />
        </div>
      )}
      {/* Profile name */}
      {profile?.isActivated && (
        <div className="absolute w-full top-16 sm:top-auto sm:bottom-14 flex items-center justify-center">
          <div className="relative">
            <p
              className={joinClasses(
                "relative",
                "hover:scale-125 cursor-pointer bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-indigo-500 via-fuchsia-100 to-violet-100 bg-clip-text text-transparent",
                "active:text-pink-600 transition-all duration-300 first-letter:uppercase",
                "lg:text-6xl sm:text-3xl text-2xl font-bold p-4 rounded-lg font-jost italic"
              )}
            >
              <ReactConfetti className="w-full h-full" />
              {(profile?.isActivated && profile.displayName) ??
                "Тут пустенько..."}
            </p>
            <p
              className={joinClasses(
                "text-yellow-400 absolute scale-75 lg:scale-100 -right-2 top-0 sm:top-1 lg:-right-2 lg:top-4 z-10 text-2xl p-2 rounded-full bg-white bg-opacity-5",
                "transition-all duration-500 hover:opacity-100",
                "hover:text-pink-500",
                {
                  "opacity-10 pointer-events-none": !profile?.isActivated,
                }
              )}
            >
              🤓
            </p>
          </div>
        </div>
      )}

      {/* Slide navigation menu */}
      <div className="flex justify-center items-center w-screen absolute z-20 bottom-0 left-0 gap-4">
        <NavButton
          direction="left"
          onClick={() => handleMoveClick(-1)}
          disabled={activeIndex === 0}
          ariaLabel="Previous profile"
          className={joinClasses(
            "z-40 border-none cursor-pointer hover:text-gray-100 text-white text-opacity-30",
            {
              "opacity-15 pointer-events-none": activeIndex === 0,
            }
          )}
          classNameIcon="duration-300"
        />
        <motion.span
          key={activeIndex}
          animate={{
            scale: [0, 1],
            opacity: [0, 1, 0.1],
            width: [50, 80],
          }}
          className="bg-white h-[2px] rounded-lg w-20"
        />
        <NavButton
          direction="right"
          onClick={() => handleMoveClick(1)}
          disabled={activeIndex === (profiles?.length ?? 1) - 1}
          ariaLabel="Next profile"
          className={joinClasses(
            "z-40 border-none cursor-pointer hover:text-gray-100 text-white text-opacity-30",
            {
              "opacity-15 pointer-events-none":
                activeIndex === (profiles?.length ?? 1) - 1,
            }
          )}
          classNameIcon="duration-300"
        />
      </div>

      {/* Enable post-proccessing */}
      <Button
        roundedness="rounded-full"
        className="bg-opacity-0 border-0 absolute bottom-2 right-2 z-20 text-3xl
        opacity-30 hover:opacity-100 hover:text-yellow-300  transition-all duration-300 "
        onClick={() => setEnableEffects(!enableEffects)}
      >
        <GoNorthStar />
      </Button>

      {/* Profiles counter */}
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

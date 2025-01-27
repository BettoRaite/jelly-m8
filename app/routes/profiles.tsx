import type { Route } from "./+types/home";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Link } from "react-router";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { SmoothCamera } from "@/components/SmoothCamera";
import type { CameraPos, Axis } from "lib/types";
import { FaChevronLeft, FaChevronRight, FaLock } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/lib/config";
import { AppScene } from "@/components/AppScene";
import { GoBack } from "@/components/GoBack";
import { Loader } from "@/components/Loader";
import { GoArrowDown } from "react-icons/go";
import { CardModel } from "@/components/models/CardModel";
import { ParticlesWrapper } from "@/components/ParticlesWrapper";
export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type Profile = {
  name: string;
  bio: string;
  isActivated: boolean;
  id: number;
};

type ApiProfileGetResponse = {
  data: Profile[];
};

const CAM_MOVE_DIST = 1.2;

export default function Home() {
  const {
    data: profilesGetResponse,
    status,
    error,
  } = useQuery<ApiProfileGetResponse>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const response = await fetch(`${config.server.url}/profiles`);
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      return response.json();
    },
  });

  const [cameraPos, setCameraPos] = useState<CameraPos>({ x: 0, y: 0, z: 1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const profileSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = profileSectionRef.current;
    if (section) {
      const handleScroll = () => {
        if (section.scrollTop < 0) {
          window.scrollTo(0, 0);
        }
      };
      section.addEventListener("scroll", handleScroll);
      return () => section.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (status === "pending") return <Loader />;
  if (status === "error") return <div>Error: {error?.message}</div>;

  const items = profilesGetResponse?.data ?? [];

  if (items.length === 0) {
    return "No profiles";
  }
  const profile = items[activeIndex] ?? {};

  const handleMoveClick = (newCameraPos: Partial<CameraPos>, index: number) => {
    const nextIndex = activeIndex + index;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const nextCameraPos: CameraPos = {
      ...cameraPos,
    };
    for (const axis of Object.keys(newCameraPos)) {
      nextCameraPos[axis] += newCameraPos[axis];
    }

    setCameraPos(nextCameraPos);
    setActiveIndex(nextIndex);
  };
  const handleScrollDown = () => {
    const section = profileSectionRef.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolled(true);
    }
  };

  return (
    <div
      className={`${
        hasScrolled ? "overflow-y-scroll" : "overflow-hidden"
      } bg-transparent relative`}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <GoBack to="/" />
      <AppScene
        cameraPosition={new Vector3(cameraPos.x, cameraPos.y, cameraPos.z)}
      >
        {items.map((p, i) => (
          <CardModel key={p.id} position={[CAM_MOVE_DIST * i, 0, 0]} />
        ))}
      </AppScene>

      <ParticlesWrapper />

      <div className="rounded-full bg-pink-100 blur-lg animate-pulse opacity-5 -z-10 absolute top-[10%] left-[25%] h-[80%] w-[40%]" />
      <div className="absolute bg-black w-dvw h-dvh -z-20 left-0 top-0" />

      {!hasScrolled && (
        <div>
          <h1 className="flex  absolute top-[40%] left-40 first-letter:uppercase pb-8 font-bold text-6xl bg-gradient-to-r from-green-900 via-rose-600 to-neutral-600 bg-clip-text text-transparent p-4 rounded-lg">
            {profile.name ?? "None"}
            <div className="rounded-full bg-pink-100 blur-lg animate-pulse opacity-5 -z-10 w-32 h-32" />
          </h1>

          <button
            onClick={handleScrollDown}
            type="button"
            className="absolute bottom-8 left-4 bg-gray-200 rounded-lg p-4 shadow-lg"
            aria-label="Scroll down"
          >
            <FaLock className="text-2xl text-gray-600" />
          </button>
        </div>
      )}

      <button
        onClick={() => handleMoveClick({ x: CAM_MOVE_DIST }, 1)}
        className="z-10 absolute top-[50%] right-0 p-10"
        type="button"
        aria-label="Next profile"
      >
        <FaChevronRight />
      </button>
      <button
        onClick={() => handleMoveClick({ x: -CAM_MOVE_DIST }, -1)}
        className="z-10 absolute top-[50%] left-0 p-10"
        type="button"
        aria-label="Previous profile"
      >
        <FaChevronLeft />
      </button>

      <section id="target-section" className="w-full h-dvh">
        Additional content here
      </section>
    </div>
  );
}

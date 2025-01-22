import type { Route } from "./+types/home";
import { useRef, useState, useEffect, type Ref } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Statue } from "@/components/Statue";
import { PerspectiveCamera } from "@react-three/drei";
import { Link } from "react-router";
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import type { RefObject } from "react";
import { Vector3 } from "three";
import { SmoothCamera } from "@/components/SmoothCamera";
import type { CameraPos, Axis } from "lib/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { div } from "three/tsl";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/lib/config";
import { Card } from "@/components/Card";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
type Person = {
  id: number;
  name: string;
  description: string;
};

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
    isPending,
    error,
    data: profilesGetResponse,
    isSuccess,
    isLoading,
  } = useQuery<ApiProfileGetResponse>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const response = await fetch(`${config.server.url}/profiles`);
      return await response.json();
    },
  });

  const items = profilesGetResponse?.data ?? [];
  console.log(profilesGetResponse?.data);
  const [cameraPos, setCameraPos] = useState<CameraPos>({
    x: 0,
    y: 0,
    z: 1,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const profileSectionRef = useRef<null | HTMLElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  function handleMoveClick(newCameraPos: Partial<CameraPos>, index: number) {
    const nextIndex = activeIndex + index;
    if (nextIndex < 0 || nextIndex > items.length - 1) {
      return;
    }
    const nextCameraPos: CameraPos = {
      ...cameraPos,
    };
    const axis = Object.keys(newCameraPos) as Axis[];
    for (const k of axis) {
      nextCameraPos[k] += newCameraPos[k] as number;
    }
    setCameraPos(nextCameraPos);
    setActiveIndex(nextIndex);
  }
  function handleScrollDown() {
    const section = profileSectionRef.current;
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start", // Aligns the top of the section with the top of the viewport
        inline: "nearest", // Aligns the section horizontally if needed
      });
      setHasScrolled(true);
    }
  }
  if (isLoading) {
    return "...loading";
  }
  const profile: Profile | Record<string, undefined> =
    items?.find((p, i) => i === activeIndex) ?? {};

  return (
    <div
      className={hasScrolled ? "overflow-y-scroll" : "overflow-hidden"}
      style={{ width: "100dvw", height: "100dvh" }}
    >
      <Canvas camera={{}} shadows>
        <SmoothCamera targetPos={cameraPos} />
        <ambientLight intensity={0.7} />
        {/* <spotLight
          intensity={0.5}
          angle={0.3}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        /> */}
        <Environment preset="city" />
        {/* <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.25}
          scale={10}
          blur={1.5}
          far={0.8}
        /> */}
        {items.map((p, i) => {
          const pos = [CAM_MOVE_DIST * i, -0.3, 0];
          return (
            <group key={p.id} position={pos}>
              <Statue />
            </group>
          );
        })}
      </Canvas>

      {!hasScrolled &&
        items.map((p, i) => {
          if (i !== activeIndex) {
            return;
          }
          return (
            <div key={p.id} className="flex justify-center">
              <h1 className="absolute top-[10%] w-full text-center pb-8 font-bold text-3xl text-white p-4 rounded-lg shadow-lg">
                {profile.name ?? "None"}
              </h1>
              <button
                onClick={handleScrollDown}
                type="button"
                className="absolute bottom-8"
              >
                Посмотреть
              </button>
            </div>
          );
        })}

      <button
        onClick={() =>
          handleMoveClick(
            {
              x: CAM_MOVE_DIST,
            },
            1
          )
        }
        className="z-10 absolute top-[50%] right-0 p-10"
        type="button"
      >
        <FaChevronRight />
      </button>
      <button
        onClick={() =>
          handleMoveClick(
            {
              x: -CAM_MOVE_DIST,
            },
            -1
          )
        }
        className="z-10 absolute top-[50%] left-0 p-10"
        type="button"
      >
        <FaChevronLeft />
      </button>
      <section
        ref={profileSectionRef}
        id="target-section"
        className="w-full h-dvh"
      >
        <Card>{profile.bio}</Card>
      </section>
      <section id="target-section" className="w-full h-dvh">
        sd
      </section>
    </div>
  );
}

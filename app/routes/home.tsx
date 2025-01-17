import type { Route } from "./+types/home";
import { useRef, useState, useEffect, type Ref } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Statue } from "~/components/Statue";
import { PerspectiveCamera } from "@react-three/drei";
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import type { RefObject } from "react";
import { Vector3 } from "three";
import { SmoothCamera } from "~/components/SmoothCamera";
import type { CameraPos, Axis } from "lib/types";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [cameraPos, setCameraPos] = useState<CameraPos>({
    x: 0,
    y: 0,
    z: 1,
  });

  function handleClick(newCameraPos: Partial<CameraPos>) {
    const nextCameraPos: CameraPos = {
      ...cameraPos,
    };
    const axis = Object.keys(newCameraPos) as Axis[];
    for (const k of axis) {
      nextCameraPos[k] += newCameraPos[k] as number;
    }
    setCameraPos(nextCameraPos);
  }

  return (
    <div
      className="min-h-dvh relative"
      style={{ width: "100vw", height: "100vh" }}
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
        <group position={[0, -0.3, 0]}>
          <Statue />
        </group>
      </Canvas>
      <button
        onClick={() =>
          handleClick({
            x: 0.5,
          })
        }
        className="z-10 absolute top-[50%] right-0 mr-10"
        type="button"
      >
        move right
      </button>
      <button
        onClick={() =>
          handleClick({
            x: -0.5,
          })
        }
        className="z-10 absolute top-[50%] left-0 mr-10"
        type="button"
      >
        move left
      </button>
    </div>
  );
}

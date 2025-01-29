import { SmoothCamera } from "@/components/SmoothCamera";
import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import type { Vector3 } from "three";
import * as THREE from "three";
import { GlowingCard } from "./models/GlowingCard";
import { OrbitControls } from "@react-three/drei";
import { ContactShadows } from "@react-three/drei";

type Props = {
  children: ReactNode;
  cameraPosition: Vector3;
};

export function AppScene({ children, cameraPosition }: Props) {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const bloomRef = useRef<typeof Bloom | null>(null);
  return (
    <Canvas
      camera={{}}
      shadows
      onCreated={({ gl, scene }) => {
        gl.setPixelRatio(2);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        setScene(scene);
      }}
    >
      <SmoothCamera targetPos={cameraPosition} />
      {/* <ambientLight intensity={1} /> */}
      {/* <pointLight
        color="#FFB6C1" // Set the light color to pink
        intensity={4} // Adjust the intensity of the light
        position={[0, 0, 0]} // Position the light behind the statue
      /> */}
      {/* <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.25}
        scale={10}
        blur={1.5}
        far={0.8}
      /> */}
      {children}
    </Canvas>
  );
}

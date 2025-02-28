import { Canvas } from "@react-three/fiber";
import { type ReactNode } from "react";
import * as THREE from "three";

type Props = {
  children: ReactNode;
  className?: string;
};

export function AppScene({ children, className }: Props) {
  return (
    <Canvas
      className={className}
      shadows
      onCreated={({ gl }) => {
        gl.setPixelRatio(2);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      {children}
    </Canvas>
  );
}

import { SmoothCamera } from "@/components/SmoothCamera";
import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { Vector3 } from "three";
import { Environment, OrbitControls } from "@react-three/drei";

type Props = {
  children: ReactNode;
  cameraPosition: Vector3;
};

export function AppScene({ children, cameraPosition }: Props) {
  return (
    <Canvas camera={{}} shadows>
      <SmoothCamera targetPos={cameraPosition} />
      <ambientLight intensity={0.7} />
      {/* <spotLight
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      /> */}

      {/* <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.25}
        scale={10}
        blur={1.5}
        far={0.8}
      /> */}
      <Environment preset="city" />
      {children}
    </Canvas>
  );
}

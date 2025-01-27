import { SmoothCamera } from "@/components/SmoothCamera";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import type { Vector3 } from "three";

type Props = {
  children: ReactNode;
  cameraPosition: Vector3;
};

export function AppScene({ children, cameraPosition }: Props) {
  console.log(cameraPosition);
  return (
    <Canvas camera={{}} shadows>
      <SmoothCamera targetPos={cameraPosition} />
      <ambientLight intensity={1} />
      <pointLight
        color="white" // Set the light color to pink
        intensity={0.3} // Adjust the intensity of the light
        position={[0, 0, 0.5]} // Position the light behind the statue
      />
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

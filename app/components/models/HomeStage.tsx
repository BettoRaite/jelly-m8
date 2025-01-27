import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { GroupProps } from "@react-three/fiber";

export function HomeStage(props: GroupProps = {}) {
  const { scene } = useGLTF("./public/stage.glb"); // Adjusted path
  const groupRef = useRef<Group | null>(null);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
    </group>
  );
  // Use groupRef and render the scene
}

useGLTF.preload("./public/stage.glb"); // Adjusted path

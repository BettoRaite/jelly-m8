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
import type { CameraPos } from "lib/types";
type Props = {
  targetPos: CameraPos;
};
export function SmoothCamera({ targetPos }: Props) {
  const cameraRef = useRef(null);
  const currentPosition = useRef(new Vector3());

  useFrame(() => {
    if (cameraRef.current) {
      // Interpolate the camera position
      currentPosition.current.lerp(targetPos, 0.1); // Adjust the factor for speed
      cameraRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={currentPosition.current.toArray()}
      fov={45}
    />
  );
}

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { CameraPos } from "lib/types";
import { useRef } from "react";
import { Vector3 } from "three";

type Props = {
  targetPos: CameraPos;
};
export function SmoothCamera({ targetPos }: Props) {
  const cameraRef = useRef(null);
  const currentPosition = useRef<Vector3>(new Vector3());

  useFrame(() => {
    if (cameraRef.current) {
      // Interpolate the camera position
      currentPosition.current.lerp(targetPos, 0.08); // Adjust the factor for speed
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

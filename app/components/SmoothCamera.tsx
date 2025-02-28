import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { CameraPos } from "lib/types";
import { useRef } from "react";
import { PerspectiveCamera as Cam, Vector3 } from "three";
type Props = {
  targetPos: CameraPos;
};
export function SmoothCamera({ targetPos }: Props) {
  const cameraRef = useRef<Cam | null>(null);
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
      near={0.1}
      far={1000}
    />
  );
}

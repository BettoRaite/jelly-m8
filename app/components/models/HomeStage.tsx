import React, { useEffect, useRef } from "react";
import { useFBX, useGLTF, Clone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { GroupProps } from "@react-three/fiber";
import useProfileQuery from "@/hooks/useProfileQuery";
import * as THREE from "three";

const ColorReplaceMaterial = {
  uniforms: {
    tDiffuse: { value: null },
    uThreshold: { value: 0.3 },
    uReplacementColor: { value: new THREE.Color(0x00ff00) }, // Green replacement
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uThreshold;
    uniform vec3 uReplacementColor;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));

      if(luminance < uThreshold) {
        gl_FragColor = vec4(uReplacementColor, texel.a);
      } else {
        gl_FragColor = texel;
      }
    }
  `,
};

const url = "http://localhost:5173/";
export function HomeStage(props: GroupProps = {}) {
  const { data: profiles } = useProfileQuery({
    type: "profiles",
  });
  const { scene: stage } = useGLTF(`${url}/public/stage.glb`);
  const { scene: statue } = useGLTF(`${url}/public/statue.glb`);
  const model = useFBX(`${url}/public/Clapping.fbx`);
  const groupRef = useRef<Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (model) {
      mixerRef.current = new THREE.AnimationMixer(model);
      const clip = model.animations[0];
      const action = mixerRef.current.clipAction(clip);
      action.play();
    }
  }, [model]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  return (
    <group ref={groupRef}>
      <primitive object={stage} scale={1} />
      <primitive object={model} scale={0.02} position={[0, 0.4, -1.4]} />
      <primitive
        object={model.clone(true)}
        scale={0.02}
        position={[0.1, 1.0, -1.4]}
      />
    </group>
  );
}

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { GroupProps } from "@react-three/fiber";
export function Statue(props: GroupProps = {}) {
  const { nodes, materials } = useGLTF("./public/statue.glb");
  const groupRef = useRef<Group | null>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Adjust the speed of rotation here
    }
  });

  return (
    <group {...props} dispose={null}>
      <group ref={groupRef} scale={0.01} rotation={[0, Math.PI / 4, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Esfera_ToeNails3_0.geometry}
          material={materials["ToeNails.3"]}
          position={[2.554, 37.543, -1.76]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_ToeNails1_0_1.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_ToeNails1_0_2.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_adult_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_young_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_2_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_2_ToeNails1_0_1.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_2_ToeNails1_0_2.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_adult_2_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_young_2_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_3_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_3_ToeNails1_0_1.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.branches_3_ToeNails1_0_2.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_adult_3_ToeNails1_0.geometry}
          material={materials["ToeNails.1"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaf_young_3_ToeNails2_0.geometry}
          material={materials["ToeNails.2"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.lPinkyToe2_1_ToeNails2_0.geometry}
          material={materials["ToeNails.2"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("./public/statue.glb");

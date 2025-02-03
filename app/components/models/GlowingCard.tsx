import { loadTexturesAsync } from "@/lib/helpers/loadTextures";
import {
  fragPlane,
  fragPlaneback,
  vert,
} from "@/lib/shaders/glowingCard.shader";
import type { Profile } from "@/lib/types";
import { a, useSpring } from "@react-spring/three";
import {
  useFrame,
  useThree,
  type GroupProps,
  type Vector3,
} from "@react-three/fiber";
import type { BloomEffect } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import * as THREE from "three";
import { createMaterial } from "@/lib/helpers/createMaterial";
import { Texture } from "@react-three/drei";
// Configuration
const CONFIG = {
  exposure: 2.8,
  bloomStrength: 1,
  bloomThreshold: 0,
  bloomRadius: 1.29,
  color0: [197, 81, 245],
  color1: [65, 0, 170],
  color2: [0, 150, 255],
  isanimate: false,
  textures: {
    u_card_template: "./public/cardtemplate.png",
    cardTemplate: "./public/cardtemplate.png",
    u_card_template_back:
      "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplateback4.png",
    u_skull_render: "./public/heart.png",
    backPattern: "./public/heart.png",
    u_noise: "https://raw.githubusercontent.com/pizza3/asset/master/noise2.png",
    u_color:
      "https://images.unsplash.com/photo-1589307004173-3c95204d00ee?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBhdHRlcm58ZW58MHx8MHx8fDI%3D",
    u_back_texture:
      "https://raw.githubusercontent.com/pizza3/asset/master/color3.jpg",
  },
  dimensions: {
    width: 1301,
    height: 0,
  },
};

// Main Scene Component
type Props = {
  cardProps: GroupProps;
  profile: Profile;
};
export function GlowingCard({ cardProps, profile }: Props) {
  const { gl } = useThree();
  const [textures, setTextures] = useState<Record<
    keyof typeof CONFIG.textures,
    THREE.Texture
  > | null>(null);
  const cardRef = useRef<Group | null>(null);
  const [cardState, setCardState] = useState({
    hovered: false,
    flipped: false,
    isAnimating: true,
  });
  const { hovered, flipped, isAnimating } = cardState;
  const { rotationY, scale } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    scale: hovered ? 1.1 : 1,
    config: { mass: isAnimating ? 30 : 2, tension: 300, friction: 20 },
  });

  const materials = useMemo(() => {
    if (!textures) return null;
    const backTextures = {
      ...textures,
      u_card_template: textures.u_card_template_back,
    };
    return {
      front: createMaterial(fragPlane, vert, textures),
      back: createMaterial(fragPlaneback, vert, backTextures),
    };
  }, [textures]);

  const [rotationSpring, rotationApi] = useSpring(() => ({
    rotation: [0, 0, 0], // Initial rotation
    config: { mass: 10, tension: 300, friction: 20 }, // Animation config
    onRest: () => {
      setCardState({
        ...cardState,
        isAnimating: false,
      });
    },
  }));

  const [positionSpring, positionApi] = useSpring(() => ({
    position: [0, 20, -40], // Initial position (above the final position)
    config: { mass: 1, tension: 200, friction: 20 }, // Animation config
  }));

  // Starting card animation only after the card materials has loaded(front and back)
  useEffect(() => {
    if (materials?.front && materials?.back) {
      rotationApi.start({
        rotation: [Math.PI * 2, Math.PI * 2, Math.PI * 2.05], // Rotate 360 degrees around the Y-axis
        from: { rotation: [0, 0, 0] }, // Start from 0 rotation
      });

      positionApi.start({
        position: [0, 0, -50], // Final position
        from: { position: [0, -30, -40] }, // Start from above
        config: {
          duration: 600, // Duration of 1 second
          easing: (t) => t * (2 - t), // Decelerate easing function
        },
      });
    }
  }, [rotationApi, positionApi, materials]);

  // Loading textures
  // biome-ignore lint/correctness/useExhaustiveDependencies: Textures are loaded only once
  useEffect(() => {
    CONFIG.dimensions.height = window.innerHeight;
    const loadTextures = async () => {
      const loadedTextures = await loadTexturesAsync<typeof CONFIG.textures>(
        CONFIG.textures
      );
      loadedTextures.u_color.wrapS = THREE.RepeatWrapping;
      loadedTextures.u_color.wrapT = THREE.RepeatWrapping;
      for (const t of Object.values(loadedTextures)) {
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
      }

      setTextures({
        ...loadedTextures,
        u_resolution: new THREE.Vector2(
          CONFIG.dimensions.width / 2,
          // There is a weird artifact on the texture like a red spot, the magic num is offset
          CONFIG.dimensions.height
        ),
        time: 0.0,
      });
    };

    loadTextures();
  }, []);

  // Creating a profile surface and loading image from the web
  useEffect(() => {
    if (!textures || !cardRef.current) return;

    const loader = new THREE.TextureLoader();
    let profileMesh: THREE.Mesh;
    loader.load(profile.profileImageUrl, (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      profileMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), material);
      profileMesh.position.set(0, 0, 0.1);
      cardRef.current?.add(profileMesh);
    });

    return () => {
      if (profileMesh) {
        cardRef.current?.remove(profileMesh);
      }
    };
  }, [profile, textures]);

  // Do card rotation, update texture
  useFrame(({ clock }) => {
    if (materials?.front) materials.front.uniforms.time.value += 0.01;
    const c = cardRef.current;
    if (c && !(hovered || isAnimating)) {
      c.rotation.y += 0.002;
      c.rotation.x += 0.002;
    }
  });

  return (
    <a.group
      ref={cardRef}
      scale={scale}
      onClick={() => setCardState({ ...cardState, flipped: !flipped })}
      onPointerOver={() => setCardState({ ...cardState, hovered: true })}
      onPointerOut={() => setCardState({ ...cardState, hovered: false })}
      position={positionSpring.position as unknown as Vector3} // Apply animated position
      rotation={rotationSpring.rotation} // Apply animated rotation
      rotation-y={!isAnimating && rotationY}
    >
      {materials?.front && (
        <mesh material={materials.front}>
          <planeGeometry args={[20, 30]} />
        </mesh>
      )}

      {materials?.back && (
        <mesh material={materials.back} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[20, 30]} />
        </mesh>
      )}
    </a.group>
  );
}

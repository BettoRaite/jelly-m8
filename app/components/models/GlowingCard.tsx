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
    cardTemplate: "./public/cardtemplate.png",
    cardTemplateBack:
      "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplateback4.png",
    flower: "./public/heart.png",
    noise: "https://raw.githubusercontent.com/pizza3/asset/master/noise2.png",
    color:
      "https://images.unsplash.com/photo-1589307004173-3c95204d00ee?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBhdHRlcm58ZW58MHx8MHx8fDI%3D",
    backTexture:
      "https://raw.githubusercontent.com/pizza3/asset/master/color3.jpg",
    profile: "./public/private/girly.jpeg", // Path to profile picture
  },
  dimensions: {
    width: 1301,
    height: 0,
  },
};

type Textures = {
  cardTemplate: THREE.Texture;
  cardTemplateBack: THREE.Texture;
  flower: THREE.Texture;
  noise: THREE.Texture;
  color: THREE.Texture;
  colorBack?: THREE.Texture;
  backTexture: THREE.Texture;
  profile: THREE.Texture;
};
// Helper function to create materials
const createMaterial = (fragmentShader: string, textures: Textures) => {
  for (const t of Object.values(textures)) {
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
  }
  return new THREE.ShaderMaterial({
    uniforms: {
      u_card_template: { value: textures.cardTemplate },
      u_back_texture: { value: textures.backTexture },
      u_noise: { value: textures.noise },
      u_skull_render: { value: textures.flower },
      resolution: {
        value: new THREE.Vector2(
          CONFIG.dimensions.width / 2,
          CONFIG.dimensions.height
        ),
      },
      time: {
        value: 0.0,
      },
      u_noise_tex: { value: textures.noise },
      u_color: { value: textures.color },
      blurAmount: { value: 5.0 }, // Add blurAmount uniform
    },
    fragmentShader,
    vertexShader: vert,
    transparent: true,
    depthWrite: false,
  });
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
      cardTemplate: textures.cardTemplateBack,
    };
    return {
      front: createMaterial(fragPlane, textures),
      back: createMaterial(fragPlaneback, backTextures),
    };
  }, [textures]);

  const [spring, api] = useSpring(() => ({
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

  useEffect(() => {
    if (materials?.front && materials?.back) {
      api.start({
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
  }, [api, positionApi, materials]);

  useEffect(() => {
    CONFIG.dimensions.height = window.innerHeight;
    const loadTextures = async () => {
      const loadedTextures = await loadTexturesAsync<typeof CONFIG.textures>(
        CONFIG.textures
      );
      loadedTextures.color.wrapS = THREE.RepeatWrapping;
      loadedTextures.color.wrapT = THREE.RepeatWrapping;
      for (const t of Object.values(loadedTextures)) {
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
      }

      setTextures(loadedTextures);
    };

    loadTextures();
  }, []);

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

  useFrame(({ clock }) => {
    if (materials?.front)
      materials.front.uniforms.time.value += clock.getDelta();
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
      rotation={spring.rotation} // Apply animated rotation
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

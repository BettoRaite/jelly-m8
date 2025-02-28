import { createMaterial } from "@/lib/helpers/createMaterial";
import { loadTexturesAsync } from "@/lib/helpers/loadTextures";
import {
  fragPlane,
  fragPlaneback,
  profileImageFragmentShader,
  profileImageVertexShader,
  vert,
} from "@/lib/shaders/glowingCard.shader";
import planeShaders from "@/lib/shaders/plane.shader";
import type { Profile } from "@/lib/types";
import { a, useSpring } from "@react-spring/three";
import {
  useFrame,
  useThree,
  type GroupProps,
  type Vector3,
} from "@react-three/fiber";
import { Outline, Select } from "@react-three/postprocessing";
import { BlendFunction, KernelSize, Resizer } from "postprocessing";
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
    u_card_template: "./cardtemplate.png",
    cardTemplate: "./cardtemplate.png",
    u_card_template_back: "./cardtemplateback.png",
    u_skull_render: "./heart.png",
    backPattern: "./heart.png",
    u_noise: "./noise2.png",
    u_color:
      "https://images.unsplash.com/photo-1597773026935-df49538167e4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHBhdHRlcm58ZW58MHwwfDB8fHwy",
    u_back_texture: "./backtexture.jpg",
  },
  dimensions: {
    width: 1301,
    height: 0,
  },
};

// Main Scene Component
type Props = {
  cardProps?: GroupProps;
  profile: Profile;
  showSpecialEffects?: boolean;
};
export function GlowingCard({ cardProps, profile, showSpecialEffects }: Props) {
  const { gl } = useThree();
  const [textures, setTextures] = useState<Record<
    keyof typeof CONFIG.textures,
    THREE.Texture
  > | null>(null);
  const cardRef = useRef<Group | null>(null);
  const profilePicMeshRef = useRef<THREE.ShaderMaterial | null>(null);
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
      cardTemplate: textures.u_card_template_back,
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
    const cardDist = window.innerWidth < 1024 ? -60 : -50;
    if (materials?.front && materials?.back) {
      rotationApi.start({
        rotation: [Math.PI * 2, Math.PI * 2, Math.PI * 2.05], // Rotate 360 degrees around the Y-axis
        from: { rotation: [0, 0, 0] }, // Start from 0 rotation
      });

      positionApi.start({
        position: [0, 0, cardDist], // Final position
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
      const loadedTextures = await loadTexturesAsync<typeof CONFIG.textures>({
        ...CONFIG.textures,
      });
      loadedTextures.u_color.wrapS = THREE.RepeatWrapping;
      loadedTextures.u_color.wrapT = THREE.RepeatWrapping;
      for (const t of Object.values(loadedTextures)) {
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
      }

      setTextures({
        ...loadedTextures,
        u_resolution: new THREE.Vector2(
          CONFIG.dimensions.width / 2,
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
    loader.load(
      profile.profileImageUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();

        const material = createMaterial(
          profileImageFragmentShader,
          profileImageVertexShader,
          {
            profileImage: texture,
            brightness: 1.0,
            borderRadius: 1.38,
            time: 0.0,
          }
        );
        profileMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), material);
        profileMesh.position.set(0, 0, 0.1);
        profileMesh.layers.set(1);
        cardRef.current?.add(profileMesh);
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error(
          "An error occurred while loading the profile image texture.",
          error
        );
      }
    );

    return () => {
      if (profileMesh) {
        cardRef.current?.remove(profileMesh);
      }
    };
  }, [profile, textures, gl]);

  const effectMaterials = useMemo(() => {
    return {
      plane: new THREE.ShaderMaterial({
        vertexShader: planeShaders.vert,
        fragmentShader: planeShaders.frag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          u_time: {
            value: 0,
          },
          u_resolution: {
            value: 1920 / 1080,
          },
        },
      }),
      sphere: new THREE.ShaderMaterial({
        vertexShader: planeShaders.vert,
        fragmentShader: planeShaders.frag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          u_time: {
            value: 0,
          },
          u_resolution: {
            value: 1920 / 1080,
          },
        },
      }),
    };
  }, []);

  useFrame(({ clock }) => {
    if (materials?.front) materials.front.uniforms.time.value += 0.01;
    const c = cardRef.current;
    if (c && !(hovered || isAnimating)) {
      c.rotation.y += 0.002;
      c.rotation.x += 0.002;
    }
    const { plane, sphere } = effectMaterials;
    if (plane) {
      const et = clock.getElapsedTime();
      plane.uniforms.u_time.value = cardState.flipped ? -et : et;
    }
    if (sphere) {
      const et = clock.getElapsedTime();
      sphere.uniforms.u_time.value = cardState.flipped ? -et : et;
    }
  });

  return (
    <a.group
      ref={cardRef}
      scale={scale}
      onClick={() => setCardState({ ...cardState, flipped: !flipped })}
      onPointerOver={() => setCardState({ ...cardState, hovered: true })}
      onPointerOut={() => setCardState({ ...cardState, hovered: false })}
      position={positionSpring.position as unknown as Vector3}
      rotation={rotationSpring.rotation}
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
      <Select enabled>
        {showSpecialEffects && (
          <>
            <mesh
              rotation={[cardState.flipped ? -Math.PI : 0, 0, -0.3]}
              position={[0, 0, 0]}
              renderOrder={1}
              material={effectMaterials.plane}
            >
              <planeGeometry args={[50, 50]} />
            </mesh>

            <mesh
              rotation={[cardState.flipped ? -Math.PI : 0, 0, -0.3]}
              position={[0, 0, 0]}
              renderOrder={1}
              material={effectMaterials.sphere}
            >
              <sphereGeometry args={[15, 15]} />
            </mesh>
          </>
        )}
      </Select>
    </a.group>
  );
}

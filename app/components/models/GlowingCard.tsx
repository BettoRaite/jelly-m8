import { useFrame, useThree, type GroupProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { type BloomEffect, GlitchMode, BlendFunction } from "postprocessing";

import {
  fragPlane,
  fragPlaneback,
  vert,
} from "@/lib/shaders/glowingCard.shader";
import { a, useSpring } from "@react-spring/three";
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
    cardtemplate:
      "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplate3.png",
    cardtemplateback:
      "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplateback4.png",
    flower: "https://raw.githubusercontent.com/pizza3/asset/master/flower3.png",
    noise2: "https://raw.githubusercontent.com/pizza3/asset/master/noise2.png",
    color11:
      "https://images.unsplash.com/photo-1581257107100-f952b3a5c451?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG92ZSUyMHBhdHRlcm58ZW58MHx8MHx8fDI%3D",
    backtexture:
      "https://raw.githubusercontent.com/pizza3/asset/master/color3.jpg",
    skullmodel:
      "https://raw.githubusercontent.com/pizza3/asset/master/skull5.obj",
    voronoi:
      "https://raw.githubusercontent.com/pizza3/asset/master/rgbnoise2.png",
    profile: "./public/private/girly.jpeg", // Path to profile picture
  },
  dimensions: {
    width: 1301,
  },
};

// Helper function to create materials
const createMaterial = (fragmentShader, textures) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      cardtemplate: { value: textures.cardtemplate },
      backtexture: { value: textures.backtexture },
      noise: { value: textures.noise },
      skullrender: { value: textures.flower },
      resolution: {
        value: new THREE.Vector2(
          CONFIG.dimensions.width / 2,
          CONFIG.dimensions.height
        ),
      },
      noiseTex: { value: textures.noiseTex },
      color: { value: textures.color },
    },
    fragmentShader,
    vertexShader: vert,
    transparent: true,
    depthWrite: false,
  });
};

function createRoundedPlane(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();

  // Define the rounded rectangle
  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    -height / 2 + radius
  );
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2,
    height / 2 - radius
  );
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2 + radius,
    -height / 2
  );

  // Extrude the shape into a 3D geometry
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1, // Thickness of the plane
    bevelEnabled: false,
  });

  return geometry;
}

// Main Scene Component

export function GlowingCard(props: GroupProps) {
  const { camera, gl, scene } = useThree();
  const [frontMaterial, setFrontMaterial] = useState(null);
  const [backMaterial, setBackMaterial] = useState(null);
  const clock = useRef(new THREE.Clock());
  const matrix = useRef(new THREE.Matrix4());
  const cardRef = useRef<Group | null>(null);
  const bloomRef = useRef<BloomEffect | null>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const { rotationY, scale } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    scale: hovered ? 1.1 : 1,
    config: { mass: isAnimating ? 30 : 2, tension: 300, friction: 20 },
  });

  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0], // Initial rotation
    config: { mass: 10, tension: 300, friction: 20 }, // Animation config
    onRest: () => {
      setIsAnimating(false);
    },
  }));

  const [positionSpring, positionApi] = useSpring(() => ({
    position: [0, 20, -50], // Initial position (above the final position)
    config: { mass: 1, tension: 200, friction: 20 }, // Animation config
  }));

  useEffect(() => {
    api.start({
      rotation: [Math.PI * 2, Math.PI * 2, Math.PI * 2.05], // Rotate 360 degrees around the Y-axis
      from: { rotation: [0, 0, 0] }, // Start from 0 rotation
    });

    positionApi.start({
      position: [0, 0, -50], // Final position
      from: { position: [0, -30, -50] }, // Start from above
      config: {
        duration: 600, // Duration of 1 second
        easing: (t) => t * (2 - t), // Decelerate easing function
      },
    });
  }, [api, positionApi]);

  const period = 5;

  useFrame(() => {
    const c = cardRef.current;
    if (c) {
      c.rotation.y += 0.002;
      c.rotation.x += 0.002;
    }
  });
  useFrame(() => {
    const b = bloomRef.current;
  });

  // Load textures and create materials
  useEffect(() => {
    CONFIG.dimensions.height = window.innerHeight;
    const textureLoader = new THREE.TextureLoader();
    const textures = {
      cardtemplate: textureLoader.load(CONFIG.textures.cardtemplate),
      cardtemplateback: textureLoader.load(CONFIG.textures.cardtemplateback),
      profile: textureLoader.load(CONFIG.textures.profile), // Load profile texture
      backtexture: textureLoader.load(CONFIG.textures.backtexture),
      noise: textureLoader.load(CONFIG.textures.noise2),
      noiseTex: textureLoader.load(CONFIG.textures.voronoi),
      color: textureLoader.load(CONFIG.textures.color11),
      flower: textureLoader.load(CONFIG.textures.flower),
    };
    const frontTextures = {
      cardtemplate: textureLoader.load(CONFIG.textures.cardtemplate),
      backtexture: textureLoader.load(CONFIG.textures.backtexture),
      // noise: textureLoader.load(CONFIG.textures.noise2),
      // noiseTex: textureLoader.load(CONFIG.textures.voronoi),
      color: textureLoader.load(CONFIG.textures.color11),
    };
    const frontMat = createMaterial(fragPlane, frontTextures);
    const backMat = createMaterial(fragPlaneback, textures);
    setFrontMaterial(frontMat);
    setBackMaterial(backMat);

    // Create a plane for the profile picture
    const profileGeometry = new THREE.PlaneGeometry(18, 18); // Adjust size as needed
    const profileMaterial = new THREE.MeshBasicMaterial({
      map: textures.profile,
      transparent: true,
    });
    const profilePlane = new THREE.Mesh(profileGeometry, profileMaterial);
    profilePlane.position.set(0, 0, 0.1); // Slightly in front of the card

    if (cardRef.current) {
      cardRef.current.add(profilePlane);
    }

    // Setup composer and bloom pass
  }, [camera, gl]);

  // Animation loop

  return (
    <a.group
      ref={cardRef}
      scale={scale}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={positionSpring.position} // Apply animated position
      rotation={spring.rotation} // Apply animated rotation
      rotation-y={!isAnimating && rotationY}
    >
      {/* Front Card */}
      {frontMaterial && (
        <mesh material={frontMaterial}>
          <planeGeometry args={[20, 30]} />
        </mesh>
      )}

      {/* Back Card */}
      {backMaterial && (
        <mesh material={backMaterial} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[20, 30]} />
        </mesh>
      )}
      {/* <EffectComposer>
        <Bloom
          ref={bloomRef}
          luminanceThreshold={0}
          luminanceSmoothing={2}
          intensity={1}
          height={300}
        />
        <Vignette
          offset={0.5} // vignette offset
          darkness={1} // vignette darkness
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
      </EffectComposer> */}
    </a.group>
  );
}

import { a, useSpring } from "@react-spring/three";
import type { MeshProps } from "@react-three/fiber";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { Vector3 } from "three";
import * as THREE from "three";

// type Props = {
//   children: ReactNode;
//   cameraPosition: Vector3;
// };

const gradientShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D textureMap; // Texture uniform
    uniform vec3 colorStart;
    uniform vec3 colorEnd;
    uniform vec3 glowColor; // Glow color
    uniform float glowIntensity; // Glow intensity
    uniform float glowThreshold; // Brightness threshold for glow

    void main() {
      // Sample the texture
      vec4 textureColor = texture2D(textureMap, vUv);

      // Calculate brightness (luminance)
      float brightness = dot(textureColor.rgb, vec3(0.2126, 0.7152, 0.0722));

      // Apply glow effect
      float glow = smoothstep(glowThreshold, 1.0, brightness); // Smoothstep for glow
      vec3 glowEffect = glowColor * glow * glowIntensity; // Glow effect

      // Combine gradient, texture, and glow
      float gradient = smoothstep(0.0, 1.0, vUv.x); // Horizontal gradient
      vec3 gradientColor = mix(colorStart, colorEnd, gradient); // Gradient color
      vec3 finalColor = gradientColor * textureColor.rgb + glowEffect; // Combine all

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  uniforms: {
    colorStart: { value: new THREE.Color(0xffffff) }, // Start color (white)
    colorEnd: { value: new THREE.Color(0x800080) }, // End color (purple)
    textureMap: { value: null }, // Texture uniform (initially null)
    glowColor: { value: new THREE.Color(0x800080) }, // Glow color (purple)
    glowIntensity: { value: 2.0 }, // Glow intensity
    glowThreshold: { value: 0.3 }, // Brightness threshold for glow
  },
};

export function CardModel(props: MeshProps = {}) {
  const cardRef = useRef<THREE.Mesh | null>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [borderTexture, setBorderTexture] = useState<THREE.Texture | null>(
    null
  ); // New state for border texture

  useEffect(() => {
    const loadTextures = async () => {
      const front = await new THREE.TextureLoader().loadAsync(
        "./public/tao-tsuchia.jpg"
      );
      const back = await new THREE.TextureLoader().loadAsync(
        "./public/pattern.jpg"
      );
      const border = await new THREE.TextureLoader().loadAsync(
        "./public/border-texture.jpg"
      ); // Load border texture
      setFrontTexture(front);
      setBackTexture(back);
      setBorderTexture(border);
    };

    loadTextures();
  }, []);

  const frontAspect = frontTexture
    ? frontTexture.image.width / frontTexture.image.height
    : 1;

  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const { rotationY, scale } = useSpring({
    opacity: flipped ? 1 : 0,
    rotationY: flipped ? Math.PI : 0,
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 300, friction: 20 },
  });

  // Create a rounded rectangle shape
  const createRoundedRectangle = (
    width: number,
    height: number,
    radius: number
  ) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return shape;
  };

  const cardWidth = 0.5 * frontAspect;
  const cardHeight = 0.5;
  const cardDepth = 0.02; // Depth of the card
  // Border dimensions
  const borderWidth = 0.55 * frontAspect; // Slightly larger than the card
  const borderHeight = 0.55;
  const borderRadius = 0.02; // Radius of the rounded corners
  const offset = 0.0;
  // Create the border geometry

  const cardShape = createRoundedRectangle(cardWidth, cardHeight, borderRadius);
  const cardGeometry = new THREE.ExtrudeGeometry(cardShape, {
    depth: cardDepth, // Depth of the card
    bevelEnabled: false, // Disable bevel for simplicity
  });

  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    side: THREE.FrontSide,
  });

  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    side: THREE.BackSide,
  });

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Gray color for the sides
  });

  const materials = [
    sideMaterial, // Sides
    frontMaterial, // Front
    backMaterial, // Back
  ];

  const borderShape = createRoundedRectangle(
    borderWidth,
    borderHeight,
    borderRadius
  );
  const borderBigShape = createRoundedRectangle(
    borderWidth + offset,
    borderHeight + offset,
    borderRadius
  );
  const borderGeometry = new THREE.ShapeGeometry(borderShape);
  const borderBigGeometry = new THREE.ShapeGeometry(borderBigShape);

  return (
    <a.group
      {...props}
      scale={scale}
      rotation-y={rotationY}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, -0.01]}>
        {" "}
        {/* Slightly in front of the card */}
        <primitive object={borderGeometry} />
        {/* Shader material with texture support */}
        <shaderMaterial
          attach="material"
          {...gradientShader}
          uniforms-textureMap-value={borderTexture} // Pass the border texture
          uniforms-glowColor-value={new THREE.Color(0x00ff00)} // Glow color (green)
          uniforms-glowIntensity-value={2.0} // Increase glow intensity
          uniforms-glowThreshold-value={0.3} // Lower threshold for more glow
        />
      </mesh>

      <mesh position={[0, 0, -0.02]}>
        <primitive object={borderBigGeometry} />
      </mesh>

      {/* Card Front */}
      {frontTexture && (
        <mesh>
          <planeGeometry args={[0.5 * frontAspect, 0.5]} />
          <meshStandardMaterial map={frontTexture} />
        </mesh>
      )}

      {/* Card Back */}
      {backTexture && (
        <mesh>
          <planeGeometry args={[0.5 * frontAspect, 0.5]} />
          <meshStandardMaterial map={backTexture} side={THREE.BackSide} />
        </mesh>
      )}
    </a.group>
  );
}

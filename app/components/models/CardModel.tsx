import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useSpring, animated as a } from "@react-spring/three";
import { useFrame, type MeshProps } from "@react-three/fiber";

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

const roundedCornersShader = {
  uniforms: {
    map: { value: null }, // Texture
    radius: { value: 0.1 }, // Corner radius (normalized)
    aspect: { value: 1.0 }, // Aspect ratio (width / height)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float radius;
    uniform float aspect;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      uv.x *= aspect; // Adjust for aspect ratio

      // Calculate distance from the edges
      vec2 position = abs(uv - vec2(aspect * 0.5, 0.5)) * 2.0;
      float distance = length(max(position - vec2(aspect - radius, 1.0 - radius), 0.0));

      // Discard fragments outside the rounded rectangle
      if (distance > radius) {
        discard;
      }

      gl_FragColor = texture2D(map, vUv);
    }
  `,
};

export function CardModel(props: MeshProps = {}) {
  const cardRef = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [textures, setTextures] = useState<{
    frontTexture: null | THREE.Texture;
    backTexture: null | THREE.Texture;
    borderTexture: null | THREE.Texture;
  }>({
    frontTexture: null,
    backTexture: null,
    borderTexture: null,
  });

  // useFrame(() => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.001;
  //   }
  // });
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
      );

      setTextures({
        frontTexture: front,
        backTexture: back,
        borderTexture: border,
      });
    };

    loadTextures();
  }, []);

  const { frontTexture, backTexture, borderTexture } = textures;

  if (frontTexture) {
    frontTexture.wrapS = THREE.ClampToEdgeWrapping;
    frontTexture.wrapT = THREE.ClampToEdgeWrapping;
    frontTexture.repeat.set(1, 1);
    frontTexture.offset.set(0, 0);
  }

  const frontAspect = frontTexture
    ? frontTexture.image.width / frontTexture.image.height
    : 1;

  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const { rotationY, scale } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 300, friction: 20 },
  });

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
  const cardDepth = 0.02;
  const borderRadius = 0.05;

  const cardShape = createRoundedRectangle(cardWidth, cardHeight, borderRadius);
  const cardGeometry = new THREE.ExtrudeGeometry(cardShape, {
    depth: cardDepth,
    bevelEnabled: false,
  });

  const frontMaterial = new THREE.ShaderMaterial({
    ...roundedCornersShader,
    uniforms: {
      map: { value: frontTexture },
      radius: { value: 0.1 }, // Adjust radius as needed
      aspect: { value: frontAspect },
    },
  });

  const backMaterial = new THREE.ShaderMaterial({
    ...roundedCornersShader,
    uniforms: {
      map: { value: backTexture },
      radius: { value: 0.1 }, // Adjust radius as needed
      aspect: { value: frontAspect },
    },
  });

  const materials = [backMaterial, frontMaterial];

  return (
    <a.group
      ref={groupRef}
      {...props}
      scale={scale}
      rotation-y={rotationY}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh
        ref={cardRef}
        geometry={cardGeometry}
        material={materials}
        castShadow
        receiveShadow
      >
        {frontTexture && (
          <mesh position={[0, 0, cardDepth / 2 + 0.02]}>
            <planeGeometry args={[cardWidth, cardHeight]} />
            <primitive object={frontMaterial} />
          </mesh>
        )}

        {backTexture && (
          <mesh position={[0, 0, -cardDepth / 2 - 0.001]} rotation-y={Math.PI}>
            <planeGeometry args={[cardWidth, cardHeight]} />
            <primitive object={backMaterial} />
          </mesh>
        )}
      </mesh>

      {borderTexture && (
        <mesh position={[0, 0, -cardDepth / 2 - 0.01]}>
          <shapeGeometry
            args={[
              createRoundedRectangle(
                cardWidth * 1.13,
                cardHeight * 1.13,
                borderRadius * 1.1
              ),
            ]}
          />
          <shaderMaterial
            attach="material"
            {...gradientShader}
            uniforms-textureMap-value={borderTexture}
            uniforms-glowColor-value={new THREE.Color(0x00ff00)}
            uniforms-glowIntensity-value={2.0}
            uniforms-glowThreshold-value={0.3}
          />
        </mesh>
      )}
    </a.group>
  );
}

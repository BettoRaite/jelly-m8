import * as THREE from "three";

export const createMaterial = (
  fragmentShader: string,
  vertexShader: string,
  rawUniforms: Record<string, THREE.Texture | number | THREE.Vector2>
) => {
  const uniforms: Record<string, Omit<THREE.Uniform, "clone">> = {};
  for (const t of Object.keys(rawUniforms)) {
    const uniform = rawUniforms[t];
    if (uniform instanceof THREE.Texture) {
      uniform.minFilter = THREE.LinearMipmapLinearFilter;
      uniform.magFilter = THREE.LinearFilter;
      uniform.generateMipmaps = true;
      uniform.needsUpdate = true;
      uniform.wrapS = THREE.ClampToEdgeWrapping;
      uniform.wrapT = THREE.ClampToEdgeWrapping;
    }
    uniforms[t] = {
      value: uniform,
    };
  }
  return new THREE.ShaderMaterial({
    uniforms,
    fragmentShader,
    vertexShader,
    transparent: true,
    depthWrite: false,
  });
};
/*

{
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
},
*/

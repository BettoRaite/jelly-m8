import * as THREE from "three";

export const loadTexturesAsync = async <T extends Record<string, string>>(
  textures: T
): Promise<Record<keyof T, THREE.Texture>> => {
  const loader = new THREE.TextureLoader();
  const promises: Promise<THREE.Texture>[] = [];
  const loadedTextures: Partial<Record<keyof T, THREE.Texture>> = {};

  for (const k of Object.keys(textures) as (keyof T)[]) {
    const texturePromise = loader.loadAsync(textures[k]);
    promises.push(texturePromise);
    texturePromise.then((texture) => {
      loadedTextures[k] = texture;
    });
  }

  await Promise.all(promises);
  return loadedTextures as Record<keyof T, THREE.Texture>;
};

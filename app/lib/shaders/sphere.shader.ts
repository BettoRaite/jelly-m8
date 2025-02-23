const vert = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;
  uniform float u_time;       // Time elapsed, useful for animation
  uniform sampler2D u_texture; // Texture to sample from

  void main() {
      // Normalize the fragment coordinates to [0, 1]
      vec2 uv = vUv;

      // Center the y-coordinate and scale it to make the sine wave visible
      uv.y -= 0.5; // Move the sine wave to the center vertically
      uv.y *= 10.0; // Scale the sine wave amplitude

      // Calculate the sine wave value at the current x-coordinate
      float sineValue = sin(uv.x * 10.0 + u_time * 1.0); // Adjust frequency and animation speed

      // Draw the sine wave with a smoothstep for anti-aliasing
      float lineThickness = 0.2; // Thickness of the sine wave line
      float waveMask = smoothstep(lineThickness, 0.0, abs(uv.y - sineValue));

      // Sample the texture
      vec4 textureColor = texture2D(u_texture, vUv);

      // Combine the sine wave mask with the texture
      vec4 finalColor = textureColor * waveMask;

      // Set the output color
      gl_FragColor = finalColor;

      // Make areas outside the sine wave transparent
      gl_FragColor.a = waveMask; // Use the wave mask as the alpha channel
  }
`;
const sphereShaders = {
  vert,
  frag,
};

export default sphereShaders;

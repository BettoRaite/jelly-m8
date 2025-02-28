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

  uniform vec2 u_resolution;
  uniform float u_time;
  varying vec2 vUv;

  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 hash3(vec2 p) {
      return vec3(
          hash(p),
          hash(p + vec2(1.0, 0.0)),
          hash(p + vec2(0.0, 1.0))
      );
  }

  void main() {
      // Add vertical scroll to UV coordinates
      vec2 uv = fract(vUv + vec2(0.0, -(u_time * 0.01)));

      float gridScale = 15.0;
      vec2 scaledUV = uv * gridScale;
      vec2 cell = floor(scaledUV);

      float brightness = 0.0;

      // Check 3x3 neighborhood cells
      for(int x = -1; x <= 1; x++) {
          for(int y = -1; y <= 1; y++) {
              vec2 neighborCell = cell + vec2(x, y);
              vec3 rand = hash3(neighborCell);

              // 30% chance of star in each cell
              if(rand.x > 0.7) {
                  // Star position within cell
                  vec2 starPos = neighborCell + rand.yz;
                  vec2 starUV = starPos / gridScale;

                  float dx = abs(uv.x - starUV.x);
                  float dy = abs(uv.y - starUV.y);
                  // Rectangular distance calculation (square shape)
                  float dist = max(dx + 0.001, dy - 0.0001);
                  float radius = 0.004 + 0.001 * rand.y;
                  float falloff = 1.0 - smoothstep(0.0, radius, dist);

                  // Twinkle effect with random phase
                  float twinkle = sin(u_time * 3.0 + rand.z * 6.2831) * 0.5 + 0.5;
                  brightness += falloff * twinkle;
              }
          }
      }

      // Clamp brightness and set color
      brightness = min(brightness, 1.0);
      gl_FragColor = vec4(1.5, 1.0, 1.5, brightness); // Purple color
  }
`;
const planeShaders = {
  vert,
  frag,
};

export default planeShaders;

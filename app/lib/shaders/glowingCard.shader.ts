export const vert = `
  varying vec2 vUV; // Changed from vUv to vUV
  varying vec3 v_cam_pos; // Changed from camPos to v_cam_pos
  varying vec3 v_eye_vector; // Changed from eyeVector to v_eye_vector
  varying vec3 v_normal; // Changed from vNormal to v_normal

  void main() {
    vUV = uv;
    v_cam_pos = cameraPosition;
    v_normal = normal;
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    v_eye_vector = normalize(worldPosition.xyz - abs(cameraPosition));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragPlane = `
  varying vec2 vUV;
  uniform sampler2D backPattern;
  uniform sampler2D cardTemplate;
  uniform sampler2D u_back_texture;
  uniform sampler2D u_noise_tex;
  uniform sampler2D u_color;
  uniform sampler2D u_noise;
  uniform float time;
  uniform vec4 u_resolution;
  varying vec3 v_cam_pos;
  varying vec3 v_eye_vector;
  varying vec3 v_normal;
  precision highp float;
  precision highp sampler2D;

  float fresnel(vec3 eye_vector, vec3 world_normal) {
    return pow(1.0 + dot(eye_vector, world_normal), 1.80);
  }

  void main() {
    vec2 uv = vUV * vec2(u_resolution.x / u_resolution.y, 1.0);
    vec4 template_texture = texture2D(cardTemplate, vUV);
    vec4 skull_texture = texture2D(backPattern, uv - 1.0);

    gl_FragColor = template_texture;
    float f = fresnel(v_eye_vector, v_normal);
    vec4 noise_texture = texture2D(u_noise, mod(vUV * 1.0, 1.0));

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
      float tone = pow(dot(normalize(v_cam_pos), normalize(skull_texture.rgb)), 1.0);
      vec4 color_texture = texture2D(u_color, vec2(tone, 0.0));
      if (skull_texture.a > 0.2) {
        gl_FragColor = color_texture;
        // gl_FragColor += vec4(108.0) * result;
        // gl_FragColor += vec4(sin((tone + vUV.x + vUV.y / 10.0) * 10.0)) / 8.0;
      } else {
        gl_FragColor = vec4(0.0) + f;
        gl_FragColor += noise_texture / 15.0;
      }
      gl_FragColor += noise_texture / 5.0;
    } else {
      vec4 back_texture = texture2D(u_back_texture, vUV);
      float tone = pow(dot(normalize(v_cam_pos), normalize(back_texture.rgb)), 1.0);

      vec2 center = vec2(0.5, 0.5); // Center of the texture
      vec2 animatedUv = fract(vUV + vec2(time * 0.1, time * 0.05));
      vec4 color_texture = texture2D(u_color, animatedUv);

      color_texture.rgb = mix(vec3(0.5), color_texture.rgb, 1.2); // Boost contrast

      // Sparkle code
      vec2 uv2 = vUV;
      vec3 pixel_tex = texture2D(u_noise_tex, mod(uv * 5.0, 1.0)).rgb;
      float i_time = 1.0 * 0.004;
      uv.y += i_time / 10.0;
      uv.x -= (sin(i_time / 10.0) / 2.0);
      uv2.y += i_time / 14.0;
      uv2.x += (sin(i_time / 10.0) / 9.0);
      float result = 0.0;
      result += texture2D(u_noise_tex, mod(uv * 4.0, 1.0) * 0.6 + vec2(i_time * -0.003)).r;
      result *= texture2D(u_noise_tex, mod(uv2 * 4.0, 1.0) * 0.9 + vec2(i_time * +0.002)).b;
      result = pow(result, 10.0);
      gl_FragColor *= color_texture;
      gl_FragColor += vec4(sin((0.1 + vUV.x + vUV.y / 10.0) * 10.0)) / 8.0;
      // Uncomment if needed (adjust brightness)
      // gl_FragColor += vec4(108.0) * result;
      gl_FragColor.a = template_texture.a + 0.1;
    }

  }
`;

export const fragPlaneback = `
  varying vec2 vUV; // Changed from vUv to vUV
  uniform sampler2D u_skull_render; // Changed from skullrender to u_skull_render
  uniform sampler2D cardTemplate; // Changed from cardtemplate to cardTemplate
  uniform sampler2D u_back_texture; // Changed from backtexture to u_back_texture
  uniform sampler2D u_noise_tex; // Changed from noiseTex to u_noise_tex
  uniform sampler2D u_color; // Changed from color to u_color
  uniform sampler2D u_noise; // Changed from noise to u_noise
  uniform vec4 u_resolution; // Changed from resolution to u_resolution
  varying vec3 v_cam_pos; // Changed from camPos to v_cam_pos
  varying vec3 v_eye_vector; // Changed from eyeVector to v_eye_vector
  varying vec3 v_normal; // Changed from vNormal to v_normal

  float fresnel(vec3 eye_vector, vec3 world_normal) {
    return pow(1.0 + dot(eye_vector, world_normal), 1.80);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 template_texture = texture2D(cardTemplate, vUV);
    vec4 skull_texture = texture2D(u_skull_render, vUV);
    gl_FragColor = template_texture;
    vec4 noise_texture = texture2D(u_noise, mod(vUV * 2.0, 1.0));
    float f = fresnel(v_eye_vector, v_normal);

    vec2 uv2 = vUV;
    vec3 pixel_tex = texture2D(u_noise_tex, mod(uv * 5.0, 1.0)).rgb;
    float i_time = 1.0 * 0.004;
    uv.y += i_time / 10.0;
    uv.x -= (sin(i_time / 10.0) / 2.0);
    uv2.y += i_time / 14.0;
    uv2.x += (sin(i_time / 10.0) / 9.0);
    float result = 0.0;
    result += texture2D(u_noise_tex, mod(uv * 4.0, 1.0) * 0.6 + vec2(i_time * -0.003)).r;
    result *= texture2D(u_noise_tex, mod(uv2 * 4.0, 1.0) * 0.9 + vec2(i_time * +0.002)).b;
    result = pow(result, 10.0);

    vec4 back_texture = texture2D(u_back_texture, vUV);
    float tone = pow(dot(normalize(v_cam_pos), normalize(back_texture.rgb)), 1.0);
    vec4 color_texture = texture2D(u_color, vec2(tone, 0.0));

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
      float tone = pow(dot(normalize(v_cam_pos), normalize(skull_texture.rgb)), 1.0);
      vec4 color_texture2 = texture2D(u_color, vec2(tone, 0.0));
      if (skull_texture.a > 0.2) {
        gl_FragColor = color_texture;
        // gl_FragColor += vec4(108.0) * result;
        // gl_FragColor += vec4(sin((tone + vUV.x + vUV.y / 10.0) * 10.0)) / 8.0;
      } else {
        gl_FragColor = vec4(0.0) + f;
        gl_FragColor += noise_texture / 5.0;
      }
      gl_FragColor += noise_texture / 5.0;
    } else {
      // Sparkle code
      gl_FragColor *= color_texture;
      gl_FragColor += vec4(sin((tone + vUV.x + vUV.y / 10.0) * 10.0)) / 8.0;
    }
  }
`;

export const profileImageVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const profileImageFragmentShader = `
  uniform sampler2D profileImage;
  uniform float borderRadius; // Ensure this is set correctly in your application
  varying vec2 vUv;

  // Converting UV coords to range from -1 to 1
  float translateToRange(float oldValue) {
    return oldValue * 2.0 - 1.0;
  }

  float getHypotenuse(float a, float b) {
    return sqrt(a * a + b * b); // Correct hypotenuse calculation
  }

  // Function to generate a random float based on a seed
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Function to generate a star
  float star(vec2 uv, float size, float brightness) {
    float dist = length(uv);
    return brightness * smoothstep(size, size * 0.9, dist);
  }

  void main() {
    vec2 uv = vUv;
    float x = translateToRange(uv.x);
    float y = translateToRange(uv.y);
    float hyp = getHypotenuse(x, y);

    // Check if the distance from the center is greater than the border radius
    if (hyp > borderRadius) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Fully transparent
    } else {
      vec4 color = texture2D(profileImage, uv);
      // Generate stars
      vec2 starUV = uv * 10.0; // Scale the UV coordinates to create more stars
      float starValue = 0.0;

      // Create multiple layers of stars for a more natural look
      for (int i = 0; i < 5; i++) {
        vec2 offset = vec2(random(vec2(i, i + 1)), random(vec2(i + 2, i + 3))) * 100.0;
        starValue += star(fract(starUV + offset) - 0.5, 0.005, 1.0);
      }

      // Blend the stars with the original image
      vec3 starColor = vec3(1.0, 1.0, 1.0); // White stars
      color.rgb = mix(color.rgb, starColor, starValue);

      gl_FragColor = color; // Display the final color
    }
  }
`;

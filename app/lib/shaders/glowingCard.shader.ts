export const vert = `
  varying vec2 v_uv; // Changed from vUv to v_uv
  varying vec3 v_cam_pos; // Changed from camPos to v_cam_pos
  varying vec3 v_eye_vector; // Changed from eyeVector to v_eye_vector
  varying vec3 v_normal; // Changed from vNormal to v_normal

  void main() {
    v_uv = uv;
    v_cam_pos = cameraPosition;
    v_normal = normal;
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    v_eye_vector = normalize(worldPosition.xyz - abs(cameraPosition));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragPlane = `
  varying vec2 v_uv;
  uniform sampler2D u_skull_render;
  uniform sampler2D u_card_template;
  uniform sampler2D u_back_texture;
  uniform sampler2D u_noise_tex;
  uniform sampler2D u_color;
  uniform sampler2D u_noise;
  uniform vec4 u_resolution;
  varying vec3 v_cam_pos;
  varying vec3 v_eye_vector;
  varying vec3 v_normal;

  float fresnel(vec3 eye_vector, vec3 world_normal) {
    return pow(1.0 + dot(eye_vector, world_normal), 1.80);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 template_texture = texture2D(u_card_template, v_uv);
    vec4 skull_texture = texture2D(u_skull_render, uv - 0.5);
    gl_FragColor = template_texture;
    float f = fresnel(v_eye_vector, v_normal);
    vec4 noise_texture = texture2D(u_noise, mod(v_uv * 2.0, 1.0));

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
      gl_FragColor = f + skull_texture;
      gl_FragColor += noise_texture / 5.0;
    } else {
      vec4 back_texture = texture2D(u_back_texture, v_uv);
      float tone = pow(dot(normalize(v_cam_pos), normalize(back_texture.rgb)), 1.0);
      vec4 color_texture = texture2D(u_color, vec2(tone, 0.0));

      // Sparkle code
      vec2 uv2 = v_uv;
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
      gl_FragColor += vec4(sin((tone + v_uv.x + v_uv.y / 10.0) * 10.0)) / 8.0;
      // Uncomment if needed (adjust brightness)
      // gl_FragColor += vec4(108.0) * result;
    }

    gl_FragColor.a = template_texture.a;
  }
`;

export const fragPlaneback = `
  varying vec2 v_uv; // Changed from vUv to v_uv
  uniform sampler2D u_skull_render; // Changed from skullrender to u_skull_render
  uniform sampler2D u_card_template; // Changed from cardtemplate to u_card_template
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
    vec4 template_texture = texture2D(u_card_template, v_uv);
    vec4 skull_texture = texture2D(u_skull_render, v_uv);
    gl_FragColor = template_texture;
    vec4 noise_texture = texture2D(u_noise, mod(v_uv * 2.0, 1.0));
    float f = fresnel(v_eye_vector, v_normal);

    vec2 uv2 = v_uv;
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

    vec4 back_texture = texture2D(u_back_texture, v_uv);
    float tone = pow(dot(normalize(v_cam_pos), normalize(back_texture.rgb)), 1.0);
    vec4 color_texture = texture2D(u_color, vec2(tone, 0.0));

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
      float tone = pow(dot(normalize(v_cam_pos), normalize(skull_texture.rgb)), 1.0);
      vec4 color_texture2 = texture2D(u_color, vec2(tone, 0.0));
      if (skull_texture.a > 0.2) {
        gl_FragColor = color_texture;
        // gl_FragColor += vec4(108.0) * result;
        // gl_FragColor += vec4(sin((tone + v_uv.x + v_uv.y / 10.0) * 10.0)) / 8.0;
      } else {
        gl_FragColor = vec4(0.0) + f;
        gl_FragColor += noise_texture / 5.0;
      }
      gl_FragColor += noise_texture / 5.0;
    } else {
      // Sparkle code
      gl_FragColor *= color_texture;
      gl_FragColor += vec4(sin((tone + v_uv.x + v_uv.y / 10.0) * 10.0)) / 8.0;
    }
  }
`;

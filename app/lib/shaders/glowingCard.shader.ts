export const vert = `
  varying vec2 vUv;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    camPos = cameraPosition;
    vNormal = normal;
    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
    eyeVector = normalize(worldPosition.xyz - abs(cameraPosition));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

export const fragPlane = `
	varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform vec4 resolution;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, uv - 0.5 );
    gl_FragColor = temptex;
    float f = Fresnel(eyeVector, vNormal);
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      gl_FragColor = f + skulltex;
      gl_FragColor += noisetex/5.;

    } else {
      vec4 bactex = texture2D( backtexture, vUv);
      float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
      vec4 colortex = texture2D( color, vec2(tone,0.));

      //sparkle code, dont touch this!
      vec2 uv2 = vUv;
      vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;
      float iTime = 1.*0.004;
      uv.y += iTime / 10.0;
      uv.x -= (sin(iTime/10.0)/2.0);
      uv2.y += iTime / 14.0;
      uv2.x += (sin(iTime/10.0)/9.0);
      float result = 0.0;
      result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
      result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
      result = pow(result, 10.0);
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
      // gl_FragColor += vec4(108.0)*result;

    }

    gl_FragColor.a = temptex.a;
  }
`;

export const fragPlaneback = `
	varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform vec4 resolution;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, vUv );
    gl_FragColor = temptex;
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    float f = Fresnel(eyeVector, vNormal);

    vec2 uv2 = vUv;
    vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;
    float iTime = 1.*0.004;
    uv.y += iTime / 10.0;
    uv.x -= (sin(iTime/10.0)/2.0);
    uv2.y += iTime / 14.0;
    uv2.x += (sin(iTime/10.0)/9.0);
    float result = 0.0;
    result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
    result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
    result = pow(result, 10.0);


    vec4 bactex = texture2D( backtexture, vUv);
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
    vec4 colortex = texture2D( color, vec2(tone,0.));
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      float tone = pow(dot(normalize(camPos), normalize(skulltex.rgb)), 1.);
      vec4 colortex2 = texture2D( color, vec2(tone,0.));
      if(skulltex.a > 0.2){
        gl_FragColor = colortex;
        // gl_FragColor += vec4(108.0)*result;
        // gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
      } else {
        gl_FragColor = vec4(0.) + f;
        gl_FragColor += noisetex/5.;
      }
      gl_FragColor += noisetex/5.;

    } else {
      //sparkle code, dont touch this!
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
    }

  }
`;
export const vertskull = `
      varying vec3 vNormal;
      varying vec3 camPos;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 eyeVector;

      void main() {
        vNormal = normal;
        vUv = uv;
        camPos = cameraPosition;
        vPosition = position;
        vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
        eyeVector = normalize(worldPosition.xyz - cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
`;
export const fragskull = `
      #define NUM_OCTAVES 5
      uniform vec4 resolution;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      varying vec3 camPos;
      varying vec2 vUv;
      uniform vec3 color1;
      uniform vec3 color0;
      varying vec3 eyeVector;


      float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);

        float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
      }

      float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100);
        // Rotate to reduce axial bias
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      float setOpacity(float r, float g, float b) {
        float tone = (r + g + b) / 3.0;
        float alpha = 1.0;
        if(tone<0.69) {
          alpha = 0.0;
        }
        return alpha;
      }

      vec3 rgbcol(float r, float g, float b) {
        return vec3(r/255.0,g/255.0,b/255.0);
      }

      float Fresnel(vec3 eyeVector, vec3 worldNormal) {
        return pow( 1.0 + dot( eyeVector, worldNormal), 3.0 );
      }

      void main() {
        vec2 olduv = gl_FragCoord.xy/resolution.xy ;
        float f = Fresnel(eyeVector, vNormal);
        float gradient2 = (f)*(.3 - vPosition.y) ;
        float scale = 8.;
        // olduv *= 0.5;
        // olduv.y -= 0.5;
        olduv.y = olduv.y - time;
        vec2 p = olduv*scale;
        float noise = fbm( p + time );

        vec2 uv = gl_FragCoord.xy/resolution.xy ;
        //  uv = normalize( vNormal ).xy ;


        vec3 newCam = vec3(0.,5.,10.);
        float gradient = dot(.0 -  normalize( newCam ), normalize( vNormal )) ;

        vec3 viewDirectionW = normalize(camPos - vPosition);
        float fresnelTerm = dot(viewDirectionW, vNormal);
        fresnelTerm = clamp( 1. - fresnelTerm, 0., 1.) ;

        vec3 color = vec3(noise) + gradient;
        vec3 color2 = color - 0.2;


        float noisetone = setOpacity(color.r,color.g,color.b);
        float noisetone2 = setOpacity(color2.r,color2.g,color2.b);



        vec4 backColor = vec4(color, 1.);
        backColor.rgb = rgbcol(color0.r,color0.g,color0.b)*noisetone;
        // backColor.a = noisetone;

        vec4 frontColor = vec4(color2, 1.);
        frontColor.rgb = rgbcol(color1.r,color1.g,color1.b)*noisetone;
        // frontColor.a = noisetone2;

        if(noisetone2>0.0){
          // show first color
          gl_FragColor = frontColor;
        } else {
          // show 2nd color
          gl_FragColor = backColor;
        }
      }

`;

uniform float minNoise; // Minimum noise value
uniform float maxNoise; // Maximum noise value

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 temptex = texture2D(cardtemplate, vUv);
    vec4 skulltex = texture2D(skullrender, uv - 0.5);
    vec4 profiletex = texture2D(profile, vUv); // Sample profile texture

    // Blend profile texture with card template
    vec4 finalColor = mix(temptex, profiletex, profiletex.a); // Use alpha for blending

    float f = Fresnel(eyeVector, vNormal);
    vec4 noisetex = texture2D(noise, uv * 0.5); // Adjusted UV scaling for noise

    if (finalColor.g >= 0.5 && finalColor.r < 0.6) {
        finalColor = f + skulltex;

        // Remap noise value to the specified range
        float noiseValue = noisetex.r; // Assuming you want to use the red channel
        noiseValue = mix(minNoise, maxNoise, noiseValue); // Remap to [minNoise, maxNoise]

        finalColor += vec4(noiseValue) / 5.0; // Add noise to final color
    } else {
        vec4 bactex = texture2D(backtexture, vUv);
        float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
        vec4 colortex = texture2D(color, vec2(tone, 0.));

        // Sparkle code, don't touch this!
        vec2 uv2 = vUv;
        float iTime = 1. * 0.004;

        // Apply dynamic offsets instead of mod for non-repeating effect
        uv.y += iTime / 10.0;
        uv.x -= (sin(iTime / 10.0) / 2.0);
        uv2.y += iTime / 14.0;
        uv2.x += (sin(iTime / 10.0) / 9.0);

        float result = texture2D(noiseTex, uv * 4.).r; // Directly sample without mod
        result *= texture2D(noiseTex, uv2 * 4.).b; // Same here
        result = pow(result, 10.0);

        // Remap the result to the specified range
        result = mix(minNoise, maxNoise, result); // Remap to [minNoise, maxNoise]

        finalColor *= colortex;
        finalColor += vec4(sin((tone + vUv.x + vUv.y / 10.) * 10.)) / 8.;
    }

    finalColor.a = temptex.a; // Preserve original alpha
    gl_FragColor = finalColor;
}

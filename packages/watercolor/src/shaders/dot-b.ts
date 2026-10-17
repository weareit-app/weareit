import { KM_SKSL, NOISE_SKSL } from "./km.ts";

// Option B: a look-alike watercolor dot, drawn live from noise. No physics;
// each watercolor mark is imitated directly (research R3).
//   uBloom   0 → 1  the drop spreading out to full size
//   uDry     0 → 1  wet to dried (rim and bloom fronts darken as it dries)
//   uBreathe 0 → 1  amplitude of the slow pigment drift
//   uOpacity 0 → 1  for fading in and out
export const DOT_B_SKSL = /* sksl */ `
uniform float2 uSize;
uniform float uTime;
uniform float uBloom;
uniform float uDry;
uniform float uBreathe;
uniform float uSeed;
uniform float uOpacity;
uniform float3 uGran;
${KM_SKSL}
${NOISE_SKSL}

half4 main(float2 xy) {
  float2 p = (xy / uSize) * 2.0 - 1.0;
  float r = length(p);
  float ang = atan(p.y, p.x);
  float2 seed = float2(uSeed * 7.31, uSeed * 3.17);

  // Irregular, slightly bled edge: low-frequency wobble plus fine tooth.
  float wobble = fbm(float2(cos(ang), sin(ang)) * 1.6 + seed);
  float tooth = fbm(p * 18.0 + seed);
  float breathe = 1.0 + uBreathe * 0.015 * sin(uTime * 1.1);
  float radius = (0.6 + 0.3 * uBloom) * (1.0 + 0.11 * (wobble - 0.5) + 0.03 * (tooth - 0.5)) * breathe;
  // A soft edge while the drop is still spreading; crisp once it has bloomed.
  float soft = mix(0.08, 0.01, uBloom);
  float inside = 1.0 - smoothstep(radius - soft, radius + 0.006, r);
  if (inside <= 0.0) { return half4(0.0); }
  float depth = clamp((radius - r) / radius, 0.0, 1.0);

  // Pigment drifts slowly through the wet wash.
  float drift = uTime * 0.03 * uBreathe;
  float2 w = p + 0.4 * float2(fbm(p * 1.3 + seed + drift), fbm(p * 1.3 + seed + 5.2 - drift)) - 0.2;

  // Teal-side, middle and warm-side pigments, as in the painted orb.
  float d0 = 0.2 + 0.9 * smoothstep(0.4, -0.7, w.x);
  float d1 = 0.75 * smoothstep(-0.8, -0.05, w.x) * smoothstep(0.95, 0.25, w.x);
  float d2 = 0.65 * smoothstep(0.3, 0.85, w.x + 0.2 * w.y);

  // Edge darkening: pigment carried to the rim as the edge dries.
  float rim = 2.5 * exp(-(radius - r) / 0.025) * (0.3 + 0.7 * uDry);

  // Bloom (backrun): a patch where later water pushed pigment out. Inside it
  // the wash is paler; along its ragged boundary pigment piles up darker.
  float f = fbm(w * 1.8 + seed + 11.0) + 0.12 * fbm(w * 9.0 + seed);
  float inBloom = smoothstep(0.52, 0.56, f) * smoothstep(0.1, 0.4, depth);
  float band = exp(-max(0.54 - f, 0.0) / 0.035) * (1.0 - inBloom) * smoothstep(0.1, 0.4, depth);
  float front = uDry * (1.6 * band - 0.55 * inBloom);

  // Granulation: heavier pigments settle into the paper's valleys.
  float paper = 0.6 * vnoise(p * 95.0 + seed) + 0.4 * vnoise(p * 38.0 + seed);
  float3 dens = float3(d0, d1, d2) * (1.0 + 1.5 * rim + front);
  dens *= 1.0 + uGran * (0.5 - paper) * 1.6;

  // Mostly a thin wash, as in the painted orb, with paler and deeper patches,
  // and a thinner film while the drop is still spreading.
  float wash = fbm(p * 3.0 + seed + 2.0);
  dens *= 0.12 + 0.5 * wash * wash;
  dens *= 0.5 + 0.5 * uBloom;

  float3 c = toSrgb(kmMix(float4(dens, 0.0)));
  float a = inside * uOpacity;
  return half4(half3(c) * half(a), half(a));
}
`;

import { KM_SKSL } from "./km.ts";

// Option E: a dot painted ahead of time by tools/watercolor-sim. The atlas
// holds where each pigment ended up (RGB = pigment slots 0–2); this shader
// only plays the frames and colours them with Kubelka-Munk (research R4).
export const DOT_E_SKSL = /* sksl */ `
uniform shader uAtlas;
uniform float2 uSize;
uniform float uFrame;
uniform float uFrames;
uniform float uColumns;
uniform float uFrameSize;
uniform float uDensityScale;
${KM_SKSL}

float3 sampleFrame(float f, float2 uv) {
  float col = mod(f, uColumns);
  float row = floor(f / uColumns);
  float2 inFrame = clamp(uv * uFrameSize, float2(0.5), float2(uFrameSize - 0.5));
  return uAtlas.eval(float2(col, row) * uFrameSize + inFrame).rgb;
}

half4 main(float2 xy) {
  float2 uv = xy / uSize;
  float f0 = clamp(floor(uFrame), 0.0, uFrames - 1.0);
  float f1 = min(f0 + 1.0, uFrames - 1.0);
  float3 d = mix(sampleFrame(f0, uv), sampleFrame(f1, uv), fract(uFrame)) * uDensityScale;
  float coverage = smoothstep(0.004, 0.03, d.x + d.y + d.z);
  if (coverage <= 0.0) { return half4(0.0); }
  float3 c = toSrgb(kmMix(float4(d, 0.0)));
  return half4(half3(c) * half(coverage), half(coverage));
}
`;

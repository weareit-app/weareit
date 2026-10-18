// SkSL mirror of mix.ts: Kubelka-Munk mixing of up to four pigments over
// paper, in linear light, plus noise helpers shared by the dot shaders.
export const KM_SKSL = /* sksl */ `
uniform float3 uK0;
uniform float3 uK1;
uniform float3 uK2;
uniform float3 uK3;
uniform float3 uS0;
uniform float3 uS1;
uniform float3 uS2;
uniform float3 uS3;
uniform float3 uPaper;

float3 kmLayer(float3 K, float3 S, float3 rg) {
  S = max(S, float3(1e-6));
  float3 a = 1.0 + K / S;
  float3 b = sqrt(max(a * a - 1.0, float3(1e-12)));
  float3 bs = clamp(b * S, float3(1e-6), float3(30.0));
  float3 e = exp(-2.0 * bs);
  float3 cth = (1.0 + e) / (1.0 - e);
  return (1.0 - rg * (a - b * cth)) / (a - rg + b * cth);
}

float3 kmMix(float4 d) {
  d = max(d, float4(0.0));
  if (d.x + d.y + d.z + d.w <= 0.0) { return uPaper; }
  float3 K = d.x * uK0 + d.y * uK1 + d.z * uK2 + d.w * uK3;
  float3 S = d.x * uS0 + d.y * uS1 + d.z * uS2 + d.w * uS3;
  return kmLayer(K, S, uPaper);
}

float3 toSrgb(float3 c) {
  c = clamp(c, 0.0, 1.0);
  float3 lo = c * 12.92;
  float3 hi = 1.055 * pow(c, float3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(float3(0.0031308), c));
}
`;

export const NOISE_SKSL = /* sksl */ `
float hash21(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float vnoise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + float2(1.0, 0.0));
  float c = hash21(i + float2(0.0, 1.0));
  float d = hash21(i + float2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * vnoise(p);
    p = p * 2.07 + float2(5.3, 1.7);
    amp *= 0.5;
  }
  return v;
}
`;

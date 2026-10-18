import { KM_SKSL, NOISE_SKSL } from "./km.ts";

// Gathering loader (exploration): draws the drops placed by gather.ts. Each
// drop is a small dot-B watercolor drop; drops run together into one dot,
// their pigments marbling where they meet. Six pigment slots: It's three
// (uK0–uK2) and three guest pigments (uK3–uK5) brought by later drops.
//   uDropAn  x, y, radius, merged (0 → 1)
//   uDropBn  slot (0–5), seed, distinct (how much its color stands apart),
//            active (0 → 1, fades out as an old drop retires)
//   uBody    0 → 1  the gathered dot forming
export const GATHER_SKSL = /* sksl */ `
uniform float2 uSize;
uniform float uTime;
uniform float uBody;
uniform float uOpacity;
uniform float3 uGran;
uniform float3 uK4;
uniform float3 uK5;
uniform float3 uS4;
uniform float3 uS5;
uniform float4 uDropA0;
uniform float4 uDropA1;
uniform float4 uDropA2;
uniform float4 uDropA3;
uniform float4 uDropA4;
uniform float4 uDropA5;
uniform float4 uDropA6;
uniform float4 uDropA7;
uniform float4 uDropA8;
uniform float4 uDropA9;
uniform float4 uDropB0;
uniform float4 uDropB1;
uniform float4 uDropB2;
uniform float4 uDropB3;
uniform float4 uDropB4;
uniform float4 uDropB5;
uniform float4 uDropB6;
uniform float4 uDropB7;
uniform float4 uDropB8;
uniform float4 uDropB9;
${KM_SKSL}
${NOISE_SKSL}

float3 km6(float3 a, float3 b) {
  a = max(a, float3(0.0));
  b = max(b, float3(0.0));
  if (a.x + a.y + a.z + b.x + b.y + b.z <= 0.0) { return uPaper; }
  float3 K = a.x * uK0 + a.y * uK1 + a.z * uK2 + b.x * uK3 + b.y * uK4 + b.z * uK5;
  float3 S = a.x * uS0 + a.y * uS1 + a.z * uS2 + b.x * uS3 + b.y * uS4 + b.z * uS5;
  return kmLayer(K, S, uPaper);
}

float3 slotA(float s) {
  return s < 0.5 ? float3(1.0, 0.0, 0.0) : s < 1.5 ? float3(0.0, 1.0, 0.0) : s < 2.5 ? float3(0.0, 0.0, 1.0) : float3(0.0);
}
float3 slotB(float s) {
  return s < 2.5 ? float3(0.0) : s < 3.5 ? float3(1.0, 0.0, 0.0) : s < 4.5 ? float3(0.0, 1.0, 0.0) : float3(0.0, 0.0, 1.0);
}

// One drop: adds to the shape, and to the color it owns. Ownership is read on
// the flowing (warped) position, so color borders swirl like wet paint.
void addDrop(float2 p, float2 pw, float4 a, float4 b,
             inout float field, inout float3 ownA, inout float3 ownB, inout float own,
             inout float strongest, inout float fresh, inout float freshFirst) {
  if (b.w < 0.001) { return; }
  float2 d = p - a.xy;
  float da = atan(d.y, d.x);
  float wob = 1.0 + 0.2 * (fbm(float2(cos(da), sin(da)) * 1.8 + b.y) - 0.5) + 0.05 * (fbm(p * 14.0 + b.y) - 0.5);
  float r = a.z * wob;
  // Shape and color are separate: a drop shapes the outline only until it
  // has run in; after that it only colors the dot. So arrivals don't make the
  // dot swell, and nothing jumps when an old drop is dropped from the list.
  // It also appears and retires gradually (b.w), never all at once.
  float f = exp(-dot(d, d) / (r * r)) * (1.0 - a.w) * b.w;
  field += f;
  strongest = max(strongest, f);
  fresh = max(fresh, f);
  // The first four drops have seeds below 10; arrivals above.
  float arrival = step(9.5, b.y);
  freshFirst = max(freshFirst, f * (1.0 - arrival));
  float2 dw = pw - a.xy;
  float fw = exp(-dot(dw, dw) / (a.z * a.z * 1.3));
  float fw2 = fw * fw;
  float w = fw2 * fw2 * fw2 * (0.05 + 3.0 * b.z * b.z) * (1.0 + 1.5 * arrival) * b.w;
  ownA += slotA(b.x) * w;
  ownB += slotB(b.x) * w;
  own += w;
}

half4 main(float2 xy) {
  float2 p = (xy / uSize) * 2.0 - 1.0;
  float r = length(p);

  // The wash flows slowly, as in dot B.
  float drift = uTime * 0.1;
  float2 pw = p + 0.35 * float2(fbm(p * 1.3 + drift), fbm(p * 1.3 + 5.2 - drift)) - 0.175;

  float field = 0.0;
  float3 ownA = float3(0.0);
  float3 ownB = float3(0.0);
  float own = 0.0;
  float strongest = 0.0;
  float fresh = 0.0;
  float freshFirst = 0.0;
  addDrop(p, pw, uDropA0, uDropB0, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA1, uDropB1, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA2, uDropB2, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA3, uDropB3, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA4, uDropB4, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA5, uDropB5, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA6, uDropB6, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA7, uDropB7, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA8, uDropB8, field, ownA, ownB, own, strongest, fresh, freshFirst);
  addDrop(p, pw, uDropA9, uDropB9, field, ownA, ownB, own, strongest, fresh, freshFirst);

  // The gathered dot: once the first drops have run together, a body of
  // paint holds the shape so later drops run into it.
  float bodyR = 0.62;
  float body = uBody * exp(-r * r / (bodyR * bodyR));
  field += body;
  // Its own colors: It's pigments laid out as in the painted orb, flowing.
  float3 bodyPig = float3(
    0.2 + 0.9 * smoothstep(0.4, -0.7, pw.x),
    0.75 * smoothstep(-0.8, -0.05, pw.x) * smoothstep(0.95, 0.25, pw.x),
    0.65 * smoothstep(0.3, 0.85, pw.x + 0.2 * pw.y));
  float bodyW = body * 0.12;
  ownA += bodyPig / max(bodyPig.x + bodyPig.y + bodyPig.z, 0.001) * bodyW;
  own += bodyW;

  // A ragged painted edge around everything.
  float threshold = 0.4 + 0.05 * (fbm(p * 14.0) - 0.5);
  float share = strongest / max(field, 0.001);
  float meeting = clamp(fresh * 3.0, 0.0, 1.0);
  // Wet drops join as soon as they touch, with no gap.
  threshold -= 0.1 * meeting * exp(-abs(share - 0.5) / 0.2);
  // The first drops are wet while they travel: a feathered edge.
  float wetFirst = clamp(freshFirst * 2.0, 0.0, 1.0);
  float inside = smoothstep(threshold - 0.012 - 0.22 * wetFirst, threshold + 0.006, field);
  if (inside <= 0.0) { return half4(0.0); }
  // Each point is painted mostly by its dominant pigment; pigments mix only
  // near their borders. (A strong pigment such as It's teal would otherwise
  // swallow any new color mixed into it.)
  float3 a = pow(ownA / max(own, 0.00001), float3(2.5));
  float3 b = pow(ownB / max(own, 0.00001), float3(2.5));
  float norm = max(a.x + a.y + a.z + b.x + b.y + b.z, 0.00001);
  a /= norm;
  b /= norm;

  // Where a drop meets the paint before running in, a darker seam.
  // Where drops meet: a ragged line rather than a smooth one, with a pale halo
  // beside it where the water pushed pigment away.
  float ragged = share + 0.09 * (fbm(p * 10.0 + uTime * 0.2) - 0.5);
  float seam = exp(-abs(ragged - 0.5) / 0.035) * meeting;
  float halo = exp(-abs(ragged - 0.5) / 0.13) * meeting;
  // Rim: pigment at the edge of the paint.
  float rim = exp(-max(field - threshold, 0.0) / 0.14);
  // Bloom line inside the gathered dot, as in dot B.
  float depth = clamp((field - threshold) * 1.5, 0.0, 1.0);
  float f = fbm(pw * 1.8 + 11.0) + 0.12 * fbm(pw * 9.0);
  float inBloom = smoothstep(0.52, 0.56, f) * smoothstep(0.1, 0.5, depth);
  float band = exp(-max(0.54 - f, 0.0) / 0.035) * (1.0 - inBloom) * smoothstep(0.1, 0.5, depth);
  float front = uBody * (1.4 * band - 0.5 * inBloom);
  // Paper grain and an uneven wash.
  float paper = 0.6 * vnoise(p * 95.0) + 0.4 * vnoise(p * 38.0);
  float wash = 0.55 + 0.45 * fbm(p * 3.0 + 2.0);
  float lift = 0.38 * wash * (1.0 + 1.5 * rim + front + 0.9 * seam) * (1.0 - 0.35 * halo);
  // Wet paint sits richer and uneven.
  lift *= 1.0 + wetFirst * (0.4 + 1.0 * (fbm(p * 5.0 + uTime * 0.3) - 0.5));
  // New pigments sit a little richer.
  lift *= 1.0 + 0.35 * (b.x + b.y + b.z);
  float grain = 1.0 + uGran.x * (0.5 - paper) * 1.4;
  float3 c = toSrgb(km6(a * lift * grain, b * lift * grain));
  float alpha = inside * uOpacity;
  return half4(half3(c) * half(alpha), half(alpha));
}
`;

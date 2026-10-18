import { DOT_B_SKSL } from "./dot-b.ts";

// Skia's shading language (SkSL) and WebGL's (GLSL ES 3.0) differ mostly in
// type names and the entry point. This turns a dot shader written in SkSL
// into a WebGL fragment shader, so web can draw it without Skia's 3 MB
// runtime. Only shaders without child shaders (images) are supported.
//
// In the result, uSize is in points and uPixelRatio maps the canvas's device
// pixels back to points, with y pointing down as in Skia.
export function skslToGlsl(sksl: string): string {
  if (/uniform\s+shader\b/.test(sksl)) {
    throw new Error("Child shaders are not supported in WebGL dots");
  }
  if (!/half4\s+main\s*\(\s*float2\s+\w+\s*\)/.test(sksl)) {
    throw new Error("Expected `half4 main(float2 xy)`");
  }
  const body = sksl
    .replace(/half4\s+main\s*\(\s*float2\s+(\w+)\s*\)/, "vec4 dotMain(vec2 $1)")
    .replace(/\bfloat([234])\b/g, "vec$1")
    .replace(/\bhalf([234])\b/g, "vec$1")
    .replace(/\bhalf\b/g, "float");
  return `#version 300 es
precision highp float;
uniform float uPixelRatio;
out vec4 fragColor;
${body}
void main() {
  vec2 xy = vec2(gl_FragCoord.x, uSize.y * uPixelRatio - gl_FragCoord.y) / uPixelRatio;
  fragColor = dotMain(xy);
}
`;
}

export const DOT_B_GLSL = skslToGlsl(DOT_B_SKSL);

// A triangle that covers the whole canvas.
export const FULLSCREEN_VERTEX_GLSL = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

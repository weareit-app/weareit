import { describe, expect, it } from "vitest";
import { DOT_B_GLSL, DOT_E_SKSL, skslToGlsl } from "./index.ts";

describe("SkSL to GLSL", () => {
  it("leaves no SkSL-only types or entry point in dot B", () => {
    expect(DOT_B_GLSL).not.toMatch(/\b(float[234]|half[234]?)\b/);
    expect(DOT_B_GLSL).toMatch(/^#version 300 es/);
    expect(DOT_B_GLSL).toContain("vec4 dotMain(vec2 xy)");
    expect(DOT_B_GLSL).toContain("fragColor = dotMain(xy);");
  });

  it("keeps every uniform dot B needs", () => {
    for (const name of [
      "uSize",
      "uTime",
      "uBloom",
      "uDry",
      "uBreathe",
      "uSeed",
      "uOpacity",
      "uGran",
      "uK0",
      "uS3",
      "uPaper",
    ]) {
      expect(DOT_B_GLSL).toMatch(new RegExp(`uniform \\w+ ${name};`));
    }
  });

  it("refuses shaders that sample images", () => {
    expect(() => skslToGlsl(DOT_E_SKSL)).toThrow(/Child shaders/);
  });
});

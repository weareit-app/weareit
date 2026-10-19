import { gatherAt } from "@it/watercolor/gather";
import { PALETTES } from "@it/watercolor/palettes";
import {
  FULLSCREEN_VERTEX_GLSL,
  GATHER_SKSL,
  cyclePaletteUniforms,
  gatherUniforms,
  paletteUniforms,
  skslToGlsl,
} from "@it/watercolor/shaders";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { AnimatedPaintedOrb } from "./animated-painted-orb";
import { DOT_TEST_ID, dotAccessibility } from "./types";

const GLSL = skslToGlsl(GATHER_SKSL);
// With reduced motion: the gathered dot, still.
const STILL_AT_MS = 3600;

export interface GatherDotProps {
  size: number;
  // Without a label the dot is decorative and hidden from assistive tech.
  accessibilityLabel?: string;
}

// The gathering loader on web, drawn with the browser's WebGL (no Skia):
// drops of It's colors gather into one dot, then new drops keep arriving with
// sunrise and dusk colors (packages/watercolor/src/gather.ts). Falls back to
// the painted orb if WebGL is unavailable.
export function GatherDot({ size, accessibilityLabel }: GatherDotProps) {
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);
  return (
    <View
      style={{ width: size, height: size }}
      pointerEvents="none"
      testID={DOT_TEST_ID}
      {...dotAccessibility(accessibilityLabel)}
    >
      {failed ? (
        <AnimatedPaintedOrb size={size} motion="bloom-once" />
      ) : (
        <GatherCanvas size={size} onFail={onFail} />
      )}
    </View>
  );
}

function GatherCanvas({ size, onFail }: { size: number; onFail: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();
  const ratio =
    typeof window === "undefined"
      ? 1
      : Math.min(window.devicePixelRatio || 1, 3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    });
    if (!canvas || !gl) {
      onFail();
      return;
    }
    const make = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = make(gl.VERTEX_SHADER, FULLSCREEN_VERTEX_GLSL);
    const fs = make(gl.FRAGMENT_SHADER, GLSL);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      onFail();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      onFail();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const it = paletteUniforms(PALETTES["it-orb"]);
    const guests = [
      paletteUniforms(PALETTES.sunrise),
      paletteUniforms(PALETTES.dusk),
    ];
    gl.uniform2f(at("uSize"), size, size);
    gl.uniform1f(at("uPixelRatio"), ratio);

    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const elapsed = reduce ? STILL_AT_MS : now - start;
      const g = gatherAt(elapsed);
      const u = gatherUniforms(
        it,
        cyclePaletteUniforms(guests, g.guest),
        g.drops,
      );
      for (const [name, value] of Object.entries(u)) {
        if (value.length === 4) gl.uniform4fv(at(name), value);
        else gl.uniform3fv(at(name), value);
      }
      gl.uniform1f(at("uTime"), elapsed / 1000);
      gl.uniform1f(at("uBody"), g.body);
      gl.uniform1f(at("uOpacity"), Math.min(elapsed / 300, 1));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    draw(start);
    return () => {
      cancelAnimationFrame(frame);
      // Free the GPU context: browsers allow only a few per page.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [size, ratio, reduce, onFail]);

  return createElement("canvas", {
    ref: canvasRef,
    width: Math.round(size * ratio),
    height: Math.round(size * ratio),
    style: { width: size, height: size, display: "block" },
  });
}

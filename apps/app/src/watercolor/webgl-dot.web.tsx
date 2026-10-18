import {
  BLOOM_MS,
  SETTLED,
  dotMotionAt,
  type DotMotion,
} from "@it/watercolor/motion";
import { PALETTES, type PaletteId } from "@it/watercolor/palettes";
import {
  DOT_B_GLSL,
  FULLSCREEN_VERTEX_GLSL,
  paletteUniforms,
} from "@it/watercolor/shaders";
import { createElement, useEffect, useRef } from "react";
import { useReducedMotion } from "react-native-reanimated";

// Dot B drawn with the browser's own WebGL: the same shader as iOS, translated
// from SkSL, so web gets the generated dot for a few KB instead of Skia's
// 3 MB runtime. Calls onFail if WebGL or the shader is unavailable.

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function buildProgram(gl: WebGL2RenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, FULLSCREEN_VERTEX_GLSL);
  const fs = compile(gl, gl.FRAGMENT_SHADER, DOT_B_GLSL);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function WebGLDot({
  size,
  palette,
  motion,
  seed,
  onFail,
}: {
  size: number;
  palette: PaletteId;
  motion: DotMotion;
  seed: number;
  onFail: () => void;
}) {
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
      antialias: false,
      preserveDrawingBuffer: true,
    });
    const program = gl ? buildProgram(gl) : null;
    if (!canvas || !gl || !program) {
      onFail();
      return;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const pal = paletteUniforms(PALETTES[palette]);
    for (const [name, value] of Object.entries(pal)) {
      gl.uniform3fv(at(name), value);
    }
    gl.uniform2f(at("uSize"), size, size);
    gl.uniform1f(at("uPixelRatio"), ratio);
    gl.uniform1f(at("uSeed"), seed);
    const uTime = at("uTime");
    const uBloom = at("uBloom");
    const uDry = at("uDry");
    const uBreathe = at("uBreathe");
    const uOpacity = at("uOpacity");

    const moving = motion !== "still" && !reduce;
    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const elapsed = now - start;
      const m = moving ? dotMotionAt(motion, elapsed) : SETTLED;
      gl.uniform1f(uTime, elapsed / 1000);
      gl.uniform1f(uBloom, m.bloom);
      gl.uniform1f(uDry, m.dry);
      gl.uniform1f(uBreathe, m.breathe);
      gl.uniform1f(uOpacity, m.opacity);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const done = !moving || (motion === "bloom-once" && elapsed > BLOOM_MS);
      if (!done) frame = requestAnimationFrame(draw);
    };
    draw(start);

    return () => {
      cancelAnimationFrame(frame);
      // Free the GPU context: browsers allow only a few per page.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [size, palette, motion, seed, reduce, ratio, onFail]);

  return createElement("canvas", {
    ref: canvasRef,
    width: Math.round(size * ratio),
    height: Math.round(size * ratio),
    style: { width: size, height: size, display: "block" },
  });
}

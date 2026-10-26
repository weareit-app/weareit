# 2026-10-17

Founder chose dot B on web too. Web draws it with the browser's own WebGL (the same shader, translated from SkSL; a few KB), not with Skia's web runtime, so the 1 MB web budget holds. The painted orb remains the fallback where WebGL is unavailable.

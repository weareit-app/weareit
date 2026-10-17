# Quickstart: validating the watercolor dot (007)

How to prove each part works. Details: `contracts/`, `data-model.md`, `research.md`.

## Prerequisites

- `pnpm install` at the repo root; Skia installed in `apps/app` via `npx expo install @shopify/react-native-skia`.
- An iPhone 12 (or the oldest supported iPhone available) with a fresh dev-client build: `pnpm ios`.
- A mid-range laptop with current Chrome and Safari.

## 1. Paint the Option E dots

```bash
pnpm --filter @it/watercolor-sim paint -- --id orb-01 --seed 1729
```

Expected: `apps/app/assets/watercolor/orb-01/{manifest.json,atlas.png}` written; re-running with the same seed produces a byte-identical atlas; the manifest validates (`pnpm test:unit`).

## 2. Unit tests (packages/watercolor)

```bash
pnpm test:unit
```

Expected: K-M mixer turns blue + yellow pigments into a green (hue between them, darker than either tint); `it-orb` and `rose-violet` pass the visibility check; a near-white pigment fails it; manifest schema accepts the sample and rejects bad frame counts.

## 3. Fidelity proof (founder)

Run the app in development and open `/lab/watercolor` on iPhone and on the laptop browser.

Expected: painted orb, B and E side by side at the same size; palette and still/loader toggles work; "Measure" reports p99 and max frame time for one large and thirty small dots per approach; web shows the extra download and whether it fits 1 MB. Copy results into `proof/results.md`; founder records B, E or neither with the date.

## 4. Component tests (jest-expo)

```bash
pnpm test:expo
```

Expected: `WatercolorLoader` hidden under 300 ms, shown with "Loading…" after; dot hidden from accessibility, text announced; reduced motion renders the still frame; failure to load assets renders the painted orb; `StepBloom` not rendered with reduced motion.

## 5. In the app (web e2e + manual iPhone)

```bash
pnpm test:e2e
```

Expected on web (Playwright, throttled network): welcome screen shows the painted orb immediately and "Get started" works at once; content pages show "Loading…" with the animated orb, then content; error shows retry and no dot; onboarding forward and back still works; no CanvasKit request on these routes.

Manual on iPhone: welcome dot blooms once and rests completely still; loader breathes with no seam; corner bloom on each step; with Settings → Accessibility → Motion → Reduce Motion on, nothing moves; VoiceOver reads "Loading…" once and the welcome mark label, and skips the corner dot.

## 6. Performance and size before/after

Expected: first onboarding screen load time on web unchanged (compare before/after on the same device and connection); web bundle size change ≤ the animated-orb code only; iOS binary growth recorded in `proof/results.md`.

## 7. People check (before shipping)

Show the loader and welcome dot to 3–5 people; record anonymous answers in `proof/results.md` (research R10). Resolve any reading of the motion as anxious, broken or slow.

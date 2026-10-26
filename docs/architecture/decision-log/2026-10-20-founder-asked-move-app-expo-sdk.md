# 2026-10-20

Founder asked to move the app to Expo SDK 58 (weareit-app/weareit#79, a draft until after the Oct 26 launch), mainly for per-route web bundles. Expo Router async routes are limited to web production builds, so development keeps one bundle. The stack is unchanged: same Expo Router, NativeWind pair and Skia, at SDK 58's versions (`docs/architecture/dependency-policy.md`).

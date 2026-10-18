# Dependency versions

Dependencies are pinned so contributors install the same workspace. Refresh them against the owning framework's compatibility data; do not assume the registry's newest version is compatible with Expo.

## Expo and native packages

The app is on Expo SDK 57.0.30 (expo-router 57.0.28; updated with `expo install --fix` on 2026-10-17). SDK 57 is the current stable line; SDK 58 is in beta. `expo install --fix` selected the SDK-compatible Expo Router and native package versions, and `expo install --check` reports the app dependencies are up to date. Keep React 19.2.3 and React Native 0.86.3 aligned with SDK 57. Do not independently upgrade them to newer registry releases; move them with an Expo SDK update.

`@shopify/react-native-skia` 2.6.2 was selected by `expo install` for SDK 57 (2026-10-17) for the watercolor dot (spec 007; approved in `decisions.md`). Its postinstall only copies the prebuilt Skia libraries from the `react-native-skia-*` packages, so it is allowed in `pnpm-workspace.yaml` `allowBuilds`. It is used on iOS only in v0.1; web loads it solely inside the development lab route.

NativeWind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 are an intentional prerelease pair. Keep their exact versions together. Tailwind and its PostCSS plugin are kept on the same current 4.x version. `lightningcss` remains pinned at 1.30.1 as a compatibility override for this NativeWind/react-native-css setup; change that pin only after validating the styling pipeline on web and iOS.

`expo-font` was added with `expo install`. The `@expo-google-fonts/bitter` and `@expo-google-fonts/inter` font packages are pinned at 0.4.2; changing them changes the font files the app ships, so check the type on web and iOS after a refresh (see `docs/architecture/typography.md`).

## Other toolchain pins

- Prettier 3.9.10 and Turborepo 2.11.8 are current releases within their existing major versions.
- Zod 4.6.7 and Zustand 5.0.15 are current releases within their existing major versions.
- TypeScript remains at 5.9.3, the latest 5.x release. Do not adopt TypeScript 7 as a major toolchain change until Expo and workspace tooling compatibility is established.
- pnpm remains pinned to 11.25.0 for reproducible contributor installs. A pnpm major upgrade should include a lockfile review.

The Expo CLI's dependency resolver owns SDK-specific package versions. Re-run `expo install --check` after dependency changes. `pnpm outdated` is useful for finding candidates, but its `Latest` column is not an Expo compatibility guarantee. pnpm added exact-version entries to `minimumReleaseAgeExclude` for Expo packages selected by the CLI because those releases were newer than pnpm's release-age window at install time.


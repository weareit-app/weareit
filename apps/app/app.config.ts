// Expo's app config. Importing another TypeScript file needs the `tsx/cjs`
// hook (docs.expo.dev "Using TypeScript", "app.config.js", checked
// 2026-10-25). Importing `./src/env` parses the public variables, so every
// Expo command, `expo export` included, fails on a bad value.
import "tsx/cjs";
import type { ExpoConfig } from "expo/config";
import "./src/env";

const config: ExpoConfig = {
  name: "We Are It",
  slug: "weareit",
  scheme: "weareit",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  web: {
    output: "static",
  },
  plugins: [
    [
      "expo-router",
      {
        asyncRoutes: {
          web: "production",
          default: false,
        },
      },
    ],
    "expo-sqlite",
    "expo-font",
    "expo-secure-store",
    "expo-status-bar",
  ],
  experiments: {
    typedRoutes: true,
  },
  ios: {
    bundleIdentifier: "app.weareit",
    appleTeamId: "N9PZ6BA6J6",
  },
};

export default config;

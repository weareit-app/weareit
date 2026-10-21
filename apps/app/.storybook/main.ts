import type { StorybookConfig } from "@storybook/react-native-web-vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

// Component previews on web, for reviewing component changes without
// walking the app (docs/architecture/storybook.md). Stories sit next to
// their components as *.stories.tsx.
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      modulesToTranspile: [
        "nativewind",
        "react-native-css",
        "react-native-reanimated",
        "react-native-worklets",
        "lucide-react-native",
      ],
      pluginReactOptions: {
        // NativeWind's Babel preset rewrites react-native imports to
        // className-aware wrappers, as Metro does for the app (react-native-css
        // 3.1.0-rc.0 src/babel/import-plugin.ts, read 2026-10-20).
        babel: { presets: ["nativewind/babel"] },
      },
    },
  },
  core: { disableTelemetry: true },
  // react-native-svg 15.16.0's web code imports `@react-native/assets-registry/registry`,
  // which react-native 0.88.0 no longer depends on (its package.json, checked
  // 2026-10-20). Metro resolves it for the app; here it goes to react-native-web's
  // registry, which has the same getAssetByID.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@react-native/assets-registry/registry":
            "react-native-web/dist/modules/AssetRegistry",
          // Vite can't load expo-router; links render as plain anchors.
          "expo-router": join(
            dirname(fileURLToPath(import.meta.url)),
            "expo-router-stub.tsx",
          ),
        },
      },
    }),
};

export default config;

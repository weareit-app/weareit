import type { StorybookConfig } from "@storybook/react-native-web-vite";

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
        // className-aware wrappers, as Metro does for the app.
        babel: { presets: ["nativewind/babel"] },
      },
    },
  },
  core: { disableTelemetry: true },
};

export default config;

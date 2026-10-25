import "../global.css";
import "./storybook.css";
import type { Decorator, Preview } from "@storybook/react-native-web-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { View } from "react-native";
import { applyColorScheme } from "../src/theme/apply-color-scheme.web";

// Light or dark from the toolbar, applied the way the app's theme switch
// applies it on web. Stories are padded unless they set `padded: false`
// (whole pages bring their own).
const withTheme: Decorator = (Story, { globals, parameters }) => (
  <Themed
    scheme={globals.theme === "dark" ? "dark" : "light"}
    padded={parameters.padded !== false}
  >
    <Story />
  </Themed>
);

function Themed({
  scheme,
  padded,
  children,
}: {
  scheme: "light" | "dark";
  padded: boolean;
  children: ReactNode;
}) {
  useEffect(() => applyColorScheme(scheme), [scheme]);
  return <View className={padded ? "p-6" : ""}>{children}</View>;
}

// Stories get their data as props; this only keeps components that read
// TanStack Query from throwing. Nothing is fetched.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, enabled: false } },
});
const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

const preview: Preview = {
  decorators: [withTheme, withQueryClient],
  globalTypes: {
    theme: {
      description: "Light or dark",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
};

export default preview;

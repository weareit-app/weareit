import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CornerControls } from "./corner-controls";

// Pinned to the top-right corner of a screen-sized frame, as in the app.
const meta = {
  component: CornerControls,
  parameters: { padded: false },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View className="h-40 w-full bg-paper-sunk">
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof CornerControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

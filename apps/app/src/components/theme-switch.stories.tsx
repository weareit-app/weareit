import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { ThemeSwitch } from "./theme-switch";

// The switch reads and sets the app's theme store, not the toolbar's theme.
const meta = {
  component: ThemeSwitch,
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

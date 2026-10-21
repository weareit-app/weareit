import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { WatercolorLoader } from "./watercolor-loader";

// The loader appears after a short delay, so quick loads don't flash it.
const meta = {
  component: WatercolorLoader,
  args: { size: 56 },
} satisfies Meta<typeof WatercolorLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsShipped: Story = {};

export const Large: Story = { args: { size: 200 } };

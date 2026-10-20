import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { BrandMark } from "./brand-mark";
import { IT_MARK, WE_ARE_IT_MARK } from "./marks";

const meta = {
  component: BrandMark,
  args: { mark: WE_ARE_IT_MARK, maxWidth: 240, maxHeight: 170, living: false },
  argTypes: { mark: { control: false } },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeAreIt: Story = {};

export const It: Story = { args: { mark: IT_MARK, label: "It" } };

// As on the onboarding pages (76 × 54).
export const OnboardingSize: Story = { args: { maxWidth: 76, maxHeight: 54 } };

export const Living: Story = { args: { living: true } };

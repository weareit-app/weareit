import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { fn } from "storybook/test";
import { ChoiceCard } from "./choice-card";

const meta = {
  component: ChoiceCard,
  args: {
    title: "Procrastination",
    description: "I put things off, even the things I care about.",
    selected: false,
    onPress: fn(),
  },
} satisfies Meta<typeof ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};

export const Selected: Story = { args: { selected: true } };

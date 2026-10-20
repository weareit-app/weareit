import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { fn } from "storybook/test";
import { personalPain } from "../stories/content";
import { ChoiceCard } from "./choice-card";

const procrastination = personalPain("procrastination");

const meta = {
  component: ChoiceCard,
  args: {
    title: procrastination.title,
    description: procrastination.description,
    selected: false,
    onPress: fn(),
  },
} satisfies Meta<typeof ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};

export const Selected: Story = { args: { selected: true } };

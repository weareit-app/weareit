import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { firstAction } from "../stories/content";
import { FirstActionCard } from "./first-action-card";

const meta = {
  component: FirstActionCard,
  args: { action: firstAction((a) => a.evidence === "practical") },
} satisfies Meta<typeof FirstActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallFirstStep: Story = {};

export const IdeaToExplore: Story = {
  args: { action: firstAction((a) => a.evidence === "candidate") },
};

export const WithSafetyNote: Story = {
  args: { action: firstAction((a) => a.safetyNote !== undefined) },
};

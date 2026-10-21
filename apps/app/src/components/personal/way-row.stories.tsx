import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { fn } from "storybook/test";
import { fixOfKind } from "../../stories/content";
import { WayRow } from "./way-row";

const meta = {
  component: WayRow,
  args: {
    fix: fixOfKind("once"),
    picked: false,
    openChip: null,
    onToggle: fn(),
    onChip: fn(),
  },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 420 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof WayRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Task: Story = {};

export const Habit: Story = { args: { fix: fixOfKind("habit") } };

export const TakesAGroup: Story = { args: { fix: fixOfKind("group") } };

export const PlannedFeature: Story = {
  args: { fix: fixOfKind("feature", "planned") },
};

// The content package has no Shipped, In Progress or Exploring fix yet.
const withStatus = (
  featureStatus: "shipped" | "in-progress" | "exploring",
) => ({
  ...fixOfKind("feature", "planned"),
  featureStatus,
});

export const ShippedFeature: Story = {
  args: { fix: withStatus("shipped"), openChip: "type" },
};

export const InProgressFeature: Story = {
  args: { fix: withStatus("in-progress"), openChip: "status" },
};

export const ExploringFeature: Story = {
  args: { fix: withStatus("exploring") },
};

export const IdeaFeature: Story = {
  args: { fix: fixOfKind("feature", "idea") },
};

export const Picked: Story = { args: { picked: true } };

export const TypeExplained: Story = { args: { openChip: "type" } };

export const StatusExplained: Story = {
  args: { fix: fixOfKind("feature", "planned"), openChip: "status" },
};

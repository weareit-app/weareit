import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { createRef } from "react";
import { View, type ViewInstance } from "react-native";
import { fn } from "storybook/test";
import {
  contentFixes,
  fixDreamLinks,
  personalPain,
} from "../../stories/content";
import { PainRow } from "./pain-row";

// Anxiety is a pain with stage art, futures and ways in the content package.
const anxiety = personalPain("anxiety");
const [steady, calm] = anxiety.dreams;

const meta = {
  component: PainRow,
  args: {
    pain: anxiety,
    dreams: anxiety.dreams,
    selected: false,
    open: false,
    path: undefined,
    fixes: new Map(contentFixes.map((fix) => [fix.id, fix])),
    fixDreamLinks,
    fixOrder: contentFixes.map((fix) => fix.id),
    focusDreamId: undefined,
    openChip: null,
    rowRef: createRef<ViewInstance>(),
    onCheck: fn(),
    onRowPress: fn(),
    onToggleDream: fn(),
    onToggleFix: fn(),
    onChip: fn(),
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 560 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PainRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Checked: Story = { args: { selected: true } };

export const Open: Story = { args: { selected: true, open: true } };

export const OpenWithFuturePicked: Story = {
  args: {
    selected: true,
    open: true,
    path: { painId: anxiety.id, dreamIds: [steady!.id], fixIds: [] },
    focusDreamId: steady!.id,
  },
};

export const SummaryWithoutPlan: Story = {
  args: {
    selected: true,
    path: { painId: anxiety.id, dreamIds: [steady!.id], fixIds: [] },
  },
};

export const SummaryWithPlan: Story = {
  args: {
    selected: true,
    path: {
      painId: anxiety.id,
      dreamIds: [steady!.id, calm!.id],
      fixIds: [
        "find-affordable-counseling",
        "daily-wind-down",
        "check-ins-with-someone-who-gets-it",
      ],
    },
  },
};

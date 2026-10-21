import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";
import { View } from "react-native";
import { expect, fn, userEvent, within } from "storybook/test";
import { featureStatuses, type ContentFix } from "@it/content/graph-schema";
import { contentFixes, fixOfKind } from "../../stories/content";
import { FeatureStatusEditor } from "./feature-status-editor";

const planned: ContentFix = {
  ...fixOfKind("feature", "planned"),
  statusChangedOn: "2026-09-01",
  statusNote: "Decided to build this after launch.",
};

// One Feature fix per status, so every tag shows selected once.
const everyStatus: ContentFix[] = featureStatuses.map(
  (featureStatus, index) => ({
    ...planned,
    id: `${planned.id}-${featureStatus}`,
    title: `${planned.title} (${featureStatus})`,
    featureStatus,
    sortOrder: index,
  }),
);

const meta = {
  component: FeatureStatusEditor,
  args: {
    fixes: contentFixes,
    savedFixes: contentFixes,
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 560 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FeatureStatusEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromContent: Story = {};

export const EveryStatus: Story = {
  args: { fixes: everyStatus, savedFixes: everyStatus },
};

export const NoFeatures: Story = {
  args: {
    fixes: contentFixes.filter(({ kind }) => kind !== "feature"),
    savedFixes: contentFixes.filter(({ kind }) => kind !== "feature"),
  },
};

export const MistypedDate: Story = {
  args: {
    fixes: [{ ...planned, statusChangedOn: "20 Oct" }],
    savedFixes: [planned],
  },
};

// Editable, as in the CMS: changing the status without a new note shows the
// refusal the save would give.
function Editable({ saved }: { saved: ContentFix[] }) {
  const [fixes, setFixes] = useState(saved);
  return (
    <FeatureStatusEditor
      fixes={fixes}
      savedFixes={saved}
      onChange={(fixId, patch) =>
        setFixes((current) =>
          current.map((fix) => (fix.id === fixId ? { ...fix, ...patch } : fix)),
        )
      }
    />
  );
}

export const StatusChangedWithoutNote: Story = {
  args: { fixes: [planned], savedFixes: [planned] },
  render: (args) => <Editable saved={[...args.savedFixes]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("In Progress"));
    await expect(
      await canvas.findByText(
        "Add a note saying what changed before changing the status.",
      ),
    ).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { expect, fn, userEvent, within } from "storybook/test";
import type { ContentFix, ContentRoadmapItem } from "@it/domain/content";
import { contentFixes } from "../../stories/content";
import { RoadmapEditor, type RoadmapContent } from "./roadmap-editor";

// Items from the roadmap outline (openspec/changes/public-pages/outlines/
// roadmap.md); the founder writes the published lines in the CMS.
const findPeople: ContentRoadmapItem = {
  id: "find-people",
  title: "Find people who want the same future",
  line: "Meet people who picked the futures you picked.",
  status: "idea",
  statusChangedOn: "2026-10-19",
  statusNote: "Suggested in the feature list.",
  sortOrder: 0,
};
const spanish: ContentRoadmapItem = {
  id: "use-it-in-spanish",
  title: "Use It in Spanish",
  line: "Every page and pain in Spanish.",
  status: "planned",
  statusChangedOn: "2026-10-19",
  statusNote: "Decided to build it after launch.",
  sortOrder: 1,
};

// The first Feature fix is connected to the first item and takes its status.
const [firstFeature] = contentFixes.filter(({ kind }) => kind === "feature");
const connected = (fix: ContentFix): ContentFix => {
  if (fix.id !== firstFeature?.id) return fix;
  const {
    featureStatus: _status,
    statusChangedOn: _date,
    statusNote: _note,
    ...rest
  } = fix;
  return { ...rest, roadmapItemId: findPeople.id };
};
const saved: RoadmapContent = {
  roadmapItems: [findPeople, spanish],
  fixes: contentFixes.map(connected),
};

const meta = {
  component: RoadmapEditor,
  args: { content: saved, saved, onChange: fn() },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 640 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof RoadmapEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const openItem =
  (title: string) =>
  async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByText(title));
  };

export const Empty: Story = {
  args: {
    content: { roadmapItems: [], fixes: contentFixes },
    saved: { roadmapItems: [], fixes: contentFixes },
  },
};

export const Items: Story = {};

export const ItemWithConnectedFix: Story = {
  play: async (context) => {
    await openItem(findPeople.title)(context);
    await expect(
      within(context.canvasElement).getByText(`Stable ID: ${findPeople.id}`),
    ).toBeVisible();
  },
};

export const StatusChangeRefused: Story = {
  args: {
    content: {
      ...saved,
      roadmapItems: [{ ...findPeople, status: "exploring" }, spanish],
    },
  },
  play: async (context) => {
    await openItem(findPeople.title)(context);
    await expect(
      within(context.canvasElement).getByText(
        "Add a note saying what changed before changing the status.",
      ),
    ).toBeVisible();
  },
};

// `name` keeps the title Storybook gave the old export, DateNotACalendarDate.
export const InvalidStatusDate: Story = {
  name: "Date Not A Calendar Date",
  args: {
    content: {
      ...saved,
      roadmapItems: [findPeople, { ...spanish, statusChangedOn: "20 Oct" }],
    },
  },
  play: async (context) => {
    await openItem(spanish.title)(context);
    await expect(
      within(context.canvasElement).getByText(
        "Write the status date as year-month-day, like 2026-10-20.",
      ),
    ).toBeVisible();
  },
};

export const NewItem: Story = {
  args: {
    content: {
      ...saved,
      roadmapItems: [
        ...saved.roadmapItems,
        {
          id: "new-roadmap-item",
          title: "New roadmap item",
          line: "Describe this work in one line.",
          status: "idea",
          sortOrder: 2,
        },
      ],
    },
  },
  play: async (context) => {
    await openItem("New roadmap item")(context);
    await expect(
      within(context.canvasElement).getByLabelText("Stable ID"),
    ).toBeVisible();
  },
};

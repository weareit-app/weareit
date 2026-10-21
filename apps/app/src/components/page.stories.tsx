import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { fn } from "storybook/test";
import { personalPain } from "../stories/content";
import { ChoiceCard } from "./choice-card";
import { Page } from "./page";

const procrastination = personalPain("procrastination");

// Copy from the Support It page (app/support-it.tsx).
const meta = {
  component: Page,
  args: {
    eyebrow: "Optional support",
    title: "Help keep the work moving.",
    description:
      "People can contribute time, ideas, introductions, or money. Supporting It is optional and does not unlock a better version of the product.",
    children: (
      <ChoiceCard
        title={procrastination.title}
        description={procrastination.description}
        selected={false}
        onPress={fn()}
      />
    ),
  },
  // Page brings its own padding and paper.
  parameters: { padded: false },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reading: Story = {};

export const InterfaceDescription: Story = {
  args: { descriptionStyle: "interface" },
};

export const WithBrandMark: Story = { args: { brand: true } };

export const TitleOnly: Story = {
  render: ({ title, children }) => <Page title={title}>{children}</Page>,
};

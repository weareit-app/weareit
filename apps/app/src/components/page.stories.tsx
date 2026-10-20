import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text } from "./text";
import { Page } from "./page";

const meta = {
  component: Page,
  args: {
    eyebrow: "For you",
    title: "What weighs on you?",
    description:
      "Pick anything that's been hard lately. Your answers stay on this device.",
    children: <Text className="text-ink-soft">Page content goes here.</Text>,
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

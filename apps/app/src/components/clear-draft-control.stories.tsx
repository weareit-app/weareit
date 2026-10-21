import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { expect, userEvent, within } from "storybook/test";
import { ClearDraftControl } from "./clear-draft-control";

const meta = {
  component: ClearDraftControl,
} satisfies Meta<typeof ClearDraftControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Confirming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByText("Clear saved choices from this device"),
    );
    await expect(
      await canvas.findByText("Clear your saved choices?"),
    ).toBeVisible();
  },
};

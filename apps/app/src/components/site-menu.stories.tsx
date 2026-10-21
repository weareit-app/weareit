import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { expect, userEvent, within } from "storybook/test";
import { SignedInContext } from "../navigation/use-signed-in";
import { SiteMenuButton } from "./site-menu";

const meta = {
  component: SiteMenuButton,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof SiteMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

const openMenu: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const page = within(canvasElement.ownerDocument.body);
  await userEvent.click(page.getByRole("button", { name: "Menu" }));
  await expect(await page.findByText("Contact")).toBeVisible();
};

export const Open: Story = { play: openMenu };

export const OpenSignedIn: Story = {
  decorators: [
    (Story) => (
      <SignedInContext.Provider value>
        <Story />
      </SignedInContext.Provider>
    ),
  ],
  play: openMenu,
};

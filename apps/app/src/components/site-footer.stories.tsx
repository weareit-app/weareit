import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { SignedInContext } from "../navigation/use-signed-in";
import { SiteFooter } from "./site-footer";

// The footer shows on large screens only (md and up), so stories need a
// wide canvas. Only published pages are linked.
const meta = {
  component: SiteFooter,
  parameters: { padded: false },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {};

export const SignedIn: Story = {
  decorators: [
    (Story) => (
      <SignedInContext.Provider value>
        <Story />
      </SignedInContext.Provider>
    ),
  ],
};

import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { fn } from "storybook/test";
import { describeApiFailure } from "@it/api-contract/client";
import { ContentQueryState } from "./content-query-state";

const meta = {
  component: ContentQueryState,
  args: { content: "pains", loading: false, error: null, retry: fn() },
  parameters: { padded: false },
} satisfies Meta<typeof ContentQueryState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { loading: true } };

export const LoadingFutures: Story = {
  args: { content: "futures", loading: true },
};

export const Failed: Story = {
  args: { error: new Error("fetch failed") },
};

export const FailedWithDeveloperDetail: Story = {
  args: {
    error: new Error("fetch failed"),
    // The development address from apps/app/.env.example. Storybook doesn't
    // load the app's environment, so the story passes it in.
    developerDetail: describeApiFailure(
      new TypeError("fetch failed"),
      "http://localhost:3001/rpc",
    ),
  },
};

import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { fn } from "storybook/test";
import { describeApiFailure } from "../api-client";
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
    developerDetail: describeApiFailure(new TypeError("fetch failed")),
  },
};

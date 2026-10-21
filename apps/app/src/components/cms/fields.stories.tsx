import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { fn } from "storybook/test";
import { fixOfKind } from "../../stories/content";
import { Button, Field, RelationPicker, SelectField } from "./fields";

const fix = fixOfKind("feature", "planned");

const meta = {
  component: Field,
  args: {
    label: "Title",
    value: fix.title,
    onChangeText: fn(),
  },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 480 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextField: Story = {};

export const EmptyField: Story = { args: { label: "Status note", value: "" } };

export const MultilineField: Story = {
  args: { label: "Description", value: fix.description, multiline: true },
};

export const Select: Story = {
  render: () => (
    <SelectField
      label="Scope"
      value="personal"
      options={["personal", "world"]}
      onChange={fn()}
    />
  ),
};

export const Relations: Story = {
  render: () => (
    <RelationPicker
      title="Related pains"
      rows={[
        { id: "anxiety", title: "Anxiety" },
        { id: "poor-sleep", title: "Poor sleep" },
        { id: "procrastination", title: "Procrastination" },
      ]}
      selectedIds={["anxiety"]}
      onToggle={fn()}
    />
  ),
};

export const Buttons: Story = {
  render: () => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Save draft" onPress={fn()} />
      <Button title="Planned" selected onPress={fn()} />
      <Button title="Publish" disabled onPress={fn()} />
    </View>
  ),
};

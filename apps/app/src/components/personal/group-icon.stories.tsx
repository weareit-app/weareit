import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { groupIcons } from "../../content/group-icons";
import { Text } from "../text";
import { GroupIcon } from "./group-icon";
import { printLook } from "./riso";

const ids = Object.keys(groupIcons);
const [firstId] = ids;
if (!firstId) throw new Error("There are no group icons.");

const meta = {
  component: GroupIcon,
  args: { id: firstId, size: 96, riso: undefined },
  argTypes: { id: { control: "select", options: ids } },
} satisfies Meta<typeof GroupIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const PrintLook: Story = { args: { riso: printLook } };

// Every icon, so a change to the art or the shared drawing code shows at once.
export const AllIcons: Story = {
  render: (args) => (
    <View className="flex-row flex-wrap gap-4">
      {ids.map((id) => (
        <View key={id} className="w-24 items-center gap-1">
          <GroupIcon {...args} id={id} size={72} />
          <Text className="text-center text-xs text-ink-soft">{id}</Text>
        </View>
      ))}
    </View>
  ),
  args: { riso: printLook },
};

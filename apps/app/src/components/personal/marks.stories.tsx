import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { Text } from "../text";
import { CheckCircle, CheckSquare, Chevron } from "./marks";

function Marks() {
  const rows = [
    {
      name: "CheckCircle",
      off: <CheckCircle checked={false} />,
      on: <CheckCircle checked />,
    },
    {
      name: "CheckSquare",
      off: <CheckSquare checked={false} />,
      on: <CheckSquare checked />,
    },
    { name: "Chevron", off: <Chevron open={false} />, on: <Chevron open /> },
  ];
  return (
    <View className="gap-4">
      <View className="flex-row gap-6">
        <Text className="w-28 text-sm text-ink-soft" />
        <Text className="w-16 text-sm text-ink-soft">Off</Text>
        <Text className="w-16 text-sm text-ink-soft">On</Text>
      </View>
      {rows.map(({ name, off, on }) => (
        <View key={name} className="flex-row items-center gap-6">
          <Text className="w-28 text-sm text-ink">{name}</Text>
          <View className="w-16 items-start">{off}</View>
          <View className="w-16 items-start">{on}</View>
        </View>
      ))}
    </View>
  );
}

const meta = {
  title: "components/personal/marks",
  component: Marks,
} satisfies Meta<typeof Marks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllMarks: Story = {};

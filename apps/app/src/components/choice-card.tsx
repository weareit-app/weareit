import { Image, type ImageSourcePropType, Pressable, View } from "react-native";
import { Text } from "./text";

type ChoiceCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  illustration?: ImageSourcePropType | undefined;
};

export function ChoiceCard({
  title,
  description,
  selected,
  onPress,
  illustration,
}: ChoiceCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      onPress={onPress}
      className={`min-h-[76px] flex-row items-center gap-4 border-b border-rule py-3 ${selected ? "bg-tide-wash" : "bg-paper"}`}
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${selected ? "border-tide" : "border-ink-faint"}`}
      >
        {selected ? <View className="h-3 w-3 rounded-full bg-tide" /> : null}
      </View>
      {illustration ? (
        <View className="relative h-[72px] w-[72px] overflow-hidden bg-white">
          <Image
            source={illustration}
            resizeMode="contain"
            accessibilityLabel={`${title} illustration`}
            style={{
              position: "absolute",
              top: -28,
              left: -28,
              width: 128,
              height: 128,
            }}
          />
        </View>
      ) : null}
      <View className="flex-1 gap-1">
        <Text className="font-ui-semibold text-base text-ink">{title}</Text>
        <Text className="font-ui text-[15px] leading-5 text-ink-soft">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

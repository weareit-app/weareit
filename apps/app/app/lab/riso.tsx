import { Redirect } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { GroupIcon } from "../../src/components/personal/group-icon";
import { risoPresets } from "../../src/components/personal/riso";
import { Text } from "../../src/components/text";

// The group icons with and without a riso print look, to choose one
// (prototype, 2026-10-18). Use the corner switch for dark mode. Web only so
// far. Development builds only.
const ICONS = [
  "body",
  "mind",
  "money",
  "work",
  "home",
  "time",
  "people",
  "purpose",
  "government",
  "economy",
  "health",
  "community",
  "fairness",
  "information",
  "environment",
  "safety",
  "kids",
  "making-change",
];

export default function RisoLab() {
  const [preset, setPreset] = useState(2);
  if (!__DEV__) return <Redirect href="/" />;
  const look = risoPresets[preset]!.look;
  return (
    <ScrollView className="flex-1 bg-paper">
      <View className="mx-auto w-full max-w-3xl gap-6 px-5 pb-10 pt-16">
        <Text
          accessibilityRole="header"
          className="font-display text-3xl text-ink"
        >
          Riso look
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {risoPresets.map((p, i) => (
            <Pressable
              key={p.name}
              accessibilityRole="radio"
              accessibilityState={{ checked: i === preset }}
              aria-checked={i === preset}
              onPress={() => setPreset(i)}
              className={`min-h-11 justify-center rounded-full border px-4 ${i === preset ? "border-ink bg-ink" : "border-rule bg-paper-raised"}`}
            >
              <Text
                className={`font-ui-bold text-sm ${i === preset ? "text-paper" : "text-ink"}`}
              >
                {p.name}
              </Text>
            </Pressable>
          ))}
        </View>
        {ICONS.map((id) => (
          <View key={id} className="gap-3">
            <Text className="font-ui-bold text-base capitalize text-ink">
              {id}
            </Text>
            <View className="flex-row flex-wrap items-end gap-6 rounded-2xl border border-rule bg-paper-raised p-5">
              <View className="items-center gap-2">
                <GroupIcon id={id} size={240} />
                <Text className="text-sm text-ink-soft">Clean</Text>
              </View>
              <View className="items-center gap-2">
                <GroupIcon id={id} size={240} riso={look} />
                <Text className="text-sm text-ink-soft">
                  {risoPresets[preset]!.name}
                </Text>
              </View>
              <View className="items-center gap-2">
                <View className="flex-row gap-3">
                  <GroupIcon id={id} size={72} />
                  <GroupIcon id={id} size={72} riso={look} />
                </View>
                <Text className="text-sm text-ink-soft">At 72px</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

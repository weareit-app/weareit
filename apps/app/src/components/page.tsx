import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "./text";

export function Page({
  eyebrow,
  title,
  description,
  descriptionStyle = "reading",
  brand = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** "interface" for instructions about using the screen; "reading" for prose. */
  descriptionStyle?: "reading" | "interface";
  brand?: boolean;
  children: ReactNode;
}) {
  return (
    <ScrollView
      className="flex-1 bg-paper"
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="mx-auto w-full max-w-3xl gap-7 px-5 py-8 md:px-10 md:py-14">
        {brand ? (
          <View className="flex-row items-end self-start">
            <View>
              <Text className="font-display text-sm leading-3 text-[#3865a0]">
                WE
              </Text>
              <Text className="font-display text-xs text-[#7893b5]">ARE</Text>
            </View>
            <Text className="ml-1 font-display text-5xl leading-[42px] text-blue">
              It
            </Text>
          </View>
        ) : null}
        <View className="gap-3">
          {eyebrow ? (
            <Text className="font-ui-semibold text-sm uppercase tracking-[2px] text-blue">
              {eyebrow}
            </Text>
          ) : null}
          <Text
            accessibilityRole="header"
            className="font-display text-4xl leading-tight text-ink md:text-5xl"
          >
            {title}
          </Text>
          {description ? (
            <Text
              className={
                descriptionStyle === "interface"
                  ? "max-w-2xl font-ui text-base leading-6 text-ink"
                  : "max-w-2xl font-body text-lg leading-7 text-ink"
              }
            >
              {description}
            </Text>
          ) : null}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

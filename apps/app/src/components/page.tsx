import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { BrandMark } from "../watercolor/brand-mark";

export function Page({
  eyebrow,
  title,
  description,
  brand = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
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
          <View className="self-start">
            {/* Sized as in the onboarding design (76 × 54, left-aligned). */}
            <BrandMark maxWidth={76} maxHeight={54} />
          </View>
        ) : null}
        <View className="gap-3">
          {eyebrow ? (
            <Text className="text-sm font-semibold uppercase tracking-[2px] text-tide-deep">
              {eyebrow}
            </Text>
          ) : null}
          <Text
            accessibilityRole="header"
            className="font-serif text-4xl font-bold leading-tight text-ink md:text-5xl"
          >
            {title}
          </Text>
          {description ? (
            <Text className="max-w-2xl font-serif text-lg leading-7 text-ink">
              {description}
            </Text>
          ) : null}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

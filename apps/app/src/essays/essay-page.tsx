import type { Essay } from "@it/content/essay-schema";
import { Link, type Href } from "expo-router";
import { View } from "react-native";
import { Page } from "../components/page";
import { Text } from "../components/text";
import { EssayBody } from "./essay-body";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "2026-10-20" → "October 20, 2026", the same on the server and the client.
export function formatEssayDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${months[month! - 1]} ${day}, ${year}`;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      role="heading"
      aria-level={2}
      className="font-heading text-2xl leading-tight text-ink md:text-3xl"
    >
      {children}
    </Text>
  );
}

// The shared essay layout (public-essays): title, the question it answers,
// "last updated", the text, then its sources and dated changes.
export function EssayPage({ essay }: { essay: Essay }) {
  return (
    <Page title={essay.title} description={essay.question}>
      <Text className="-mt-3 text-sm text-ink-soft">
        {`Last updated ${formatEssayDate(essay.updated)}`}
      </Text>
      <View className="gap-5">
        <EssayBody nodes={essay.body} sources={essay.sources} />
      </View>
      {essay.sources.length ? (
        <View className="gap-3 border-t border-rule pt-6">
          <SectionHeading>Sources</SectionHeading>
          <View role="list" className="gap-2">
            {essay.sources.map((source, index) => (
              <View key={source.id} role="listitem" className="flex-row gap-3">
                <Text className="min-w-6 text-base text-ink-soft">
                  {index + 1}.
                </Text>
                <Text className="flex-1 text-base leading-6 text-ink">
                  <Link
                    href={source.url as Href}
                    className="text-tide-deep underline underline-offset-4"
                  >
                    {source.title}
                  </Link>
                  {`. ${source.publisher}${source.date ? `, ${source.date}` : ""}.`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      <View className="gap-3 border-t border-rule pt-6">
        <SectionHeading>Changes</SectionHeading>
        <View role="list" className="gap-3">
          {essay.changes.map((change) => (
            <View
              key={`${change.date} ${change.note}`}
              role="listitem"
              className="gap-1 md:flex-row md:gap-4"
            >
              <Text className="text-sm text-ink-soft md:w-40">
                {formatEssayDate(change.date)}
              </Text>
              <Text className="flex-1 text-base leading-6 text-ink">
                {change.note}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

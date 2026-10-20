import { Link, type Href } from "expo-router";
import { View } from "react-native";
import {
  siteBottomLine,
  siteGroups,
  visibleGroups,
  visibleLinks,
  type SiteLink,
} from "../navigation/site-links";
import { useSignedIn } from "../navigation/use-signed-in";
import { Text } from "./text";

// One link from the shared list. Internal pages route in the app; the
// contact address opens the person's email app.
export function SiteLinkText({
  link,
  className,
  onPress,
}: {
  link: SiteLink;
  className: string;
  onPress?: () => void;
}) {
  return (
    <Link href={link.href as Href} {...(onPress ? { onPress } : {})} asChild>
      <Text role="link" className={className}>
        {link.label}
      </Text>
    </Link>
  );
}

// The footer on large screens, at the end of every page (site-navigation).
// Small screens get the same links from the menu instead.
export function SiteFooter() {
  const signedIn = useSignedIn();
  const groups = visibleGroups(siteGroups, { signedIn });
  const bottom = visibleLinks(siteBottomLine, { signedIn });

  return (
    <View
      role="navigation"
      aria-label="Site"
      className="hidden w-full border-t border-rule bg-paper md:flex"
    >
      <View className="mx-auto w-full max-w-5xl gap-8 px-10 py-10">
        <View className="flex-row flex-wrap gap-x-16 gap-y-8">
          {groups.map((group) => (
            <View key={group.title} className="min-w-36 gap-3">
              <Text
                role="heading"
                aria-level={2}
                nativeID={`footer-${group.title}`}
                className="font-ui-semibold text-sm uppercase tracking-[2px] text-tide-deep"
              >
                {group.title}
              </Text>
              <View
                role="list"
                aria-labelledby={`footer-${group.title}`}
                className="gap-2"
              >
                {group.links.map((link) => (
                  <View key={link.href} role="listitem">
                    <SiteLinkText
                      link={link}
                      className="text-base text-ink underline-offset-4 hover:underline"
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View role="list" className="flex-row flex-wrap gap-x-6 gap-y-2">
          {bottom.map((link) => (
            <View key={link.href} role="listitem">
              <SiteLinkText
                link={link}
                className="text-sm text-ink-soft underline-offset-4 hover:underline"
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

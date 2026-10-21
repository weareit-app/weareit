import { Menu, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  menuExtras,
  siteBottomLine,
  siteGroups,
  visibleGroups,
  visibleLinks,
} from "../navigation/site-links";
import { useSignedIn } from "../navigation/use-signed-in";
import { useTokenColor } from "../theme/use-token-color";
import { SiteLinkText } from "./site-footer";
import { Text } from "./text";

// The menu: on small screens for everyone, and on large screens once signed
// in (site-navigation). It holds the footer's groups and bottom line, plus
// Sign in or Account.
export function SiteMenuButton() {
  const signedIn = useSignedIn();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const ink = useTokenColor("--color-ink", "#1F2021");
  const insets = useSafeAreaInsets();
  const close = () => setOpen(false);

  const groups = visibleGroups(siteGroups, { signedIn });
  const bottom = visibleLinks(siteBottomLine, { signedIn });
  const extras = visibleLinks(menuExtras, { signedIn });

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Menu"
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        aria-haspopup="dialog"
        onPress={() => setOpen(true)}
        hitSlop={8}
        className={`h-11 w-11 items-center justify-center rounded-full ${signedIn ? "" : "md:hidden"}`}
      >
        <Menu aria-hidden size={24} strokeWidth={2.2} color={ink} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={close}
      >
        <View className="flex-1 flex-row justify-end bg-ink/30">
          {/* Tapping outside the panel closes the menu. Pointer only: the
              close button is the keyboard and screen-reader way out. */}
          <Pressable
            aria-hidden
            focusable={false}
            importantForAccessibility="no-hide-descendants"
            className="flex-1"
            onPress={close}
          />
          <View
            role="dialog"
            aria-modal
            aria-label="Menu"
            className="w-full max-w-sm bg-paper"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
          >
            <View className="flex-row justify-end px-3 pt-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={close}
                hitSlop={8}
                className="h-11 w-11 items-center justify-center rounded-full"
              >
                <X aria-hidden size={24} strokeWidth={2.2} color={ink} />
              </Pressable>
            </View>
            <ScrollView contentContainerClassName="gap-8 px-6 pb-10">
              <View role="navigation" aria-label="Site" className="gap-8">
                {groups.map((group) => (
                  <View key={group.title} className="gap-2">
                    <Text
                      role="heading"
                      aria-level={2}
                      className="font-ui-semibold text-sm uppercase tracking-[2px] text-tide-deep"
                    >
                      {group.title}
                    </Text>
                    <View role="list">
                      {group.links.map((link) => (
                        <View key={link.href} role="listitem">
                          <SiteLinkText
                            link={link}
                            onPress={close}
                            className="py-2 text-lg text-ink"
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
                <View role="list" className="gap-1 border-t border-rule pt-6">
                  {[...extras, ...bottom].map((link) => (
                    <View key={link.href} role="listitem">
                      <SiteLinkText
                        link={link}
                        onPress={close}
                        className="py-2 text-base text-ink-soft"
                      />
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

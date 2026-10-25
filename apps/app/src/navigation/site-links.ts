// The one list behind the footer and the menu (public-pages,
// site-navigation). Other changes add their pages here; a link shows only
// once its page is published in the release. Essay links follow their
// essay's `published` front matter.

import { essayPublished } from "@it/content/essays";

export const CONTACT_EMAIL = "hello@weareit.app";

export interface SiteLink {
  label: string;
  href: string;
  /** Who sees it: everyone, or only signed-in or signed-out people. */
  when: "always" | "signed-in" | "signed-out";
  /** Flip to true when the page ships; unpublished links never render. */
  published: boolean;
}

export interface SiteGroup {
  title: string;
  links: SiteLink[];
}

const page = (label: string, href: string, published = false): SiteLink => ({
  label,
  href,
  when: "always",
  published,
});

export const siteGroups: SiteGroup[] = [
  {
    title: "About It",
    links: [
      page("Why", "/why", essayPublished.why),
      page("Principles", "/principles"),
      page("Roadmap", "/roadmap"),
      page("Risks", "/risks"),
    ],
  },
  {
    title: "Research & building",
    links: [
      page("Research", "/research"),
      page("Technology", "/technology"),
      page("AI", "/ai"),
    ],
  },
  {
    title: "The possibilities",
    links: [page("Possibility", "/possibility"), page("Future", "/future")],
  },
  {
    title: "Take part",
    links: [
      // No Support links before signup (founder, spec 009 Q2).
      {
        label: "Support",
        href: "/support-it",
        when: "signed-in",
        published: true,
      },
      { label: "Help", href: "/help", when: "signed-in", published: false },
      page("Contact", `mailto:${CONTACT_EMAIL}`, true),
    ],
  },
];

export const siteBottomLine: SiteLink[] = [
  page("Privacy", "/privacy"),
  page("FAQ", "/faq"),
  page("Licensing", "/licensing", essayPublished.licensing),
  page(CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`, true),
];

// In the menu only, after the groups.
export const menuExtras: SiteLink[] = [
  { label: "Sign in", href: "/signup", when: "signed-out", published: false },
  { label: "Account", href: "/account", when: "signed-in", published: false },
];

/** Whether a page is published in the footer: in a group or the bottom line. */
export function isListedPage(
  href: string,
  groups: SiteGroup[] = siteGroups,
  bottomLine: SiteLink[] = siteBottomLine,
) {
  return [...groups.flatMap((group) => group.links), ...bottomLine].some(
    (link) => link.href === href && link.published,
  );
}

interface Viewer {
  signedIn: boolean;
}

export function visibleLinks(links: SiteLink[], { signedIn }: Viewer) {
  return links.filter(
    (link) =>
      link.published &&
      (link.when === "always" || (link.when === "signed-in") === signedIn),
  );
}

export function visibleGroups(groups: SiteGroup[], viewer: Viewer) {
  return groups
    .map((group) => ({ ...group, links: visibleLinks(group.links, viewer) }))
    .filter((group) => group.links.length > 0);
}

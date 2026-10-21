import {
  CONTACT_EMAIL,
  isListedPage,
  menuExtras,
  siteBottomLine,
  siteGroups,
  visibleGroups,
  visibleLinks,
  type SiteGroup,
} from "../src/navigation/site-links";

const groups: SiteGroup[] = [
  {
    title: "About It",
    links: [
      { label: "Why", href: "/why", when: "always", published: true },
      { label: "Risks", href: "/risks", when: "always", published: false },
    ],
  },
  {
    title: "The possibilities",
    links: [
      { label: "Future", href: "/future", when: "always", published: false },
    ],
  },
  {
    title: "Take part",
    links: [
      {
        label: "Support",
        href: "/support",
        when: "signed-in",
        published: true,
      },
      { label: "Contact", href: "mailto:x", when: "always", published: true },
    ],
  },
];

describe("site links", () => {
  it("counts a page as listed when published in a group or the bottom line", () => {
    const bottomLine = [
      {
        label: "Licensing",
        href: "/licensing",
        when: "always" as const,
        published: true,
      },
      { label: "FAQ", href: "/faq", when: "always" as const, published: false },
    ];
    expect(isListedPage("/why", groups, bottomLine)).toBe(true);
    expect(isListedPage("/licensing", groups, bottomLine)).toBe(true);
    expect(isListedPage("/risks", groups, bottomLine)).toBe(false);
    expect(isListedPage("/faq", groups, bottomLine)).toBe(false);
  });

  it("links only published pages and hides empty groups", () => {
    const shown = visibleGroups(groups, { signedIn: false });
    expect(shown.map((group) => group.title)).toEqual([
      "About It",
      "Take part",
    ]);
    expect(shown[0]!.links.map((link) => link.label)).toEqual(["Why"]);
  });

  it("hides signed-in links when signed out", () => {
    const takePart = visibleGroups(groups, { signedIn: false }).at(-1)!;
    expect(takePart.links.map((link) => link.label)).toEqual(["Contact"]);
  });

  it("shows signed-in links when signed in", () => {
    const takePart = visibleGroups(groups, { signedIn: true }).at(-1)!;
    expect(takePart.links.map((link) => link.label)).toEqual([
      "Support",
      "Contact",
    ]);
  });

  it("shows signed-out links only when signed out", () => {
    const signIn = [
      {
        label: "Sign in",
        href: "/signup",
        when: "signed-out",
        published: true,
      },
    ] as const;
    expect(visibleLinks([...signIn], { signedIn: false })).toHaveLength(1);
    expect(visibleLinks([...signIn], { signedIn: true })).toHaveLength(0);
  });

  it("keeps the four groups in the atlas's order", () => {
    expect(siteGroups.map((group) => group.title)).toEqual([
      "About It",
      "Research & building",
      "The possibilities",
      "Take part",
    ]);
  });

  it("always offers the contact address", () => {
    const signedOut = visibleGroups(siteGroups, { signedIn: false });
    expect(signedOut.flatMap((group) => group.links)).toContainEqual(
      expect.objectContaining({ href: `mailto:${CONTACT_EMAIL}` }),
    );
    expect(visibleLinks(siteBottomLine, { signedIn: false })).toContainEqual(
      expect.objectContaining({ label: CONTACT_EMAIL }),
    );
  });

  it("carries no query string or identifier in any link", () => {
    const all = [
      ...siteGroups.flatMap((group) => group.links),
      ...siteBottomLine,
      ...menuExtras,
    ];
    for (const link of all) expect(link.href).not.toMatch(/[?#]/);
  });
});

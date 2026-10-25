import type * as SiteLinks from "./site-links";

// The real link list, loaded with the essay's `published` front matter set
// either way.
function linksWithWhy(published: boolean) {
  let links!: typeof SiteLinks;
  jest.isolateModules(() => {
    jest.doMock("@it/content/essays", () => ({
      essayPublished: { why: published },
      essays: {},
    }));
    links = require("./site-links") as typeof SiteLinks;
  });
  const about = links
    .visibleGroups(links.siteGroups, { signedIn: false })
    .find((group) => group.title === "About It");
  return about?.links.map((link) => link.href) ?? [];
}

describe("essay links", () => {
  it("lists Why under About It once its essay is published", () => {
    expect(linksWithWhy(true)).toContain("/why");
  });

  it("leaves Why out while its essay is unpublished", () => {
    expect(linksWithWhy(false)).not.toContain("/why");
  });
});

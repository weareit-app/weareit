import { describe, expect, it } from "vitest";
import { storyBase, storyGaps } from "./check-story-coverage.mjs";

describe("storyBase", () => {
  it("drops the extension and any platform suffix", () => {
    expect(storyBase("apps/app/src/components/page.tsx")).toBe(
      "apps/app/src/components/page",
    );
    expect(storyBase("apps/app/src/watercolor/mark-view.web.tsx")).toBe(
      "apps/app/src/watercolor/mark-view",
    );
  });
});

describe("storyGaps", () => {
  it("lists components with no story beside them", () => {
    expect(
      storyGaps({
        tracked: [
          "apps/app/src/components/page.tsx",
          "apps/app/src/components/page.stories.tsx",
          "apps/app/src/components/personal/pain-row.tsx",
          "apps/app/src/watercolor/brand-mark.tsx",
        ],
        allowlist: {},
      }),
    ).toEqual({
      missing: [
        "apps/app/src/components/personal/pain-row",
        "apps/app/src/watercolor/brand-mark",
      ],
      stale: [],
    });
  });

  it("covers platform variants with the base name's story", () => {
    expect(
      storyGaps({
        tracked: [
          "apps/app/src/components/personal/group-icon.tsx",
          "apps/app/src/components/personal/group-icon.web.tsx",
          "apps/app/src/components/personal/group-icon.stories.tsx",
          "apps/app/src/watercolor/webgl-dot.web.tsx",
        ],
        allowlist: {},
      }),
    ).toEqual({ missing: ["apps/app/src/watercolor/webgl-dot"], stale: [] });
  });

  it("ignores files outside the component folders and non-components", () => {
    expect(
      storyGaps({
        tracked: [
          "apps/app/src/components/personal/riso.ts",
          "apps/app/src/components/page.test.tsx",
          "apps/app/src/watercolor/lab/lab-screen.tsx",
          "apps/app/app/index.tsx",
        ],
        allowlist: {},
      }),
    ).toEqual({ missing: [], stale: [] });
  });

  it("accepts allowlisted gaps and flags entries that no longer apply", () => {
    expect(
      storyGaps({
        tracked: [
          "apps/app/src/components/text.tsx",
          "apps/app/src/components/page.tsx",
          "apps/app/src/components/page.stories.tsx",
        ],
        allowlist: {
          "apps/app/src/components/text": "wrapper",
          "apps/app/src/components/page": "now has a story",
          "apps/app/src/components/removed": "component deleted",
        },
      }),
    ).toEqual({
      missing: [],
      stale: [
        "apps/app/src/components/page",
        "apps/app/src/components/removed",
      ],
    });
  });
});

// Fails when a UI component file has no `*.stories.tsx` beside it, so a new
// component can't skip review in Storybook. Platform variants (`foo.web.tsx`)
// share the story of their base name (`foo.stories.tsx`).
// Run from the repo root: `node tools/story-coverage/check-story-coverage.mjs`.
// docs/architecture/storybook.md.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const COMPONENT = /^apps\/app\/src\/(components\/.+|watercolor\/[^/]+)\.tsx$/;
const NOT_A_COMPONENT =
  /\.(stories|test)(\.(web|native|ios|android|node))?\.tsx$/;
const PLATFORM = /\.(web|native|ios|android)$/;

// Components without stories yet, by base path (no platform suffix or `.tsx`).
// Each needs a reason; remove its entry when it gets a story.
export const ALLOWLIST = {
  "apps/app/src/components/personal/pain-explorer":
    "fetches published content itself; stories pass data as props",
  "apps/app/src/components/status-bar-backdrop":
    "draws only on iOS; on web the inset is zero and nothing renders",
  "apps/app/src/components/text":
    "a font-role wrapper over React Native's Text, rendered by every other story",
  "apps/app/src/watercolor/animated-painted-orb":
    "watercolor internal; shown through the BrandMark and WatercolorLoader stories",
  "apps/app/src/watercolor/gather-dot":
    "watercolor internal; shown through the BrandMark and WatercolorLoader stories",
  "apps/app/src/watercolor/mark-loader":
    "used only by the lab's loader route; its parts are shown through the BrandMark story",
  "apps/app/src/watercolor/mark-view":
    "watercolor internal; shown through the BrandMark story",
  "apps/app/src/watercolor/painted-orb":
    "watercolor internal; shown through the BrandMark and WatercolorLoader stories",
  "apps/app/src/watercolor/skia-dot": "iOS only (Skia); Storybook covers web",
  "apps/app/src/watercolor/watercolor-dot":
    "watercolor internal; shown through the BrandMark story",
  "apps/app/src/watercolor/webgl-dot":
    "watercolor internal on web; shown through the BrandMark story",
};

/** @returns {string} the path a component's story is named after, without `.tsx`. */
export function storyBase(path) {
  return path.replace(/\.tsx$/, "").replace(PLATFORM, "");
}

/**
 * @param {{ tracked: string[], allowlist: Record<string, string> }} input repo-relative paths
 * @returns {{ missing: string[], stale: string[] }} component bases with no story and
 *   no allowlist entry, and allowlist entries that have a story or no component.
 */
export function storyGaps({ tracked, allowlist }) {
  const files = new Set(tracked);
  const components = new Set(
    tracked
      .filter((path) => COMPONENT.test(path) && !NOT_A_COMPONENT.test(path))
      .map(storyBase),
  );
  const hasStory = (base) => files.has(`${base}.stories.tsx`);
  return {
    missing: [...components].filter(
      (base) => !hasStory(base) && !(base in allowlist),
    ),
    stale: Object.keys(allowlist).filter(
      (base) => !components.has(base) || hasStory(base),
    ),
  };
}

/** @returns {string[]} one message per gap; empty when every component is covered. */
export function checkRepo(root, allowlist = ALLOWLIST) {
  const tracked = execFileSync("git", ["ls-files"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  const { missing, stale } = storyGaps({ tracked, allowlist });
  return [
    ...missing.map(
      (base) =>
        `${base}.tsx has no ${base}.stories.tsx; add stories (docs/architecture/storybook.md) or an ALLOWLIST entry with a reason`,
    ),
    ...stale.map(
      (base) =>
        `ALLOWLIST entry ${base} has a story or no component; remove it from tools/story-coverage/check-story-coverage.mjs`,
    ),
  ];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(
    "Story coverage: every UI component has stories or an allowlist entry.",
  );
}

// Shows only the components a branch changed: builds Storybook for this
// checkout and for its merge base, screenshots every story in light and dark,
// and writes a report of the stories that look different, are new, were
// removed or fail to render. See docs/architecture/storybook.md.
//
//   pnpm storybook:review              compare with origin/master
//   pnpm storybook:review <ref>        compare with another branch or commit
//   pnpm storybook:review --no-base    screenshot this checkout only

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Browser } from "@playwright/test";

const themes = ["light", "dark"] as const;
type Theme = (typeof themes)[number];
type Shot = {
  id: string;
  title: string;
  name: string;
  theme: Theme;
  file: string;
  error?: string;
};

const appDir = resolve(import.meta.dirname, "..");
const outDir = join(appDir, "storybook-review");
const args = process.argv.slice(2);
const noBase = args.includes("--no-base");
const baseRef = args.find((arg) => !arg.startsWith("--")) ?? "origin/master";

function run(command: string, commandArgs: string[], cwd: string) {
  return execFileSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

function buildStorybook(app: string, out: string, label: string) {
  console.log(`Building Storybook for ${label}…`);
  rmSync(out, { recursive: true, force: true });
  execFileSync("pnpm", ["exec", "storybook", "build", "--quiet", "-o", out], {
    cwd: app,
    stdio: ["ignore", "ignore", "inherit"],
  });
}

const contentTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

async function serve(dir: string): Promise<{ server: Server; url: string }> {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(
      new URL(req.url ?? "/", "http://x").pathname,
    );
    const file = join(dir, path.endsWith("/") ? `${path}index.html` : path);
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "content-type": contentTypes[extname(file)] ?? "application/octet-stream",
    });
    res.end(readFileSync(file));
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  return {
    server,
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
  };
}

// Screenshots every story of a static Storybook build, with motion reduced so
// animated components hold still.
async function shoot(
  browser: Browser,
  staticDir: string,
  shotsDir: string,
): Promise<Shot[]> {
  const { server, url } = await serve(staticDir);
  rmSync(shotsDir, { recursive: true, force: true });
  mkdirSync(shotsDir, { recursive: true });
  const index = (await (await fetch(`${url}/index.json`)).json()) as {
    entries: Record<
      string,
      { id: string; title: string; name: string; type: string }
    >;
  };
  const stories = Object.values(index.entries).filter(
    (entry) => entry.type === "story",
  );
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
    reducedMotion: "reduce",
  });
  const shootOne = async (
    story: (typeof stories)[number],
    theme: Theme,
  ): Promise<Shot> => {
    const file = `${story.id}--${theme}.png`;
    const shot = { id: story.id, title: story.title, name: story.name, theme };
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await page.goto(
        `${url}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`,
      );
      // Settled (rendered and played), failed, or showing Storybook's error
      // screen.
      const phase = await page
        .waitForFunction(
          () => {
            const current = (
              window as {
                __STORYBOOK_PREVIEW__?: {
                  currentRender?: { phase?: string };
                };
              }
            ).__STORYBOOK_PREVIEW__?.currentRender?.phase;
            if (document.body.classList.contains("sb-show-errordisplay"))
              return "errored";
            return ["completed", "finished", "errored", "aborted"].includes(
              current ?? "",
            )
              ? current
              : false;
          },
          undefined,
          { timeout: 15_000 },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => "timed out");
      await page.evaluate(() => document.fonts.ready);
      // Past the loader's delay, so it shows.
      await page.waitForTimeout(400);
      const message = await page.evaluate(
        () => document.querySelector("#error-message")?.textContent ?? null,
      );
      if (phase === "errored")
        errors.unshift(message ?? "Storybook reported an error.");
      else if (phase === "aborted") errors.unshift("The story was aborted.");
      else if (phase === "timed out")
        errors.push("Timed out waiting for the story to render.");
      await page.screenshot({ path: join(shotsDir, file), fullPage: true });
      return {
        ...shot,
        file,
        ...(errors.length > 0 && { error: errors.join("\n") }),
      };
    } catch (error) {
      // The page itself failed (navigation or screenshot): report the story
      // as broken and carry on with the rest.
      errors.unshift(error instanceof Error ? error.message : String(error));
      return { ...shot, file, error: errors.join("\n") };
    } finally {
      await page.close();
    }
  };
  const queue = stories.flatMap((story) =>
    themes.map((theme) => [story, theme] as const),
  );
  const shots: Shot[] = [];
  try {
    // A few pages at a time; the report keeps the stories' order.
    await Promise.all(
      Array.from({ length: 6 }, async () => {
        for (let job = queue.shift(); job; job = queue.shift())
          shots.push(await shootOne(...job));
      }),
    );
  } finally {
    await context.close();
    server.close();
  }
  const order = stories.map((story) => story.id);
  return shots.sort(
    (a, b) =>
      order.indexOf(a.id) - order.indexOf(b.id) ||
      themes.indexOf(a.theme) - themes.indexOf(b.theme),
  );
}

// A build of the merge base, kept between runs: the same base needs building
// only once. A build counts only once it has finished.
function baseBuild(): { sha: string; staticDir: string } | null {
  const root = run("git", ["rev-parse", "--show-toplevel"], appDir);
  const remote = baseRef.includes("/") ? baseRef.split("/")[0]! : null;
  if (remote && run("git", ["remote"], root).split("\n").includes(remote)) {
    try {
      run("git", ["fetch", "--quiet", remote], root);
    } catch {
      console.warn(`Couldn't fetch ${remote}; using the local ${baseRef}.`);
    }
  }
  const sha = run("git", ["merge-base", baseRef, "HEAD"], root);
  const short = sha.slice(0, 12);
  const staticDir = join(outDir, `base-${short}`);
  const done = join(staticDir, ".complete");
  if (existsSync(done)) return { sha, staticDir };

  // A fresh checkout each time: drop what an interrupted run left behind.
  const checkout = join(tmpdir(), `it-storybook-base-${short}`);
  run("git", ["worktree", "prune"], root);
  if (existsSync(checkout)) {
    try {
      execFileSync("git", ["worktree", "remove", "--force", checkout], {
        cwd: root,
        stdio: "ignore",
      });
    } catch {
      // Not a registered worktree, only a leftover folder.
      rmSync(checkout, { recursive: true, force: true });
    }
  }
  run("git", ["worktree", "add", "--quiet", "--detach", checkout, sha], root);
  try {
    const baseApp = join(checkout, relative(root, appDir));
    if (!existsSync(join(baseApp, ".storybook", "main.ts"))) {
      console.log(
        `${baseRef} has no Storybook yet; every story counts as new.`,
      );
      return null;
    }
    console.log(`Installing dependencies for ${baseRef} (${sha.slice(0, 7)})…`);
    execFileSync("pnpm", ["install", "--frozen-lockfile", "--prefer-offline"], {
      cwd: checkout,
      stdio: ["ignore", "ignore", "inherit"],
    });
    buildStorybook(baseApp, staticDir, baseRef);
    writeFileSync(done, sha);
    return { sha, staticDir };
  } finally {
    // Cleanup must not hide an install or build error.
    try {
      run("git", ["worktree", "remove", "--force", checkout], root);
    } catch {
      console.warn(`Couldn't remove the temporary checkout at ${checkout}.`);
    }
  }
}

// A failed story may have no screenshot.
const digest = (file: string) =>
  existsSync(file)
    ? createHash("sha256").update(readFileSync(file)).digest("hex")
    : null;

const escape = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

// The "after" shot faded, with every pixel that differs from "before" in
// magenta, so small changes are easy to find.
async function diffImage(
  browser: Browser,
  before: string,
  after: string,
  out: string,
) {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(
    async ([a, b]) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((done, fail) => {
          const image = new Image();
          image.onload = () => done(image);
          image.onerror = () => fail(new Error("Couldn't read a screenshot."));
          image.src = `data:image/png;base64,${src}`;
        });
      const [first, second] = await Promise.all([load(a!), load(b!)]);
      const width = Math.max(first.width, second.width);
      const height = Math.max(first.height, second.height);
      const pixels = (image: HTMLImageElement) => {
        const canvas = new OffscreenCanvas(width, height);
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, width, height);
      };
      const old = pixels(first).data;
      const diff = pixels(second);
      const now = diff.data;
      for (let i = 0; i < now.length; i += 4) {
        const same =
          old[i] === now[i] &&
          old[i + 1] === now[i + 1] &&
          old[i + 2] === now[i + 2] &&
          old[i + 3] === now[i + 3];
        for (let c = 0; c < 3; c++)
          now[i + c] = same
            ? 255 - (255 - now[i + c]!) * 0.25
            : [255, 0, 170][c]!;
        now[i + 3] = 255;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.putImageData(diff, 0, 0);
      return canvas.toDataURL("image/png");
    },
    [readFileSync(before, "base64"), readFileSync(after, "base64")],
  );
  writeFileSync(out, Buffer.from(dataUrl.split(",")[1]!, "base64"));
  await page.close();
}

async function report(
  browser: Browser,
  head: Shot[],
  base: Shot[] | null,
  baseLabel: string,
) {
  const baseByFile = new Map((base ?? []).map((shot) => [shot.file, shot]));
  const headFiles = new Set(head.map((shot) => shot.file));
  const broken = head.filter((shot) => shot.error);
  const changed = head.filter((shot) => {
    const before = baseByFile.get(shot.file);
    return (
      !shot.error &&
      before &&
      digest(join(outDir, "head", shot.file)) !==
        digest(join(outDir, "base", before.file))
    );
  });
  // With no comparison, every story is listed.
  const added = head.filter(
    (shot) => !shot.error && (!base || !baseByFile.has(shot.file)),
  );
  const removed = (base ?? []).filter((shot) => !headFiles.has(shot.file));
  const diffDir = join(outDir, "diff");
  rmSync(diffDir, { recursive: true, force: true });
  mkdirSync(diffDir, { recursive: true });
  for (const shot of changed) {
    const before = join(outDir, "base", baseByFile.get(shot.file)!.file);
    if (existsSync(before))
      await diffImage(
        browser,
        before,
        join(outDir, "head", shot.file),
        join(diffDir, shot.file),
      );
  }

  const captions = { base: "Before", head: "After", diff: "Difference" };
  const img = (side: keyof typeof captions, shot: Shot) =>
    existsSync(join(outDir, side, shot.file))
      ? `<figure><figcaption>${captions[side]}</figcaption><img src="${side}/${shot.file}" loading="lazy"></figure>`
      : "";
  const card = (shot: Shot, body: string) =>
    `<section><h3>${escape(shot.title)} · ${escape(shot.name)} <small>${shot.theme}</small></h3><div class="pair">${body}</div></section>`;
  const group = (
    heading: string,
    shots: Shot[],
    body: (shot: Shot) => string,
  ) =>
    shots.length
      ? `<h2>${heading} (${shots.length})</h2>${shots.map((shot) => card(shot, body(shot))).join("")}`
      : "";

  const html = `<!doctype html><meta charset="utf-8"><title>${base ? "Component changes" : "Components"}</title>
<style>
  body { font: 15px/1.4 system-ui, sans-serif; margin: 24px; color: #1f2021; background: #fffdf7; }
  h1 { margin: 0 0 4px; } h2 { margin-top: 32px; border-bottom: 1px solid #d5d6d6; }
  h3 { font-size: 15px; margin: 20px 0 8px; } small { color: #606162; font-weight: normal; }
  .pair { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
  figure { margin: 0; } figcaption { font-size: 13px; color: #606162; }
  img { max-width: min(420px, 90vw); border: 1px solid #d5d6d6; display: block; }
  pre { background: #ededee; padding: 12px; white-space: pre-wrap; max-width: 900px; }
</style>
<h1>${base ? "Component changes" : "Components"}</h1>
<p>${escape(baseLabel)} · ${head.length / themes.length} stories, light and dark.
${base && broken.length + changed.length + added.length + removed.length === 0 ? "<strong>No visible changes.</strong>" : ""}</p>
${group("Fails to render", broken, (shot) => `<pre>${escape(shot.error ?? "")}</pre>${img("head", shot)}`)}
${group("Changed", changed, (shot) => img("base", baseByFile.get(shot.file)!) + img("head", shot) + img("diff", shot))}
${group(base ? "New" : "All stories", added, (shot) => img("head", shot))}
${group("Removed", removed, (shot) => img("base", shot))}`;
  const file = join(outDir, "index.html");
  writeFileSync(file, html);
  return { file, broken, changed, added, removed };
}

const browser = await chromium.launch();
try {
  mkdirSync(outDir, { recursive: true });
  const headStatic = join(outDir, "head-static");
  buildStorybook(appDir, headStatic, "this checkout");
  console.log("Screenshotting this checkout's stories…");
  const head = await shoot(browser, headStatic, join(outDir, "head"));

  let base: Shot[] | null = null;
  let baseLabel = "No comparison";
  if (!noBase) {
    const build = baseBuild();
    baseLabel = `Compared with ${baseRef} at ${build?.sha.slice(0, 7) ?? "its merge base"}`;
    if (build) {
      console.log(`Screenshotting ${baseRef}'s stories…`);
      base = await shoot(browser, build.staticDir, join(outDir, "base"));
    } else {
      base = [];
    }
  }

  const result = await report(browser, head, base, baseLabel);
  console.log(
    base
      ? `\n${result.changed.length} changed, ${result.added.length} new, ${result.removed.length} removed, ${result.broken.length} failing to render.`
      : `\n${result.added.length} screenshots, ${result.broken.length} failing to render.`,
  );
  for (const shot of result.broken)
    console.log(
      `  ✗ ${shot.id} (${shot.theme}): ${shot.error?.split("\n")[0]}`,
    );
  console.log(`Report: ${pathToFileURL(result.file).href}`);
  process.exitCode = result.broken.length > 0 ? 1 : 0;
} finally {
  await browser.close();
}

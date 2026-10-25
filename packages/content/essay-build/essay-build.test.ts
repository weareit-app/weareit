import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { loadEssay } from "./load";
import { EssayError, parseEssay } from "./parse";

const fixture = (name: string) =>
  fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));
const t = (value: string) => ({ type: "text", value });

const front = `---
title: Why It exists
question: What made this worth attempting?
published: false
updated: 2026-10-20
changes:
  - date: 2026-10-20
    note: First draft.
sources:
  - id: plan
    title: Public pages plan
    publisher: We Are It
    url: https://github.com/weareit-app/weareit
---
`;

const parse = (body: string, files: Record<string, string> = {}) =>
  parseEssay({ slug: "why", markdown: front + body, files });

const errorsOf = (body: string, files: Record<string, string> = {}) => {
  try {
    parse(body, files);
  } catch (error) {
    if (error instanceof EssayError) return error.problems.join("\n");
    throw error;
  }
  throw new Error("expected the essay to fail");
};

describe("essay parser", () => {
  it("reads the front matter and the text", () => {
    const essay = parse("## The question\n\nWhy build It at all?\n");
    expect(essay).toEqual({
      slug: "why",
      title: "Why It exists",
      question: "What made this worth attempting?",
      published: false,
      updated: "2026-10-20",
      changes: [{ date: "2026-10-20", note: "First draft." }],
      sources: [
        {
          id: "plan",
          title: "Public pages plan",
          publisher: "We Are It",
          url: "https://github.com/weareit-app/weareit",
        },
      ],
      body: [
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", value: "The question" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "Why build It at all?" }],
        },
      ],
    });
  });

  it("fails without front matter, or with bad front matter", () => {
    expect(() =>
      parseEssay({ slug: "why", markdown: "Hello\n", files: {} }),
    ).toThrow(/front matter/);
    expect(() =>
      parseEssay({
        slug: "why",
        markdown: front.replace("published: false", "published: maybe"),
        files: {},
      }),
    ).toThrow(/published/);
  });

  it("keeps headings in order, starting below the title", () => {
    expect(errorsOf("# Again the title\n")).toMatch(/line 15.*level 1/);
    expect(errorsOf("## One\n\n#### Skipped\n")).toMatch(/line 17.*level 4/);
  });

  it("turns every node and block type into the typed tree", () => {
    const essay = loadEssay(fixture("every-node"));
    expect(essay.slug).toBe("every-node");
    expect(essay.changes.map((change) => change.date)).toEqual([
      "2026-10-20",
      "2026-10-01",
    ]);
    expect(essay.body).toEqual([
      { type: "heading", level: 2, children: [t("Text")] },
      {
        type: "paragraph",
        children: [
          t("A paragraph with "),
          { type: "emphasis", children: [t("emphasis")] },
          t(", "),
          { type: "strong", children: [t("strong")] },
          t(", a "),
          { type: "link", href: "https://example.org", children: [t("link")] },
          t(" and a "),
          { type: "link", href: "/roadmap", children: [t("page link")] },
          t(", across two lines."),
        ],
      },
      {
        type: "paragraph",
        children: [
          t("A sourced claim"),
          { type: "sourceRef", id: "plan" },
          t(" and a label "),
          { type: "status", label: "working hypothesis" },
          t(". Maths: "),
          { type: "math", tex: "E = mc^2" },
          t("."),
        ],
      },
      {
        type: "paragraph",
        children: [t("A line that ends with a hard break and carries on.")],
      },
      { type: "heading", level: 3, children: [t("Lists")] },
      {
        type: "list",
        ordered: false,
        items: [
          [{ type: "paragraph", children: [t("One")] }],
          [
            {
              type: "paragraph",
              children: [
                t("Two, with "),
                { type: "emphasis", children: [t("emphasis")] },
              ],
            },
            {
              type: "list",
              ordered: false,
              items: [
                [{ type: "paragraph", children: [t("Nested under two")] }],
              ],
            },
          ],
        ],
      },
      { type: "heading", level: 4, children: [t("Numbered")] },
      {
        type: "list",
        ordered: true,
        items: [
          [{ type: "paragraph", children: [t("First")] }],
          [{ type: "paragraph", children: [t("Second")] }],
        ],
      },
      {
        type: "table",
        align: ["left", "right"],
        head: [[t("City")], [t("Start")]],
        rows: [[[t("Seattle")], [t("8:45")]]],
      },
      { type: "heading", level: 2, children: [t("Blocks")] },
      {
        type: "block",
        block: {
          type: "chart",
          id: "incidents",
          data: {
            title: "Reported incidents",
            description: "Incidents rose from three to five.",
            spec: { mark: "line" },
            columns: [
              { key: "year", label: "Year" },
              { key: "count", label: "Incidents" },
            ],
            data: [
              { year: 2020, count: 3 },
              { year: 2021, count: 5 },
            ],
            source: "plan",
            unit: "incidents",
            timeframe: "2020–2021",
            population: "Incidents reported to the database",
            updated: "2026-10-01",
          },
        },
      },
      {
        type: "block",
        block: {
          type: "diagram",
          id: "flow",
          data: {
            mermaid: "graph LR\n  Pain --> Future",
            description: "A pain leads to a future.",
          },
        },
      },
      {
        type: "block",
        block: { type: "math", id: "formula", data: { tex: "E = mc^2" } },
      },
      {
        type: "block",
        block: {
          type: "evidence",
          id: "claim",
          data: {
            claim: "The plan is public.",
            source: "plan",
            date: "2026-10-19",
            status: "established result",
            limitation: "It is a plan, not a result.",
          },
        },
      },
      {
        type: "block",
        block: {
          type: "timeline",
          id: "milestones",
          data: { entries: [{ date: "2026-10", title: "First spec" }] },
        },
      },
      {
        type: "block",
        block: {
          type: "status-board",
          id: "board",
          data: {
            items: [{ label: "Essays", status: "planned engineering" }],
          },
        },
      },
      {
        type: "block",
        block: {
          type: "table",
          id: "cities",
          data: {
            caption: "Start times",
            columns: [{ key: "city", label: "City" }],
            rows: [{ city: "Seattle" }],
          },
        },
      },
      {
        type: "block",
        block: {
          type: "expandable",
          title: "More detail",
          children: [{ type: "paragraph", children: [t("Nested text.")] }],
        },
      },
    ]);
  });
});

describe("essay format README", () => {
  const readme = readFileSync(
    fileURLToPath(new URL("../essays/README.md", import.meta.url)),
    "utf8",
  );
  const fenced = (language: string) =>
    [
      ...readme.matchAll(
        new RegExp("```" + language + "\\n([\\s\\S]*?)```", "g"),
      ),
    ].map((match) => match[1]);
  const fixtureFile = (name: string) =>
    readFileSync(`${fixture("every-node")}/${name}`, "utf8");

  it("shows the example essay the tests build", () => {
    expect(fenced("markdown")).toContain(fixtureFile("essay.md"));
  });

  it("shows every data file of the example, matching the fixture", () => {
    const shown = [
      ...readme.matchAll(
        /`([\w-]+\.(?:json|yaml))` \([^)]*\):\n\n```(?:json|yaml)\n([\s\S]*?)```/g,
      ),
    ];
    const dataFiles = readdirSync(fixture("every-node")).filter(
      (name) => name !== "essay.md",
    );
    expect(shown.map((match) => match[1]).sort()).toEqual(dataFiles.sort());
    for (const [, name, body] of shown)
      expect(parseYaml(body!)).toEqual(parseYaml(fixtureFile(name!)));
  });
});

describe("invalid essays", () => {
  it("fails on a reference to a source that isn't listed", () => {
    expect(errorsOf("A claim[^nowhere].\n")).toMatch(
      /line 15: \[\^nowhere\] is not one of the sources/,
    );
  });

  it("fails on footnotes written in the text", () => {
    expect(errorsOf("A claim[^plan].\n\n[^plan]: Somewhere.\n")).toMatch(
      /list sources in the front matter/,
    );
  });

  it("fails on an unknown block type", () => {
    expect(errorsOf('::video{id="clip"}\n')).toMatch(
      /line 15: "::video" is not a block type/,
    );
    expect(errorsOf(":::aside\nText\n:::\n")).toMatch(/":::aside"/);
    expect(errorsOf(":::expandable\nText\n:::\n")).toMatch(
      /:::expandable\{title=/,
    );
  });

  it("fails on a block without its data file", () => {
    expect(errorsOf('::chart{id="missing"}\n')).toMatch(
      /::chart "missing" has no data file/,
    );
  });

  it("fails on a block written without an id", () => {
    expect(errorsOf("::chart\n")).toMatch(/::chart\{id=/);
  });

  it("fails on block data that doesn't match its type", () => {
    expect(
      errorsOf('::chart{id="bad"}\n', {
        "bad.json": JSON.stringify({ title: "No context" }),
      }),
    ).toMatch(/why\/bad\.json: unit/);
  });

  it("fails on block data naming a source that isn't listed", () => {
    expect(
      errorsOf('::evidence{id="claim"}\n', {
        "claim.yaml": [
          "claim: A claim.",
          "source: elsewhere",
          'date: "2026-10-01"',
          "status: open question",
          "limitation: None known.",
        ].join("\n"),
      }),
    ).toMatch(/source "elsewhere" is not one of the sources/);
  });

  it("fails on a status label outside the fixed list", () => {
    expect(errorsOf("A view :status[probably true].\n")).toMatch(
      /"probably true" is not a status label/,
    );
  });

  it("keeps colons in times and ratios as text", () => {
    expect(parse("At 8:45, a 3:1 ratio:high.\n").body).toEqual([
      { type: "paragraph", children: [t("At 8:45, a 3:1 ratio:high.")] },
    ]);
  });

  it("fails on unsupported Markdown", () => {
    expect(errorsOf("<div>Hi</div>\n")).toMatch(/HTML isn't supported/);
    expect(errorsOf("![A cat](cat.png)\n")).toMatch(/image isn't supported/);
    expect(errorsOf("> Quoted\n")).toMatch(/quotation block/);
    expect(errorsOf("$$\nx\n$$\n")).toMatch(/use ::math/);
  });

  it("fails on unsafe links", () => {
    expect(errorsOf("[Run](javascript:alert(1))\n")).toMatch(/links go to/);
  });

  it("reports every problem at once", () => {
    const problems = errorsOf("# One\n\nA claim[^nowhere].\n").split("\n");
    expect(problems).toHaveLength(2);
  });
});

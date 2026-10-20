import { describe, expect, it } from "vitest";
import {
  blockDataSchemas,
  essayFrontMatterSchema,
  essayStatusLabels,
} from "../src/essay-schema";

const frontMatter = {
  title: "Why It exists",
  question: "What made this worth attempting?",
  published: false,
  updated: "2026-10-20",
  changes: [
    { date: "2026-10-20", note: "Second draft." },
    { date: "2026-10-01", note: "First draft." },
  ],
  sources: [
    {
      id: "plan",
      title: "Public pages plan",
      publisher: "We Are It",
      url: "https://github.com/weareit-app/weareit",
    },
  ],
};

const chart = {
  title: "Reported incidents per year",
  description: "Incidents rose each year from 2020 to 2024.",
  spec: { mark: "line" },
  data: [{ year: 2020, count: 3 }],
  source: "plan",
  unit: "incidents",
  timeframe: "2020–2024",
  population: "Incidents reported to the database",
  updated: "2026-10-01",
};

describe("essay front matter", () => {
  it("accepts a complete essay", () => {
    expect(essayFrontMatterSchema.parse(frontMatter).title).toBe(
      "Why It exists",
    );
  });

  it("needs at least one dated change", () => {
    expect(
      essayFrontMatterSchema.safeParse({ ...frontMatter, changes: [] }).success,
    ).toBe(false);
  });

  it("lists the newest change first, dated as the last update", () => {
    const reversed = [...frontMatter.changes].reverse();
    expect(
      essayFrontMatterSchema.safeParse({ ...frontMatter, changes: reversed })
        .success,
    ).toBe(false);
    expect(
      essayFrontMatterSchema.safeParse({
        ...frontMatter,
        updated: "2026-10-21",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown fields and duplicate source IDs", () => {
    expect(
      essayFrontMatterSchema.safeParse({ ...frontMatter, author: "x" }).success,
    ).toBe(false);
    expect(
      essayFrontMatterSchema.safeParse({
        ...frontMatter,
        sources: [frontMatter.sources[0], frontMatter.sources[0]],
      }).success,
    ).toBe(false);
  });

  it("rejects a source without a web address", () => {
    const [source] = frontMatter.sources;
    expect(
      essayFrontMatterSchema.safeParse({
        ...frontMatter,
        sources: [{ ...source, url: "javascript:alert(1)" }],
      }).success,
    ).toBe(false);
  });
});

describe("block data", () => {
  it("accepts a chart with its context", () => {
    expect(blockDataSchemas.chart.safeParse(chart).success).toBe(true);
  });

  it.each(["unit", "source", "timeframe", "updated", "population"])(
    "rejects a chart without %s",
    (field) => {
      const { [field as keyof typeof chart]: _, ...rest } = chart;
      expect(blockDataSchemas.chart.safeParse(rest).success).toBe(false);
    },
  );

  it("labels evidence with a status from the fixed list", () => {
    const evidence = {
      claim: "People sleep longer with later school start times.",
      source: "plan",
      date: "2026-10-01",
      status: "replicated finding",
      limitation: "Mostly studied in the United States.",
    };
    expect(blockDataSchemas.evidence.safeParse(evidence).success).toBe(true);
    expect(
      blockDataSchemas.evidence.safeParse({ ...evidence, status: "true" })
        .success,
    ).toBe(false);
  });

  it("needs a table of outside data to say its unit, timeframe and date", () => {
    const table = {
      caption: "Start times",
      columns: [{ key: "city", label: "City" }],
      rows: [{ city: "Seattle" }],
    };
    expect(blockDataSchemas.table.safeParse(table).success).toBe(true);
    expect(
      blockDataSchemas.table.safeParse({ ...table, source: "plan" }).success,
    ).toBe(false);
  });

  it("rejects table rows with columns it doesn't declare", () => {
    expect(
      blockDataSchemas.table.safeParse({
        caption: "Start times",
        columns: [{ key: "city", label: "City" }],
        rows: [{ town: "Seattle" }],
      }).success,
    ).toBe(false);
  });

  it("has the spec's seven status labels, written as words", () => {
    expect(essayStatusLabels).toEqual([
      "established result",
      "replicated finding",
      "machine-checked under stated assumptions",
      "working hypothesis",
      "speculative direction",
      "open question",
      "planned engineering",
    ]);
  });
});

import { z } from "zod";

// Essays (public-pages, public-essays). An essay is a Markdown file with front
// matter; the build script in `essay-build/` turns it into the typed tree
// below, checked with these schemas. The app renders the tree and never
// parses Markdown.

/** The fixed status labels an essay may give a result, view or plan. */
export const essayStatusLabels = [
  "established result",
  "replicated finding",
  "machine-checked under stated assumptions",
  "working hypothesis",
  "speculative direction",
  "open question",
  "planned engineering",
] as const;

export const essayStatusLabelSchema = z.enum(essayStatusLabels);
export type EssayStatusLabel = z.infer<typeof essayStatusLabelSchema>;

const isoDate = z.iso.date();
const text = z.string().trim().min(1);
const slugId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase words joined by hyphens");

export const essaySourceSchema = z.strictObject({
  id: slugId,
  title: text,
  /** Who published it; described by what they published, never endorsement. */
  publisher: text,
  url: z.url({ protocol: /^https?$/ }),
  /** When it was published, as a year or a date. */
  date: z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    .optional(),
});
export type EssaySource = z.infer<typeof essaySourceSchema>;

export const essayChangeSchema = z.strictObject({ date: isoDate, note: text });

export const essayFrontMatterSchema = z
  .strictObject({
    title: text,
    /** The one-line question the essay answers. */
    question: text,
    published: z.boolean(),
    updated: isoDate,
    /** Newest first; the first published version has one entry. */
    changes: z.array(essayChangeSchema).min(1),
    sources: z.array(essaySourceSchema).default([]),
  })
  .superRefine((essay, ctx) => {
    essay.changes.forEach((change, index) => {
      const previous = essay.changes[index - 1];
      if (previous && change.date > previous.date)
        ctx.addIssue({
          code: "custom",
          path: ["changes", index, "date"],
          message: "list changes newest first",
        });
    });
    if (essay.changes[0]?.date !== essay.updated)
      ctx.addIssue({
        code: "custom",
        path: ["updated"],
        message: "updated must be the date of the newest change",
      });
    const seen = new Set<string>();
    essay.sources.forEach((source, index) => {
      if (seen.has(source.id))
        ctx.addIssue({
          code: "custom",
          path: ["sources", index, "id"],
          message: `source "${source.id}" is listed twice`,
        });
      seen.add(source.id);
    });
  });
export type EssayFrontMatter = z.infer<typeof essayFrontMatterSchema>;

// Block data files (`<block-id>.json` or `.yaml` beside the essay). Fields
// that name a source hold a source ID from the front matter.

const cell = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const record = z.record(z.string(), cell);

/** The context every chart or table of outside data shows. */
const dataContext = {
  source: slugId,
  unit: text,
  timeframe: text,
  /** The population or denominator the numbers describe. */
  population: text,
  /** Uncertainty, where it is known. */
  uncertainty: text.optional(),
  updated: isoDate,
};

const chartData = z.strictObject({
  title: text,
  /** Written description, read by screen readers and shown without scripts. */
  description: text,
  /** A Vega-Lite spec without its data; the data comes from `data`. */
  spec: z.record(z.string(), z.unknown()),
  data: z.array(record).min(1),
  ...dataContext,
});

const diagramData = z.strictObject({
  title: text.optional(),
  /** Mermaid source. */
  mermaid: text,
  description: text,
});

const mathData = z.strictObject({
  /** TeX source, shown as text until it is drawn. */
  tex: text,
  description: text.optional(),
});

const evidenceData = z.strictObject({
  claim: text,
  source: slugId,
  date: isoDate,
  status: essayStatusLabelSchema,
  limitation: text,
});

const timelineData = z.strictObject({
  title: text.optional(),
  entries: z
    .array(
      z.strictObject({
        date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
        title: text,
        note: text.optional(),
      }),
    )
    .min(1),
});

const statusBoardData = z.strictObject({
  title: text.optional(),
  items: z
    .array(
      z.strictObject({
        label: text,
        status: essayStatusLabelSchema,
        note: text.optional(),
      }),
    )
    .min(1),
});

const tableData = z
  .strictObject({
    caption: text,
    columns: z.array(z.strictObject({ key: text, label: text })).min(1),
    rows: z.array(record).min(1),
    // A table of outside data names its source and then needs the rest of
    // its context too.
    source: dataContext.source.optional(),
    unit: dataContext.unit.optional(),
    timeframe: dataContext.timeframe.optional(),
    population: dataContext.population.optional(),
    uncertainty: dataContext.uncertainty,
    updated: dataContext.updated.optional(),
  })
  .superRefine((table, ctx) => {
    if (table.source)
      for (const field of [
        "unit",
        "timeframe",
        "population",
        "updated",
      ] as const)
        if (!table[field])
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `a table with a source needs ${field}`,
          });
    const keys = new Set(table.columns.map((column) => column.key));
    table.rows.forEach((row, index) => {
      for (const key of Object.keys(row))
        if (!keys.has(key))
          ctx.addIssue({
            code: "custom",
            path: ["rows", index, key],
            message: `"${key}" is not one of the table's columns`,
          });
    });
  });

/** Block types whose data lives in a file beside the essay. */
export const blockDataSchemas = {
  chart: chartData,
  diagram: diagramData,
  math: mathData,
  evidence: evidenceData,
  timeline: timelineData,
  "status-board": statusBoardData,
  table: tableData,
};
export type DataBlockType = keyof typeof blockDataSchemas;
export const dataBlockTypes = Object.keys(blockDataSchemas) as DataBlockType[];

// The typed tree.

export type EssayInline =
  | { type: "text"; value: string }
  | { type: "emphasis"; children: EssayInline[] }
  | { type: "strong"; children: EssayInline[] }
  | { type: "link"; href: string; children: EssayInline[] }
  /** A footnote-style reference to a source in the front matter. */
  | { type: "sourceRef"; id: string }
  | { type: "status"; label: EssayStatusLabel }
  | { type: "math"; tex: string };

export type EssayBlock =
  | { type: "chart"; id: string; data: z.infer<typeof chartData> }
  | { type: "diagram"; id: string; data: z.infer<typeof diagramData> }
  | { type: "math"; id: string; data: z.infer<typeof mathData> }
  | { type: "evidence"; id: string; data: z.infer<typeof evidenceData> }
  | { type: "timeline"; id: string; data: z.infer<typeof timelineData> }
  | {
      type: "status-board";
      id: string;
      data: z.infer<typeof statusBoardData>;
    }
  | { type: "table"; id: string; data: z.infer<typeof tableData> }
  | { type: "expandable"; title: string; children: EssayNode[] };

export type EssayNode =
  | { type: "heading"; level: 2 | 3 | 4; children: EssayInline[] }
  | { type: "paragraph"; children: EssayInline[] }
  | { type: "list"; ordered: boolean; items: EssayNode[][] }
  | {
      type: "table";
      align: ("left" | "right" | "center" | null)[];
      head: EssayInline[][];
      rows: EssayInline[][][];
    }
  | { type: "block"; block: EssayBlock };

const inlineSchema: z.ZodType<EssayInline> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.strictObject({ type: z.literal("text"), value: z.string() }),
    z.strictObject({
      type: z.literal("emphasis"),
      children: z.array(inlineSchema),
    }),
    z.strictObject({
      type: z.literal("strong"),
      children: z.array(inlineSchema),
    }),
    z.strictObject({
      type: z.literal("link"),
      href: z
        .string()
        .regex(
          /^(https?:\/\/|mailto:|\/(?!\/))/,
          "links go to a web address, an email address or a page on It",
        ),
      children: z.array(inlineSchema).min(1),
    }),
    z.strictObject({ type: z.literal("sourceRef"), id: slugId }),
    z.strictObject({
      type: z.literal("status"),
      label: essayStatusLabelSchema,
    }),
    z.strictObject({ type: z.literal("math"), tex: text }),
  ]),
);

const dataBlock = <T extends DataBlockType>(type: T) =>
  z.strictObject({
    type: z.literal(type),
    id: slugId,
    data: blockDataSchemas[type],
  });

const blockSchema: z.ZodType<EssayBlock> = z.lazy(() =>
  z.discriminatedUnion("type", [
    dataBlock("chart"),
    dataBlock("diagram"),
    dataBlock("math"),
    dataBlock("evidence"),
    dataBlock("timeline"),
    dataBlock("status-board"),
    dataBlock("table"),
    z.strictObject({
      type: z.literal("expandable"),
      title: text,
      children: z.array(nodeSchema).min(1),
    }),
  ]),
) as z.ZodType<EssayBlock>;

const nodeSchema: z.ZodType<EssayNode> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.strictObject({
      type: z.literal("heading"),
      level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
      children: z.array(inlineSchema).min(1),
    }),
    z.strictObject({
      type: z.literal("paragraph"),
      children: z.array(inlineSchema).min(1),
    }),
    z.strictObject({
      type: z.literal("list"),
      ordered: z.boolean(),
      items: z.array(z.array(nodeSchema)).min(1),
    }),
    z.strictObject({
      type: z.literal("table"),
      align: z.array(z.enum(["left", "right", "center"]).nullable()),
      head: z.array(z.array(inlineSchema)),
      rows: z.array(z.array(z.array(inlineSchema))),
    }),
    z.strictObject({ type: z.literal("block"), block: blockSchema }),
  ]),
);

export const essayNodeSchema = nodeSchema;

export const essaySchema = z.strictObject({
  slug: slugId,
  title: text,
  question: text,
  published: z.boolean(),
  updated: isoDate,
  changes: z.array(essayChangeSchema).min(1),
  sources: z.array(essaySourceSchema),
  body: z.array(nodeSchema).min(1),
});
export type Essay = z.infer<typeof essaySchema>;

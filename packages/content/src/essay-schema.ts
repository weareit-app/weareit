import { z } from "zod";
import {
  blockSchemas,
  dataBlockTypes,
  type BlockType,
  type DataBlockType,
} from "./essays/blocks";
import {
  essayStatusLabels,
  essayStatusLabelSchema,
  isoDate,
  slugId,
  text,
} from "./essays/blocks/shared";

// Essays (public-pages, public-essays). An essay is a Markdown file with front
// matter; the build script in `essay-build/` turns it into the typed tree
// below, checked with these schemas. The app renders the tree and never
// parses Markdown.

export { essayStatusLabels, essayStatusLabelSchema };
export type EssayStatusLabel = z.infer<typeof essayStatusLabelSchema>;

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

export { blockSchemas, dataBlockTypes, type BlockType, type DataBlockType };

type Data<T extends DataBlockType> = z.infer<(typeof blockSchemas)[T]>;

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
  | {
      [T in DataBlockType]: { type: T; id: string; data: Data<T> };
    }[DataBlockType]
  | { type: "expandable"; title: string; children: EssayNode[] };

/** The parsed block of one type, as its component receives it. */
export type EssayBlockOf<T extends BlockType> = Extract<
  EssayBlock,
  { type: T }
>;

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
    data: blockSchemas[type],
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

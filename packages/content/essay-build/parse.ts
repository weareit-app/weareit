// Build-time only: turns an essay's Markdown and block files into the typed
// tree in `src/essay-schema.ts`. The Markdown parser lives here, so neither the
// content package's runtime exports nor the app ship it.

import type {
  Nodes as MdastNode,
  PhrasingContent,
  RootContent,
  Table,
} from "mdast";
import { directiveFromMarkdown } from "mdast-util-directive";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { mathFromMarkdown } from "mdast-util-math";
import { directive } from "micromark-extension-directive";
import { gfmFootnote } from "micromark-extension-gfm-footnote";
import { gfmTable } from "micromark-extension-gfm-table";
import { math } from "micromark-extension-math";
import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import {
  blockSchemas,
  dataBlockTypes,
  essayFrontMatterSchema,
  essaySchema,
  essayStatusLabels,
  type DataBlockType,
  type Essay,
  type EssayBlock,
  type EssayInline,
  type EssayNode,
} from "../src/essay-schema";

export class EssayError extends Error {
  constructor(readonly problems: string[]) {
    super(problems.join("\n"));
    this.name = "EssayError";
  }
}

export type EssayInput = {
  slug: string;
  markdown: string;
  /** Block data files beside the essay, by file name. */
  files: Record<string, string>;
};

const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function zodProblems(where: string, error: z.ZodError) {
  return error.issues.map(
    (issue) =>
      `${where}: ${issue.path.length ? `${issue.path.join(".")}: ` : ""}${issue.message}`,
  );
}

export function parseEssay({ slug, markdown, files }: EssayInput): Essay {
  const file = `${slug}/essay.md`;
  const match = frontMatterPattern.exec(markdown);
  if (!match)
    throw new EssayError([
      `${file}: start with front matter between --- lines`,
    ]);

  let rawFrontMatter: unknown;
  try {
    rawFrontMatter = parseYaml(match[1]!);
  } catch (error) {
    throw new EssayError([
      `${file}: front matter is not valid YAML: ${(error as Error).message}`,
    ]);
  }
  const frontMatter = essayFrontMatterSchema.safeParse(rawFrontMatter);
  if (!frontMatter.success)
    throw new EssayError(
      zodProblems(`${file} front matter`, frontMatter.error),
    );

  const sourceIds = new Set(
    frontMatter.data.sources.map((source) => source.id),
  );
  const problems: string[] = [];

  // Blank lines in place of the front matter keep line numbers true to the
  // file. Each source gets a footnote definition so `[^id]` parses as a
  // reference; a reference to anything else stays text and is reported.
  const frontLines = match[0].split("\n").length - 1;
  const body = markdown.slice(match[0].length);
  const bodyEnd = frontLines + body.split("\n").length;
  const definitions = [...sourceIds].map((id) => `[^${id}]: source`).join("\n");
  const source = `${"\n".repeat(frontLines)}${body}\n\n${definitions}\n`;
  const tree = fromMarkdown(source, {
    extensions: [
      directive(),
      gfmTable(),
      gfmFootnote(),
      math({ singleDollarTextMath: true }),
    ],
    mdastExtensions: [
      directiveFromMarkdown(),
      gfmTableFromMarkdown(),
      gfmFootnoteFromMarkdown(),
      mathFromMarkdown(),
    ],
  });

  const at = (node: MdastNode) =>
    `${file} line ${node.position?.start.line ?? "?"}`;
  const fail = (node: MdastNode, message: string) => {
    problems.push(`${at(node)}: ${message}`);
  };
  let lastHeading = 1;

  function inline(nodes: PhrasingContent[]): EssayInline[] {
    const out: EssayInline[] = [];
    const push = (node: EssayInline) => {
      const previous = out.at(-1);
      if (node.type === "text" && previous?.type === "text")
        previous.value += node.value;
      else out.push(node);
    };
    for (const node of nodes) {
      switch (node.type) {
        case "text": {
          const stray = /\[\^([^\]]+)\]/.exec(node.value);
          if (stray)
            fail(
              node,
              `[^${stray[1]}] is not one of the sources in the front matter`,
            );
          push({ type: "text", value: node.value.replace(/\s*\n\s*/g, " ") });
          break;
        }
        case "break":
          push({ type: "text", value: " " });
          break;
        case "emphasis":
        case "strong":
          push({ type: node.type, children: inline(node.children) });
          break;
        case "link":
          push({
            type: "link",
            href: node.url,
            children: inline(node.children),
          });
          break;
        case "footnoteReference":
          if (sourceIds.has(node.identifier))
            push({ type: "sourceRef", id: node.identifier });
          else
            fail(
              node,
              `[^${node.label ?? node.identifier}] is not one of the sources in the front matter`,
            );
          break;
        case "inlineMath":
          push({ type: "math", tex: node.value });
          break;
        case "textDirective": {
          const label = node.children
            .map((child) => ("value" in child ? child.value : ""))
            .join("")
            .trim()
            .toLowerCase();
          // Only :status means anything inline; "8:45" or "3:1" is text.
          if (node.name !== "status")
            push({
              type: "text",
              value: source.slice(
                node.position!.start.offset,
                node.position!.end.offset,
              ),
            });
          else if (!(essayStatusLabels as readonly string[]).includes(label))
            fail(
              node,
              `"${label}" is not a status label; use one of: ${essayStatusLabels.join(", ")}`,
            );
          else
            push({
              type: "status",
              label: label as (typeof essayStatusLabels)[number],
            });
          break;
        }
        default:
          fail(node, `${describe(node)} isn't supported in essays`);
      }
    }
    return out;
  }

  function table(node: Table): EssayNode {
    const [head, ...rows] = node.children.map((row) =>
      row.children.map((cell) => inline(cell.children)),
    );
    return {
      type: "table",
      align: (node.align ?? []).map((align) => align ?? null),
      head: head ?? [],
      rows,
    };
  }

  function dataBlock(type: DataBlockType, id: string, node: MdastNode) {
    const name = [`${id}.json`, `${id}.yaml`, `${id}.yml`].find(
      (candidate) => candidate in files,
    );
    if (!name) {
      fail(node, `::${type} "${id}" has no data file (${id}.json or .yaml)`);
      return undefined;
    }
    const where = `${slug}/${name}`;
    let raw: unknown;
    try {
      raw = parseYaml(files[name]!); // YAML is a superset of JSON.
    } catch (error) {
      problems.push(`${where}: can't be read: ${(error as Error).message}`);
      return undefined;
    }
    const parsed = blockSchemas[type].safeParse(raw);
    if (!parsed.success) {
      problems.push(...zodProblems(where, parsed.error));
      return undefined;
    }
    const source = (parsed.data as { source?: string }).source;
    if (source && !sourceIds.has(source))
      problems.push(
        `${where}: source "${source}" is not one of the sources in the front matter`,
      );
    return { type, id, data: parsed.data } as EssayBlock;
  }

  function blocks(nodes: RootContent[]): EssayNode[] {
    const out: EssayNode[] = [];
    for (const node of nodes) {
      if ((node.position?.start.line ?? 0) > bodyEnd) continue; // our definitions
      switch (node.type) {
        case "heading":
          if (
            node.depth === 1 ||
            node.depth > lastHeading + 1 ||
            node.depth > 4
          )
            fail(
              node,
              `heading level ${node.depth} is out of order; essay headings start at ## (level 2) and go down one level at a time, at most to ####`,
            );
          lastHeading = node.depth;
          out.push({
            type: "heading",
            level: node.depth as 2 | 3 | 4,
            children: inline(node.children),
          });
          break;
        case "paragraph":
          out.push({ type: "paragraph", children: inline(node.children) });
          break;
        case "list":
          out.push({
            type: "list",
            ordered: node.ordered ?? false,
            items: node.children.map((item) => blocks(item.children)),
          });
          break;
        case "table":
          out.push(table(node));
          break;
        case "leafDirective": {
          const type = node.name as DataBlockType;
          const { id, ...extra } = node.attributes ?? {};
          if (!dataBlockTypes.includes(type)) {
            fail(
              node,
              `"::${node.name}" is not a block type; use one of: ${[...dataBlockTypes, "expandable"].join(", ")}`,
            );
            break;
          }
          if (!id || Object.keys(extra).length || node.children.length) {
            fail(node, `write the block as ::${type}{id="<data file name>"}`);
            break;
          }
          const block = dataBlock(type, id, node);
          if (block) out.push({ type: "block", block });
          break;
        }
        case "containerDirective": {
          if (node.name !== "expandable") {
            fail(
              node,
              `":::${node.name}" is not a block type; only :::expandable holds text`,
            );
            break;
          }
          const attributes = blockSchemas.expandable.safeParse(
            node.attributes ?? {},
          );
          if (!attributes.success) {
            fail(node, `write the block as :::expandable{title="…"}`);
            break;
          }
          const saved = lastHeading;
          out.push({
            type: "block",
            block: {
              type: "expandable",
              title: attributes.data.title,
              children: blocks(node.children),
            },
          });
          lastHeading = saved;
          break;
        }
        case "footnoteDefinition":
          fail(node, "list sources in the front matter, not as footnotes");
          break;
        default:
          fail(node, `${describe(node)} isn't supported in essays`);
      }
    }
    return out;
  }

  const result = {
    slug,
    title: frontMatter.data.title,
    question: frontMatter.data.question,
    published: frontMatter.data.published,
    updated: frontMatter.data.updated,
    changes: frontMatter.data.changes,
    sources: frontMatter.data.sources,
    body: blocks(tree.children),
  };
  if (problems.length) throw new EssayError(problems);

  const checked = essaySchema.safeParse(result);
  if (!checked.success) throw new EssayError(zodProblems(file, checked.error));
  return checked.data;
}

const names: Partial<Record<MdastNode["type"], string>> = {
  html: "HTML",
  image: "An image",
  code: "A code block",
  inlineCode: "Inline code",
  blockquote: "A quotation block",
  thematicBreak: "A horizontal rule",
  definition: "A link definition",
  linkReference: "A reference-style link",
  imageReference: "An image",
  math: "A $$ maths block (use ::math)",
  leafDirective: "A block",
  containerDirective: "A block",
};

function describe(node: MdastNode) {
  return names[node.type] ?? `"${node.type}"`;
}

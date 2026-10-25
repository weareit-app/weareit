import { z } from "zod";
import { isoDateSchema, nonEmptyTextSchema, slugIdSchema } from "./primitives";

const copySchema = nonEmptyTextSchema.max(4000);

export const fixKinds = ["once", "habit", "group", "feature"] as const;
// Roadmap order: live, being built, decided, being looked into, undecided.
export const featureStatuses = [
  "live",
  "in-progress",
  "planned",
  "exploring",
  "idea",
] as const;
export const evidenceLevels = [
  "strong",
  "some",
  "limited",
  "untested",
] as const;
export type FixKind = (typeof fixKinds)[number];
export type FeatureStatus = (typeof featureStatuses)[number];
export type EvidenceLevel = (typeof evidenceLevels)[number];

export const contentDomainSchema = z.strictObject({
  id: slugIdSchema,
  scope: z.enum(["personal", "world"]),
  title: copySchema,
  sortOrder: z.number().int().nonnegative(),
});

export const contentPainSchema = z.strictObject({
  id: slugIdSchema,
  domainId: slugIdSchema,
  title: copySchema,
  description: copySchema,
  sortOrder: z.number().int().nonnegative(),
});

export const contentDreamSchema = z.strictObject({
  id: slugIdSchema,
  title: copySchema,
  description: copySchema,
  sortOrder: z.number().int().nonnegative(),
});

export const contentFirstActionSchema = z.strictObject({
  id: slugIdSchema,
  title: copySchema,
  description: copySchema,
  firstStep: copySchema,
  effortMinutes: z.number().int().positive().max(120),
  evidence: z.enum(["candidate", "practical"]),
  safetyNote: copySchema.optional(),
  sortOrder: z.number().int().nonnegative(),
});

const contentFixFields = z.strictObject({
  id: slugIdSchema,
  title: copySchema,
  description: copySchema,
  kind: z.enum(fixKinds),
  featureStatus: z.enum(featureStatuses).optional(),
  // When the status last changed and a short note of what changed. Content
  // from before five statuses has neither.
  statusChangedOn: isoDateSchema.optional(),
  statusNote: copySchema.max(500).optional(),
  // A Feature fix connected to a roadmap item takes the item's status and
  // has none of its own.
  roadmapItemId: slugIdSchema.optional(),
  evidence: z.enum(evidenceLevels),
  evidenceNote: copySchema,
  sortOrder: z.number().int().nonnegative(),
});

// The status rules every fix follows, in the graph and in the tier-1 data. A
// fix connected to a roadmap item is checked against the item in the graph.
function checkFixStatus(
  fix: Pick<
    z.infer<typeof contentFixFields>,
    "kind" | "featureStatus" | "statusChangedOn" | "statusNote"
  > & { roadmapItemId?: string | undefined },
  context: z.RefinementCtx,
) {
  if (fix.roadmapItemId !== undefined) {
    if (fix.kind !== "feature")
      context.addIssue({
        code: "custom",
        path: ["roadmapItemId"],
        message: "Only Feature fixes connect to a roadmap item.",
      });
    if (
      fix.featureStatus !== undefined ||
      fix.statusChangedOn !== undefined ||
      fix.statusNote !== undefined
    )
      context.addIssue({
        code: "custom",
        path: ["featureStatus"],
        message: "A connected fix takes its roadmap item's status.",
      });
    return;
  }
  if ((fix.kind === "feature") !== Boolean(fix.featureStatus))
    context.addIssue({
      code: "custom",
      path: ["featureStatus"],
      message: "Features, and only features, carry a roadmap status.",
    });
  if (
    fix.kind !== "feature" &&
    (fix.statusChangedOn !== undefined || fix.statusNote !== undefined)
  )
    context.addIssue({
      code: "custom",
      path: ["statusNote"],
      message: "Only features carry a status date and note.",
    });
}

export const contentFixSchema = contentFixFields.superRefine(checkFixStatus);

// A piece of It's work on the roadmap, for example "Use It in Spanish". The
// ID stays the same when the title changes.
export const contentRoadmapItemSchema = z.strictObject({
  id: slugIdSchema,
  title: copySchema.max(200),
  line: copySchema.max(300),
  status: z.enum(featureStatuses),
  statusChangedOn: isoDateSchema.optional(),
  statusNote: copySchema.max(500).optional(),
  sortOrder: z.number().int().nonnegative(),
});

export const contentSourceSchema = z.strictObject({
  id: slugIdSchema,
  title: copySchema,
  documentPath: copySchema,
  sourceType: z.enum(["research_registry", "content_spec", "fix_corpus"]),
  rights: copySchema,
});

export const contentProvenanceSchema = z.strictObject({
  entityType: z.enum(["domain", "pain", "dream", "first_action", "fix"]),
  entityId: slugIdSchema,
  sourceId: slugIdSchema,
  locator: copySchema,
  evidenceType: copySchema,
  rights: z.enum(["CC0-1.0", "CC-BY-SA-4.0"]),
  reviewStatus: z.enum(["unreviewed", "reviewed", "approved"]),
});

export const contentGraphSchema = z
  .strictObject({
    domains: z.array(contentDomainSchema),
    pains: z.array(contentPainSchema),
    dreams: z.array(contentDreamSchema),
    painDreamLinks: z.array(
      z.strictObject({ painId: slugIdSchema, dreamId: slugIdSchema }),
    ),
    firstActions: z.array(contentFirstActionSchema),
    actionPainLinks: z.array(
      z.strictObject({ actionId: slugIdSchema, painId: slugIdSchema }),
    ),
    // Defaults keep content versions published before fixes existed readable.
    fixes: z.array(contentFixSchema).default([]),
    fixDreamLinks: z
      .array(z.strictObject({ fixId: slugIdSchema, dreamId: slugIdSchema }))
      .default([]),
    roadmapItems: z.array(contentRoadmapItemSchema).default([]),
    sources: z.array(contentSourceSchema),
    provenance: z.array(contentProvenanceSchema),
  })
  .superRefine((graph, context) => {
    const uniqueIds = (key: string, ids: string[]) => {
      if (new Set(ids).size !== ids.length) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: `${key} IDs must be unique.`,
        });
      }
    };

    uniqueIds(
      "domains",
      graph.domains.map(({ id }) => id),
    );
    uniqueIds(
      "pains",
      graph.pains.map(({ id }) => id),
    );
    uniqueIds(
      "dreams",
      graph.dreams.map(({ id }) => id),
    );
    uniqueIds(
      "firstActions",
      graph.firstActions.map(({ id }) => id),
    );
    uniqueIds(
      "fixes",
      graph.fixes.map(({ id }) => id),
    );
    uniqueIds(
      "fixDreamLinks",
      graph.fixDreamLinks.map(({ fixId, dreamId }) => `${fixId}:${dreamId}`),
    );
    uniqueIds(
      "roadmapItems",
      graph.roadmapItems.map(({ id }) => id),
    );
    uniqueIds(
      "sources",
      graph.sources.map(({ id }) => id),
    );
    uniqueIds(
      "painDreamLinks",
      graph.painDreamLinks.map(({ painId, dreamId }) => `${painId}:${dreamId}`),
    );
    uniqueIds(
      "actionPainLinks",
      graph.actionPainLinks.map(
        ({ actionId, painId }) => `${actionId}:${painId}`,
      ),
    );
    uniqueIds(
      "provenance",
      graph.provenance.map(
        ({ entityType, entityId, sourceId, locator }) =>
          `${entityType}:${entityId}:${sourceId}:${locator}`,
      ),
    );

    const domainIds = new Set(graph.domains.map(({ id }) => id));
    const painIds = new Set(graph.pains.map(({ id }) => id));
    const dreamIds = new Set(graph.dreams.map(({ id }) => id));
    const actionIds = new Set(graph.firstActions.map(({ id }) => id));
    const fixIds = new Set(graph.fixes.map(({ id }) => id));
    const sourceIds = new Set(graph.sources.map(({ id }) => id));
    const roadmapItemIds = new Set(graph.roadmapItems.map(({ id }) => id));

    graph.pains.forEach((pain, index) => {
      if (!domainIds.has(pain.domainId)) {
        context.addIssue({
          code: "custom",
          path: ["pains", index, "domainId"],
          message: `Unknown domain ${pain.domainId}.`,
        });
      }
    });
    graph.painDreamLinks.forEach((link, index) => {
      if (!painIds.has(link.painId))
        context.addIssue({
          code: "custom",
          path: ["painDreamLinks", index, "painId"],
          message: `Unknown pain ${link.painId}.`,
        });
      if (!dreamIds.has(link.dreamId))
        context.addIssue({
          code: "custom",
          path: ["painDreamLinks", index, "dreamId"],
          message: `Unknown dream ${link.dreamId}.`,
        });
    });
    graph.actionPainLinks.forEach((link, index) => {
      if (!actionIds.has(link.actionId))
        context.addIssue({
          code: "custom",
          path: ["actionPainLinks", index, "actionId"],
          message: `Unknown action ${link.actionId}.`,
        });
      if (!painIds.has(link.painId))
        context.addIssue({
          code: "custom",
          path: ["actionPainLinks", index, "painId"],
          message: `Unknown pain ${link.painId}.`,
        });
    });
    graph.fixDreamLinks.forEach((link, index) => {
      if (!fixIds.has(link.fixId))
        context.addIssue({
          code: "custom",
          path: ["fixDreamLinks", index, "fixId"],
          message: `Unknown fix ${link.fixId}.`,
        });
      if (!dreamIds.has(link.dreamId))
        context.addIssue({
          code: "custom",
          path: ["fixDreamLinks", index, "dreamId"],
          message: `Unknown dream ${link.dreamId}.`,
        });
    });
    graph.fixes.forEach((fix, index) => {
      if (
        fix.roadmapItemId !== undefined &&
        fix.kind === "feature" &&
        !roadmapItemIds.has(fix.roadmapItemId)
      )
        context.addIssue({
          code: "custom",
          path: ["fixes", index, "roadmapItemId"],
          message: `Unknown roadmap item ${fix.roadmapItemId}.`,
        });
    });
    graph.provenance.forEach((reference, index) => {
      const entityIds = {
        domain: domainIds,
        pain: painIds,
        dream: dreamIds,
        // biome-ignore lint/style/useNamingConvention: keyed by the provenance entity type, whose stored value is first_action.
        first_action: actionIds,
        fix: fixIds,
      }[reference.entityType];
      if (!entityIds.has(reference.entityId))
        context.addIssue({
          code: "custom",
          path: ["provenance", index, "entityId"],
          message: `Unknown ${reference.entityType} ${reference.entityId}.`,
        });
      if (!sourceIds.has(reference.sourceId))
        context.addIssue({
          code: "custom",
          path: ["provenance", index, "sourceId"],
          message: `Unknown source ${reference.sourceId}.`,
        });
    });
  });

export type ContentGraph = z.infer<typeof contentGraphSchema>;
export type ContentFix = z.infer<typeof contentFixSchema>;
export type ContentRoadmapItem = z.infer<typeof contentRoadmapItemSchema>;

// The fixes as people see them: a connected fix shows its item's status, date
// and note, so the roadmap and the explorer can't disagree.
export function resolveFeatureStatuses(
  graph: Pick<ContentGraph, "fixes" | "roadmapItems">,
): ContentFix[] {
  const items = new Map(graph.roadmapItems.map((item) => [item.id, item]));
  return graph.fixes.map((fix) => {
    const item = fix.roadmapItemId ? items.get(fix.roadmapItemId) : undefined;
    if (!item) return fix;
    return {
      ...fix,
      featureStatus: item.status,
      ...(item.statusChangedOn
        ? { statusChangedOn: item.statusChangedOn }
        : {}),
      ...(item.statusNote ? { statusNote: item.statusNote } : {}),
    };
  });
}

interface StatusChangeIssue {
  path: string;
  message: string;
}

// A saved status change needs a new note saying what changed, and records the
// date: today, unless the founder set a different date with the change. A new
// record counts as a change unless `newNeedsNote` is false; then it only gets
// the date.
function applyStatusChanges<
  T extends {
    id: string;
    statusChangedOn?: string | undefined;
    statusNote?: string | undefined;
  },
>(
  previous: readonly T[],
  next: readonly T[],
  today: string,
  statusOf: (record: T) => FeatureStatus | undefined,
  pathPrefix: string,
  newNeedsNote = true,
): { records: T[]; issues: StatusChangeIssue[] } {
  const before = new Map(previous.map((record) => [record.id, record]));
  const issues: StatusChangeIssue[] = [];
  const records = next.map((record) => {
    const old = before.get(record.id);
    const status = statusOf(record);
    if (!status || (old && statusOf(old) === status)) return record;
    if (!old && !newNeedsNote)
      return record.statusChangedOn
        ? record
        : { ...record, statusChangedOn: today };
    if (!record.statusNote?.trim() || record.statusNote === old?.statusNote) {
      issues.push({
        path: `${pathPrefix}.${record.id}.statusNote`,
        message: "Add a note saying what changed before changing the status.",
      });
      return record;
    }
    return record.statusChangedOn &&
      record.statusChangedOn !== old?.statusChangedOn
      ? record
      : { ...record, statusChangedOn: today };
  });
  return { records, issues };
}

// Pass the fixes as they were shown (see resolveFeatureStatuses), so a fix
// disconnected from its roadmap item keeps the item's status without a change.
export function applyFeatureStatusChanges(
  previous: readonly ContentFix[],
  next: readonly ContentFix[],
  today: string,
): { fixes: ContentFix[]; issues: StatusChangeIssue[] } {
  const { records, issues } = applyStatusChanges(
    previous,
    next,
    today,
    (fix) => fix.featureStatus,
    "fix",
  );
  return { fixes: records, issues };
}

// A new item needs no note: it starts at its status on the day it is saved.
export function applyRoadmapItemStatusChanges(
  previous: readonly ContentRoadmapItem[],
  next: readonly ContentRoadmapItem[],
  today: string,
): { items: ContentRoadmapItem[]; issues: StatusChangeIssue[] } {
  const { records, issues } = applyStatusChanges(
    previous,
    next,
    today,
    (item) => item.status,
    "roadmap_item",
    false,
  );
  return { items: records, issues };
}

// Tier-1 authoring: the nested shape the tier-1 data is written in, before
// buildTier1ContentGraph flattens it into the graph above.

export const dreamSchema = contentDreamSchema.pick({
  id: true,
  title: true,
  description: true,
});

export const painSchema = contentPainSchema
  .pick({ id: true, title: true, description: true })
  .extend({
    // Empty until futures are written; the page says so (CONFLICTS.md P7).
    dreams: z.array(dreamSchema),
  });

export const painDomainSchema = contentDomainSchema
  .pick({ id: true, title: true })
  .extend({ pains: z.array(painSchema).min(1) });

export const firstActionSchema = contentFirstActionSchema
  .pick({
    id: true,
    title: true,
    description: true,
    firstStep: true,
    effortMinutes: true,
    evidence: true,
    safetyNote: true,
  })
  .extend({
    painIds: z.array(z.string().min(1)).min(1),
    source: copySchema,
  });

export const fixSchema = contentFixFields
  .pick({
    id: true,
    title: true,
    description: true,
    kind: true,
    featureStatus: true,
    statusChangedOn: true,
    statusNote: true,
    evidence: true,
    evidenceNote: true,
  })
  .extend({ dreamIds: z.array(z.string().min(1)).min(1) })
  .superRefine(checkFixStatus);

function hasUniqueIds<T extends { id: string }>(items: T[]) {
  return new Set(items.map((item) => item.id)).size === items.length;
}

export const painDomainListSchema = z
  .array(painDomainSchema)
  .min(1)
  .superRefine((domains, context) => {
    if (!hasUniqueIds(domains)) {
      context.addIssue({
        code: "custom",
        message: "Domain IDs must be unique.",
      });
    }

    const pains = domains.flatMap((domain) => domain.pains);
    if (!hasUniqueIds(pains)) {
      context.addIssue({
        code: "custom",
        message: "Pain IDs must be unique across the content set.",
      });
    }

    // A dream may serve several pains; every use of its ID must carry the same copy.
    const dreamsById = new Map<string, Dream>();
    for (const dream of pains.flatMap((pain) => pain.dreams)) {
      const existing = dreamsById.get(dream.id);
      if (
        existing &&
        (existing.title !== dream.title ||
          existing.description !== dream.description)
      ) {
        context.addIssue({
          code: "custom",
          message: `Dream ${dream.id} has different copy in different pains.`,
        });
      }
      dreamsById.set(dream.id, dream);
    }
  });

export type Dream = z.infer<typeof dreamSchema>;
export type Pain = z.infer<typeof painSchema>;
export type PainDomain = z.infer<typeof painDomainSchema>;

import {
  contentGraphSchema,
  type ContentGraph,
} from "@it/content/graph-schema";
import type { Kysely } from "kysely";
import type { Database } from "./types";
import type { ItDatabase } from "./database";

export type ContentValidationIssue = { path: string; message: string };

export class InvalidOnboardingDraftError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOnboardingDraftError";
  }
}

export function validatePublishableGraph(input: unknown): {
  graph?: ContentGraph;
  issues: ContentValidationIssue[];
} {
  const parsed = contentGraphSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const graph = parsed.data;
  const issues: ContentValidationIssue[] = [];
  if (
    graph.domains.length === 0 ||
    graph.pains.length === 0 ||
    graph.dreams.length === 0
  ) {
    issues.push({
      path: "content",
      message: "Publish at least one domain, pain, and dream.",
    });
  }
  const dreamsForPain = new Set(
    graph.painDreamLinks.map(({ painId }) => painId),
  );
  for (const pain of graph.pains) {
    if (!dreamsForPain.has(pain.id))
      issues.push({
        path: `pain.${pain.id}.dreams`,
        message: "Link this pain to at least one desired future.",
      });
  }
  const painsForDream = new Set(
    graph.painDreamLinks.map(({ dreamId }) => dreamId),
  );
  for (const dream of graph.dreams) {
    if (!painsForDream.has(dream.id))
      issues.push({
        path: `dream.${dream.id}.pains`,
        message: "Link this desired future to at least one pain.",
      });
  }
  const painsForAction = new Set(
    graph.actionPainLinks.map(({ actionId }) => actionId),
  );
  for (const action of graph.firstActions) {
    if (!painsForAction.has(action.id))
      issues.push({
        path: `first_action.${action.id}.pains`,
        message: "Link this first action to at least one pain.",
      });
  }
  const references = new Set(
    graph.provenance.map((item) => `${item.entityType}:${item.entityId}`),
  );
  for (const [entityType, records] of [
    ["domain", graph.domains],
    ["pain", graph.pains],
    ["dream", graph.dreams],
    ["first_action", graph.firstActions],
  ] as const) {
    for (const record of records) {
      if (!references.has(`${entityType}:${record.id}`)) {
        issues.push({
          path: `${entityType}.${record.id}.provenance`,
          message: "Add at least one source and locator before publishing.",
        });
      }
    }
  }

  for (const [index, reference] of graph.provenance.entries()) {
    if (reference.reviewStatus === "unreviewed") {
      issues.push({
        path: `provenance.${index}.reviewStatus`,
        message: "Review this source reference before publishing.",
      });
    }
  }
  return { graph, issues };
}

export async function readPublishedContent(db: ItDatabase) {
  const row = await db
    .selectFrom("published_content_versions")
    .select(["version", "content", "checksum", "published_at"])
    .orderBy("version", "desc")
    .limit(1)
    .executeTakeFirst();
  if (!row) return null;
  return {
    version: row.version,
    content: contentGraphSchema.parse(row.content),
    checksum: row.checksum,
    publishedAt: row.published_at.toISOString(),
  };
}

export async function saveUserOnboardingDraft(
  db: ItDatabase,
  userId: string,
  contentVersion: number,
  draft: {
    personalPainIds: string[];
    worldPainIds: string[];
    personalDreamIds: string[];
    worldDreamIds: string[];
    helpInterests: string[];
    draftUpdatedAt: number;
  },
) {
  const published = await db
    .selectFrom("published_content_versions")
    .select("content")
    .where("version", "=", contentVersion)
    .executeTakeFirst();
  if (!published)
    throw new InvalidOnboardingDraftError(
      "The selected content version was not found.",
    );

  const graph = contentGraphSchema.parse(published.content);
  const personalPainIds = new Set(
    graph.pains
      .filter(
        (pain) =>
          graph.domains.find((domain) => domain.id === pain.domainId)?.scope ===
          "personal",
      )
      .map((pain) => pain.id),
  );
  const worldPainIds = new Set(
    graph.pains
      .filter(
        (pain) =>
          graph.domains.find((domain) => domain.id === pain.domainId)?.scope ===
          "world",
      )
      .map((pain) => pain.id),
  );
  const dreamIds = new Set(graph.dreams.map((dream) => dream.id));
  if (
    draft.personalPainIds.some((id) => !personalPainIds.has(id)) ||
    draft.worldPainIds.some((id) => !worldPainIds.has(id)) ||
    draft.personalDreamIds.some((id) => !dreamIds.has(id)) ||
    draft.worldDreamIds.some((id) => !dreamIds.has(id))
  ) {
    throw new InvalidOnboardingDraftError(
      "Some saved choices are not in the content version you explored.",
    );
  }

  const savedAt = new Date();
  await db
    .insertInto("user_onboarding_drafts")
    .values({
      user_id: userId,
      content_version: contentVersion,
      draft,
      saved_at: savedAt,
    })
    .onConflict((conflict) =>
      conflict.column("user_id").doUpdateSet({
        content_version: contentVersion,
        draft,
        saved_at: savedAt,
      }),
    )
    .execute();
  return { savedAt: savedAt.toISOString(), contentVersion };
}

export async function readDraftContent(db: ItDatabase): Promise<{
  revision: number;
  content: ContentGraph;
}> {
  const state = await db
    .selectFrom("content_draft_state")
    .select("revision")
    .where("id", "=", 1)
    .executeTakeFirst();
  if (!state) throw new Error("The CMS has not been seeded yet.");

  const [
    domains,
    pains,
    dreams,
    painDreamLinks,
    actions,
    actionPainLinks,
    sources,
    provenance,
  ] = await Promise.all([
    db
      .selectFrom("content_domains")
      .selectAll()
      .orderBy("scope")
      .orderBy("sort_order")
      .execute(),
    db.selectFrom("content_pains").selectAll().orderBy("sort_order").execute(),
    db.selectFrom("content_dreams").selectAll().orderBy("sort_order").execute(),
    db.selectFrom("pain_dream_links").selectAll().execute(),
    db
      .selectFrom("content_first_actions")
      .selectAll()
      .orderBy("sort_order")
      .execute(),
    db.selectFrom("action_pain_links").selectAll().execute(),
    db.selectFrom("content_sources").selectAll().execute(),
    db.selectFrom("content_provenance").selectAll().execute(),
  ]);

  return {
    revision: state.revision,
    content: contentGraphSchema.parse({
      domains: domains.map(({ id, scope, title, sort_order }) => ({
        id,
        scope,
        title,
        sortOrder: sort_order,
      })),
      pains: pains.map(({ id, domain_id, title, description, sort_order }) => ({
        id,
        domainId: domain_id,
        title,
        description,
        sortOrder: sort_order,
      })),
      dreams: dreams.map(({ id, title, description, sort_order }) => ({
        id,
        title,
        description,
        sortOrder: sort_order,
      })),
      painDreamLinks: painDreamLinks.map(({ pain_id, dream_id }) => ({
        painId: pain_id,
        dreamId: dream_id,
      })),
      firstActions: actions.map(
        ({
          id,
          title,
          description,
          first_step,
          effort_minutes,
          evidence,
          safety_note,
          sort_order,
        }) => ({
          id,
          title,
          description,
          firstStep: first_step,
          effortMinutes: effort_minutes,
          evidence,
          ...(safety_note ? { safetyNote: safety_note } : {}),
          sortOrder: sort_order,
        }),
      ),
      actionPainLinks: actionPainLinks.map(({ action_id, pain_id }) => ({
        actionId: action_id,
        painId: pain_id,
      })),
      sources: sources.map(
        ({ id, title, document_path, source_type, rights }) => ({
          id,
          title,
          documentPath: document_path,
          sourceType: source_type,
          rights,
        }),
      ),
      provenance: provenance.map(
        ({
          entity_type,
          entity_id,
          source_id,
          locator,
          evidence_type,
          rights,
          review_status,
        }) => ({
          entityType: entity_type,
          entityId: entity_id,
          sourceId: source_id,
          locator,
          evidenceType: evidence_type,
          rights,
          reviewStatus: review_status,
        }),
      ),
    }),
  };
}

export async function saveDraftContent(
  db: ItDatabase,
  graphInput: unknown,
  options: { expectedRevision: number; actor: string; changeNote: string },
) {
  const graph = contentGraphSchema.parse(graphInput);
  return db.transaction().execute(async (trx) => {
    const state = await trx
      .selectFrom("content_draft_state")
      .select("revision")
      .where("id", "=", 1)
      .forUpdate()
      .executeTakeFirst();
    if (!state) throw new Error("The CMS has not been seeded yet.");
    if (state.revision !== options.expectedRevision) {
      throw new Error(
        `Draft changed since revision ${options.expectedRevision}; reload before saving.`,
      );
    }
    return saveDraftInTransaction(trx, graph, options, state.revision);
  });
}

export async function initializeContent(db: ItDatabase, graphInput: unknown) {
  const graph = contentGraphSchema.parse(graphInput);
  const validation = validatePublishableGraph(graph);
  if (validation.issues.length)
    throw new Error(
      validation.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("\n"),
    );
  const checksum = await sha256(JSON.stringify(graph));
  return db.transaction().execute(async (trx) => {
    const existing = await trx
      .selectFrom("content_draft_state")
      .select("id")
      .where("id", "=", 1)
      .executeTakeFirst();
    if (existing)
      throw new Error(
        "Content is already initialized. Use the CMS to edit it.",
      );
    await replaceNormalizedContent(trx, graph);
    await trx
      .insertInto("content_revisions")
      .values({
        revision: 1,
        content: graph,
        created_by: "seed",
        change_note: "Initial sourced Tier 1 import",
      })
      .execute();
    await trx
      .insertInto("content_draft_state")
      .values({ id: 1, revision: 1, updated_at: new Date() })
      .execute();
    await trx
      .insertInto("published_content_versions")
      .values({
        source_revision: 1,
        content: graph,
        checksum,
        published_by: "seed",
        rollback_from: null,
      })
      .execute();
    return { revision: 1, checksum };
  });
}

export async function publishDraftContent(
  db: ItDatabase,
  options: { actor: string; rollbackFrom?: number },
) {
  return db.transaction().execute(async (trx) => {
    const state = await lockDraftState(trx);
    const draft = await readDraftContent(trx);
    const validation = validatePublishableGraph(draft.content);
    if (validation.issues.length || !validation.graph) {
      return { published: false as const, issues: validation.issues };
    }
    return insertPublishedVersion(
      trx,
      state.revision,
      validation.graph,
      options.actor,
      options.rollbackFrom ?? null,
    );
  });
}

export async function rollbackToVersion(
  db: ItDatabase,
  version: number,
  actor: string,
) {
  const target = await db
    .selectFrom("published_content_versions")
    .select(["version", "content"])
    .where("version", "=", version)
    .executeTakeFirst();
  if (!target)
    throw new Error(`Published content version ${version} was not found.`);
  const graph = contentGraphSchema.parse(target.content);
  return db.transaction().execute(async (trx) => {
    const state = await lockDraftState(trx);
    const revision = await saveDraftInTransaction(
      trx,
      graph,
      {
        expectedRevision: state.revision,
        actor,
        changeNote: `Restore published version ${version}`,
      },
      state.revision,
    );
    const validation = validatePublishableGraph(graph);
    if (validation.issues.length || !validation.graph)
      return { revision, published: false as const, issues: validation.issues };
    return {
      revision,
      ...(await insertPublishedVersion(
        trx,
        revision,
        validation.graph,
        actor,
        target.version,
      )),
    };
  });
}

async function lockDraftState(db: Kysely<Database>) {
  const state = await db
    .selectFrom("content_draft_state")
    .select("revision")
    .where("id", "=", 1)
    .forUpdate()
    .executeTakeFirst();
  if (!state) throw new Error("The CMS has not been seeded yet.");
  return state;
}

async function saveDraftInTransaction(
  trx: Kysely<Database>,
  graph: ContentGraph,
  options: { expectedRevision: number; actor: string; changeNote: string },
  currentRevision: number,
) {
  if (currentRevision !== options.expectedRevision)
    throw new Error(
      `Draft changed since revision ${options.expectedRevision}; reload before saving.`,
    );
  await replaceNormalizedContent(trx, graph);
  const revision = currentRevision + 1;
  await trx
    .insertInto("content_revisions")
    .values({
      revision,
      content: graph,
      created_by: options.actor,
      change_note: options.changeNote,
    })
    .execute();
  await trx
    .updateTable("content_draft_state")
    .set({ revision, updated_at: new Date() })
    .where("id", "=", 1)
    .execute();
  return revision;
}

async function insertPublishedVersion(
  trx: Kysely<Database>,
  revision: number,
  graph: ContentGraph,
  actor: string,
  rollbackFrom: number | null,
) {
  const checksum = await sha256(JSON.stringify(graph));
  const version = await trx
    .insertInto("published_content_versions")
    .values({
      source_revision: revision,
      content: graph,
      checksum,
      published_by: actor,
      rollback_from: rollbackFrom,
    })
    .returning("version")
    .executeTakeFirstOrThrow();
  return { published: true as const, version: version.version, checksum };
}

export async function listPublishedVersions(db: ItDatabase) {
  return db
    .selectFrom("published_content_versions")
    .select([
      "version",
      "source_revision",
      "checksum",
      "published_by",
      "rollback_from",
      "published_at",
    ])
    .orderBy("version", "desc")
    .limit(50)
    .execute();
}

async function replaceNormalizedContent(db: ItDatabase, graph: ContentGraph) {
  for (const table of [
    "content_provenance",
    "content_sources",
    "action_pain_links",
    "content_first_actions",
    "pain_dream_links",
    "content_pains",
    "content_dreams",
    "content_domains",
  ] as const) {
    await db.deleteFrom(table).execute();
  }
  if (graph.domains.length)
    await db
      .insertInto("content_domains")
      .values(
        graph.domains.map((item) => ({
          id: item.id,
          scope: item.scope,
          title: item.title,
          sort_order: item.sortOrder,
          updated_at: new Date(),
        })),
      )
      .execute();
  if (graph.pains.length)
    await db
      .insertInto("content_pains")
      .values(
        graph.pains.map((item) => ({
          id: item.id,
          domain_id: item.domainId,
          title: item.title,
          description: item.description,
          sort_order: item.sortOrder,
          updated_at: new Date(),
        })),
      )
      .execute();
  if (graph.dreams.length)
    await db
      .insertInto("content_dreams")
      .values(
        graph.dreams.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          sort_order: item.sortOrder,
          updated_at: new Date(),
        })),
      )
      .execute();
  if (graph.painDreamLinks.length)
    await db
      .insertInto("pain_dream_links")
      .values(
        graph.painDreamLinks.map(({ painId, dreamId }) => ({
          pain_id: painId,
          dream_id: dreamId,
        })),
      )
      .execute();
  if (graph.firstActions.length)
    await db
      .insertInto("content_first_actions")
      .values(
        graph.firstActions.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          first_step: item.firstStep,
          effort_minutes: item.effortMinutes,
          evidence: item.evidence,
          safety_note: item.safetyNote ?? null,
          sort_order: item.sortOrder,
          updated_at: new Date(),
        })),
      )
      .execute();
  if (graph.actionPainLinks.length)
    await db
      .insertInto("action_pain_links")
      .values(
        graph.actionPainLinks.map(({ actionId, painId }) => ({
          action_id: actionId,
          pain_id: painId,
        })),
      )
      .execute();
  if (graph.sources.length)
    await db
      .insertInto("content_sources")
      .values(
        graph.sources.map((item) => ({
          id: item.id,
          title: item.title,
          document_path: item.documentPath,
          source_type: item.sourceType,
          rights: item.rights,
          updated_at: new Date(),
        })),
      )
      .execute();
  if (graph.provenance.length)
    await db
      .insertInto("content_provenance")
      .values(
        graph.provenance.map((item) => ({
          entity_type: item.entityType,
          entity_id: item.entityId,
          source_id: item.sourceId,
          locator: item.locator,
          evidence_type: item.evidenceType,
          rights: item.rights,
          review_status: item.reviewStatus,
        })),
      )
      .execute();
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

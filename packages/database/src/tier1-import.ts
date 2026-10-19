import {
  getAllPains,
  personalPainDomains,
  worldPainDomains,
} from "@it/content/tier-1";
import { firstActions } from "@it/content/first-actions";
import { fixes } from "@it/content/fixes";
import {
  contentGraphSchema,
  type ContentGraph,
} from "@it/content/graph-schema";

const researchRights = "CC0-1.0" as const;
const authoredRights = "CC-BY-SA-4.0" as const;

export function buildTier1ContentGraph(): ContentGraph {
  const sourceRecords: ContentGraph["sources"] = [
    {
      id: "tier-1-content-spec",
      title: "It MVP Onboarding Content Spec",
      documentPath: "docs/source/It_MVP_Onboarding_Content_Spec.md",
      sourceType: "content_spec",
      rights: "Project source; underlying research has its own rights.",
    },
    {
      id: "tier-1-pains-and-dreams",
      title: "It MVP Tier 1 Pains and Dreams",
      documentPath: "docs/source/it_mvp_tier_1_pains_and_dreams.md",
      sourceType: "content_spec",
      rights: "Project source; knowledge-graph claims are CC0.",
    },
    {
      id: "personal-pain-source-map",
      title: "It MVP Personal Pain Source Map",
      documentPath: "docs/source/it_mvp_personal_pain_source_map.md",
      sourceType: "research_registry",
      rights:
        "Mixed external source rights; original sources remain attributed individually.",
    },
    {
      id: "societal-pain-source-registry",
      title: "MVP Societal Pains Source Registry",
      documentPath: "docs/source/MVP_Societal_Pains_Source_Registry.md",
      sourceType: "research_registry",
      rights:
        "Mixed external source rights; original sources remain attributed individually.",
    },
    {
      id: "onboarding-prototype",
      title: "It onboarding prototype: What can be better for you?",
      documentPath: "specs/001-personal-page/spec.md",
      sourceType: "content_spec",
      rights: "Authored guides and prose: CC BY-SA 4.0 working decision.",
    },
    {
      id: "mvp-fix-corpus",
      title: "We Are It MVP Fix Corpus",
      documentPath: "docs/source/We_Are_It_MVP_Fix_Corpus.md",
      sourceType: "fix_corpus",
      rights: "Authored guides and prose: CC BY-SA 4.0 working decision.",
    },
  ];
  const personalDomainIds = new Set(personalPainDomains.map(({ id }) => id));
  const allDomains = [...personalPainDomains, ...worldPainDomains];
  const domains: ContentGraph["domains"] = allDomains.map(
    (domain, sortOrder) => ({
      id: domain.id,
      scope: personalDomainIds.has(domain.id) ? "personal" : "world",
      title: domain.title,
      sortOrder: personalDomainIds.has(domain.id)
        ? sortOrder
        : sortOrder - personalPainDomains.length,
    }),
  );
  const pains: ContentGraph["pains"] = allDomains.flatMap((domain) =>
    domain.pains.map((pain, sortOrder) => ({
      id: pain.id,
      domainId: domain.id,
      title: pain.title,
      description: pain.description,
      sortOrder,
    })),
  );
  const dreams = new Map<string, ContentGraph["dreams"][number]>();
  const painDreamLinks: ContentGraph["painDreamLinks"] = [];
  for (const pain of getAllPains(allDomains)) {
    for (const dream of pain.dreams) {
      if (!dreams.has(dream.id))
        dreams.set(dream.id, { ...dream, sortOrder: dreams.size });
      painDreamLinks.push({ painId: pain.id, dreamId: dream.id });
    }
  }
  const knownPainIds = new Set(pains.map(({ id }) => id));
  const actionPainLinks: ContentGraph["actionPainLinks"] = firstActions.flatMap(
    (action) =>
      action.painIds.map((painId) => {
        if (!knownPainIds.has(painId))
          throw new Error(
            `Action ${action.id} references missing pain ${painId}.`,
          );
        return { actionId: action.id, painId };
      }),
  );
  const firstActionRows: ContentGraph["firstActions"] = firstActions.map(
    (
      {
        id,
        title,
        description,
        firstStep,
        effortMinutes,
        evidence,
        safetyNote,
      },
      sortOrder,
    ) => ({
      id,
      title,
      description,
      firstStep,
      effortMinutes,
      evidence,
      ...(safetyNote ? { safetyNote } : {}),
      sortOrder,
    }),
  );
  const knownDreamIds = new Set(dreams.keys());
  const fixRows: ContentGraph["fixes"] = fixes.map(
    ({ dreamIds: _dreamIds, featureStatus, ...fix }, sortOrder) => ({
      ...fix,
      ...(featureStatus ? { featureStatus } : {}),
      sortOrder,
    }),
  );
  const fixDreamLinks: ContentGraph["fixDreamLinks"] = fixes.flatMap((fix) =>
    fix.dreamIds.map((dreamId) => {
      if (!knownDreamIds.has(dreamId))
        throw new Error(`Fix ${fix.id} references missing dream ${dreamId}.`);
      return { fixId: fix.id, dreamId };
    }),
  );

  const provenance: ContentGraph["provenance"] = [];
  for (const domain of domains) {
    provenance.push({
      entityType: "domain",
      entityId: domain.id,
      sourceId: "tier-1-content-spec",
      locator: "Core model and Tier 1 domain sections",
      evidenceType: "Product curation",
      rights: researchRights,
      reviewStatus: "reviewed",
    });
  }
  const societalDomainIds = new Set(worldPainDomains.map(({ id }) => id));
  for (const pain of pains) {
    const sourceId = societalDomainIds.has(pain.domainId)
      ? "societal-pain-source-registry"
      : "personal-pain-source-map";
    provenance.push({
      entityType: "pain",
      entityId: pain.id,
      sourceId,
      locator:
        "Recovered source families; onboarding selection is a product decision, not a direct source quotation",
      evidenceType: "Research discovery and construct coverage",
      rights: researchRights,
      reviewStatus: "reviewed",
    });
    provenance.push({
      entityType: "pain",
      entityId: pain.id,
      sourceId: "tier-1-pains-and-dreams",
      locator: "Tier 1 presentation and pain-to-dream mappings",
      evidenceType: "Product curation",
      rights: researchRights,
      reviewStatus: "reviewed",
    });
  }
  for (const dream of dreams.values()) {
    provenance.push({
      entityType: "dream",
      entityId: dream.id,
      sourceId: "tier-1-pains-and-dreams",
      locator: "Tier 1 presentation and pain-to-dream mappings",
      evidenceType: "Product-authored desired state",
      rights: researchRights,
      reviewStatus: "reviewed",
    });
  }
  for (const action of firstActionRows) {
    const original = firstActions.find(({ id }) => id === action.id)!;
    provenance.push({
      entityType: "first_action",
      entityId: action.id,
      sourceId: "mvp-fix-corpus",
      locator: original.source,
      evidenceType:
        original.evidence === "candidate"
          ? "Candidate intervention"
          : "Practical first step",
      rights: authoredRights,
      reviewStatus: "reviewed",
    });
  }
  for (const fix of fixRows) {
    provenance.push({
      entityType: "fix",
      entityId: fix.id,
      sourceId: "onboarding-prototype",
      locator:
        "Founder-reviewed prototype ways; evidence ratings have no linked sources yet",
      evidenceType:
        fix.kind === "feature"
          ? "Product roadmap idea"
          : "Candidate intervention",
      rights: authoredRights,
      reviewStatus: "reviewed",
    });
  }
  return contentGraphSchema.parse({
    domains,
    pains,
    dreams: [...dreams.values()],
    painDreamLinks,
    firstActions: firstActionRows,
    actionPainLinks,
    fixes: fixRows,
    fixDreamLinks,
    sources: sourceRecords,
    provenance,
  });
}

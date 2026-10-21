import type { ContentGraph, FeatureStatus } from "@it/content/graph-schema";
import type { ColumnType, Generated, JSONColumnType } from "kysely";

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;

export interface ContentDomainsTable {
  id: string;
  scope: "personal" | "world";
  title: string;
  sort_order: number;
  updated_at: Timestamp;
}

export interface ContentPainsTable {
  id: string;
  domain_id: string;
  title: string;
  description: string;
  sort_order: number;
  updated_at: Timestamp;
}

export interface ContentDreamsTable {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  updated_at: Timestamp;
}

export interface PainDreamLinksTable {
  pain_id: string;
  dream_id: string;
}

export interface ContentFirstActionsTable {
  id: string;
  title: string;
  description: string;
  first_step: string;
  effort_minutes: number;
  evidence: "candidate" | "practical";
  safety_note: string | null;
  sort_order: number;
  updated_at: Timestamp;
}

export interface ActionPainLinksTable {
  action_id: string;
  pain_id: string;
}

export interface ContentFixesTable {
  id: string;
  title: string;
  description: string;
  kind: "once" | "habit" | "group" | "feature";
  feature_status: FeatureStatus | null;
  // A calendar date; read it as YYYY-MM-DD text (see content-repository).
  status_changed_on: ColumnType<Date | null, string | null, string | null>;
  status_note: string | null;
  roadmap_item_id: string | null;
  evidence: "strong" | "some" | "limited" | "untested";
  evidence_note: string;
  sort_order: number;
  updated_at: Timestamp;
}

export interface RoadmapItemsTable {
  id: string;
  title: string;
  line: string;
  status: FeatureStatus;
  // A calendar date; read it as YYYY-MM-DD text (see content-repository).
  status_changed_on: ColumnType<Date | null, string | null, string | null>;
  status_note: string | null;
  sort_order: number;
  updated_at: Timestamp;
}

export interface FixDreamLinksTable {
  fix_id: string;
  dream_id: string;
}

export interface ContentSourcesTable {
  id: string;
  title: string;
  document_path: string;
  source_type: "research_registry" | "content_spec" | "fix_corpus";
  rights: string;
  updated_at: Timestamp;
}

export interface ContentProvenanceTable {
  entity_type: "domain" | "pain" | "dream" | "first_action" | "fix";
  entity_id: string;
  source_id: string;
  locator: string;
  evidence_type: string;
  rights: "CC0-1.0" | "CC-BY-SA-4.0";
  review_status: "unreviewed" | "reviewed" | "approved";
}

export interface ContentDraftStateTable {
  id: 1;
  revision: number;
  updated_at: Timestamp;
}

export interface ContentRevisionsTable {
  revision: number;
  content: JSONColumnType<ContentGraph, ContentGraph, ContentGraph>;
  created_by: string;
  change_note: string;
  created_at: Timestamp;
}

export interface PublishedContentVersionsTable {
  version: Generated<number>;
  source_revision: number;
  content: JSONColumnType<ContentGraph, ContentGraph, ContentGraph>;
  checksum: string;
  published_by: string;
  rollback_from: number | null;
  published_at: Timestamp;
}

type UserOnboardingDraft = {
  personalPainIds: string[];
  worldPainIds: string[];
  personalDreamIds: string[];
  worldDreamIds: string[];
  helpInterests: string[];
  draftUpdatedAt: number;
};

export interface UserOnboardingDraftsTable {
  id: Generated<number>;
  user_id: string;
  content_version: number;
  draft: JSONColumnType<
    UserOnboardingDraft,
    UserOnboardingDraft,
    UserOnboardingDraft
  >;
  saved_at: Timestamp;
}

export interface SupportContributionsTable {
  id: string;
  user_id: string | null;
  processor: "stripe" | "app_store" | "play_store";
  frequency: "once" | "monthly";
  amount_minor: number;
  currency: string;
  status:
    | "pending"
    | "active"
    | "succeeded"
    | "past_due"
    | "cancel_scheduled"
    | "canceled"
    | "expired"
    | "failed"
    | "refunded";
  stripe_customer_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  store_transaction_id: string | null;
  store_original_transaction_id: string | null;
  store_product_id: string | null;
  revenuecat_app_user_id: string | null;
  last_payment_event_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SupportPaymentEventsTable {
  processor: "stripe" | "revenuecat";
  event_id: string;
  body_sha256: string;
  received_at: Timestamp;
}

export interface SupportTransactionsTable {
  id: string;
  contribution_id: string;
  processor: "stripe" | "app_store" | "play_store";
  provider_transaction_id: string;
  amount_minor: number;
  currency: string;
  status: "succeeded" | "failed" | "refunded" | "partially_refunded";
  occurred_at: Timestamp;
  recorded_at: Timestamp;
}

export interface Database {
  content_domains: ContentDomainsTable;
  content_pains: ContentPainsTable;
  content_dreams: ContentDreamsTable;
  pain_dream_links: PainDreamLinksTable;
  content_first_actions: ContentFirstActionsTable;
  action_pain_links: ActionPainLinksTable;
  content_fixes: ContentFixesTable;
  roadmap_items: RoadmapItemsTable;
  fix_dream_links: FixDreamLinksTable;
  content_sources: ContentSourcesTable;
  content_provenance: ContentProvenanceTable;
  content_draft_state: ContentDraftStateTable;
  content_revisions: ContentRevisionsTable;
  published_content_versions: PublishedContentVersionsTable;
  user_onboarding_drafts: UserOnboardingDraftsTable;
  support_contributions: SupportContributionsTable;
  support_payment_events: SupportPaymentEventsTable;
  support_transactions: SupportTransactionsTable;
}

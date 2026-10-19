# Design

## Context

See proposal.md (Why). Current state:

- No measurement code exists. Baseline `on-device-choices` forbids sending anything before signup; baseline `pain-explorer` and `on-device-choices` list measurement as a known divergence.
- `PainExplorer` (shared by `/` and `/onboarding/world`) opens a pain by selecting it; only one pain is open at a time. Pain, dream and fix IDs are readable kebab-case IDs from the published content version, but the content editor can still rename published IDs (`content-catalog` divergence).
- `packages/api/src/client.ts` builds one oRPC `RPCLink` that sends credentials on web (`credentials: "include"`); on iOS the Better Auth Expo plugin attaches the session. `apps/api-server/src/index.ts` serves `/rpc`.
- Migrations run to `005_content_fixes`; required-signup-gate claims `006_signup_gate`.
- required-signup-gate (in flight) adds the gate, code screen, page-top "Sign in" link, Support skip and "You're all set", and an app-side emitter with typed `gate-reached` and `signed-up` events and no subscribers. It explicitly leaves sending and visit linking to this change.
- There is no privacy note on pages yet; required-signup-gate adds a placeholder privacy page; the privacy change (spec 010) owns the measurement wording.

## Goals / Non-Goals

**Goals:**
- One shared definition of the stage list and page-view list, used by app, server and (later) the privacy page.
- Fire-and-forget sending that can never affect the person's flow and never touches device storage.
- Server-side linking that keeps measurement messages free of account data.

**Non-Goals:**
- Privacy note and "What we count" wording (privacy change).
- Account deletion flow (only the data rule that deletion unlinks).
- Pain pages, Help build It, the full admin area (their stages and page views are defined here and switched on when those pages ship).
- Any client-side batching through storage, sampling, or session replay.

## Decisions

1. **Lists live in `packages/domain/src/measurement.ts`.** `STAGES` (20 names with scope and owner), `PAGE_KINDS` and Zod schemas for a message (`{visitId, platform, kind: "stage" | "page" | "pain-open", name?, painId?}`, `.strict()`). The privacy page later renders from or tests against the same export. *Alternative:* a DB table of stages; rejected because the app, server and copy must change in one release anyway.

2. **Visit module in the app (`apps/app/src/measurement/visit.ts`).** `crypto.randomUUID()` at module load, held in a module variable; never passed to storage, router params or the URL. A `Set` of sent stages and opened pain IDs gives once-per-visit semantics in memory. On iOS the module lives for the JS runtime, so background/foreground keeps the visit. `startNewVisit()` is called only when a different account signs in (decision 6).

3. **Sending.** A dedicated `measurement.record` oRPC procedure, called through a second `RPCLink` with `credentials: "omit"` and no auth header, so no session reaches it. On web, use `fetch(..., { keepalive: true })` so a page view sent just before navigation is not lost; errors are swallowed; no retry, no queue. Messages are sent one per event (small volume); the server's per-visit uniqueness makes accidental duplicates harmless. *Alternative:* `navigator.sendBeacon`; rejected because it always sends cookies on same-site requests.

4. **Disclosure switch.** `EXPO_PUBLIC_MEASUREMENT_ENABLED` (default off) plus a runtime check that the page's privacy note has mounted before the first send. Until the privacy change lands, the switch stays off in every build except tests and local development. The gate's extra line (account-signup delta) renders only when the switch is on, so copy and behaviour cannot diverge.

5. **Hooks.** Page views from a small `useMeasuredPage(kind, painId?)` hook in each listed route (not a global router listener, so unlisted pages are not counted by accident). Stage hooks in `PainExplorer` (first pain opened by scope, first dream picked, first fix seen when the "Ways it can be better" section first renders, moved on on "Continue"/"Skip" from the personal page), on the Support page (reached, completed, skipped), and a subscriber on required-signup-gate's emitter for `gate-reached`, `signed-up` and a new `signed-in` event.

6. **Linking.** `measurement.linkVisit({ visitId, how: "signed-up" | "signed-in" | "already-signed-in" })`, authenticated (`requireUserId`). Called after signup or sign-in succeeds and once at app start when a session exists. The server inserts into `visit_account_links (visit_id primary key, user_id, how, linked_at)`; a second link for the same visit to a different account is refused (one account per visit). On sign-out the client keeps the visit; on a different account's sign-in it calls `startNewVisit()` before linking. *Alternative:* attach the account to each message; rejected because FR-008 keeps messages free of account data and it would require sending sessions to the measurement endpoint.

7. **Storage (migration after `006_signup_gate`).** Tables `measurement_stages (visit_id, stage, platform, received_at, unique(visit_id, stage))`, `measurement_page_views (id, visit_id, page, pain_id null, platform, received_at)`, `measurement_pain_opens (visit_id, pain_id, platform, received_at, unique(visit_id, pain_id))`, and `visit_account_links` (decision 6) with `user_id` foreign key `on delete cascade` on the link row only, so deleting an account removes the link and leaves the records (unlinked and kept). No IP or user-agent columns. `received_at` from the server clock at full precision. Stage names are stored as text so renamed or removed stages keep their old names.

8. **Validation.** The procedure parses with the shared Zod schema (unknown fields rejected), checks the name against the current lists, and checks `painId` against the set of pain IDs in any published content version (cached in memory, refreshed on publish), so a pain retired later still validates old links but unknown IDs are rejected. Rejected messages are not stored or logged with request details.

9. **Logging.** The API server does not log request bodies or client addresses for `measurement.*`. Host-level request logs follow the hosting decision (still open in decisions.md); the endpoint path carries no visit number.

10. **Report.** A founder-only read operation `measurement.report({ from, to, granularity: "day" | "week", platform? })` returning stage counts and shares per period, page views per page (pain pages per pain ID with the pain's current name), and opens per pain. Guarded like CMS operations (`CMS_ADMIN_TOKEN`). Where the screen lives depends on confirm.md item 2; the query is built either way.

11. **Link previews.** Nothing to build: crawlers do not run the app's JavaScript, so they never send. A test asserts no server-side rendering path emits measurement.

## Overlaps

- **required-signup-gate, account-signup "What will be saved"**: says the gate lists exactly picks, fixes and opt-in and "nothing else on the device is sent". This change ADDS "Gate lists this visit" rather than rewriting that block. The two must be reconciled before both archive (confirm.md item 5). *Resolved 2026-10-19: required-signup-gate amended (confirm 5).*
- **required-signup-gate, account-signup "Signup privacy"**: says "Before signup, nothing from the device SHALL be sent" and "Opened or selected pains ... SHALL NOT be sent". Measurement sends pain opens and stages before signup, and this change ADDS "Link the visit at signup or sign-in". Same reconciliation (confirm.md item 5). *Resolved 2026-10-19: required-signup-gate amended (confirm 5).*
- **required-signup-gate, account-signup "Gate moments for measurement"**: this change consumes those moments and adds a `signed-in` moment; that requirement's "SHALL NOT send them anywhere" becomes untrue once this change ships. *Resolved 2026-10-19: required-signup-gate amended (confirm 5).*
- **required-signup-gate, pain-explorer "Sign-in link when signed out"**: sign-ins from that link also link the visit; whether they count as `signed-in` / `gate-reached` is confirm.md item 3.
- **required-signup-gate, privacy-page "Placeholder content matches behaviour"**: once measurement is on, the placeholder privacy page must describe it; owned by the privacy change, gated by decision 4.
- **on-device-choices "Nothing sent before signup"**: MODIFIED here; required-signup-gate does not touch it, but it modifies two other requirements in the same capability.
- **pain-explorer "Opening a pain", "Ways it can be better", "Moving on"**: hooks are added without changing their behaviour, so no delta; required-signup-gate MODIFIES "Moving on".
- **Pain pages change (spec 012)**: the `pain` page view and pain opens on pain pages; it must not record how a visit arrived. Its ID/slug stability work is confirm.md item 6.
- **Support change (spec 009)**: `support-*` stages; the embedded Stripe form keeps `support-completed` in the same visit (today's hosted Checkout redirect starts a new one). Amounts and cadence stay in 009's records.
- **Privacy change (spec 010)**: privacy note, "What we count", lawful basis, access and deletion requests (export/unlink requirement here).
- **Admin change (006)**: placement of the report.
- **Help build It change (011)**: `help-*` stages and the `help` page view.

## Risks / Trade-offs

- [Reload splits a visit; only the part with signup is linked] → Accepted by the founder; the report says so.
- [Hosted Stripe Checkout leaves the site, so `support-completed` lands in a new (signed-in, linked) visit] → Funnel shares for Support are approximate until the embedded form (009); linking keeps the account-level answer correct.
- [Published pain IDs can be renamed in the editor, splitting a pain's rows] → No production data yet; confirm.md item 6.
- [Someone who learns another visit's number could link it to their account] → Visit numbers are random UUIDs that never leave the device except to It's server; a visit can be linked only once.
- [Blockers drop requests] → Counts are lower bounds; the report says blocked requests are missed.
- [Legal: linking pre-signup page views (some pain pages touch health) may need consent in the UK/EU] → Switch stays off in production until confirm.md item 1 is answered.

## Migration Plan

- Apply after required-signup-gate. Ship the server (tables, procedures, report) first; it accepts messages but nothing sends.
- Ship the app with the switch off. Turn it on only in a release that also carries the privacy wording.
- Rollback: turn the switch off; tables stay (records are kept indefinitely).

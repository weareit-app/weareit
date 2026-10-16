# Concept inventory — DRAFT

Daniel Jackson's concept design, as operationalized by Meng & Jackson (arXiv:2508.14511): each concept has its own purpose, state and actions; **concepts never call each other**; all cross-concept behavior lives in **synchronizations** (when action X completes, where state Y holds, then invoke Z). Full detail per piece — inputs, outputs, guarantees, research questions — is in [`pieces.yaml`](pieces.yaml) (source of truth; this page is the map).

## v0.1 concepts

| Concept | Purpose (one line) | Capability kind | Page |
|---|---|---|---|
| `catalog` | versioned pains/dreams/ideas with honest status | query | 1 |
| `selection` | remember chosen futures per pain | authorized_action | 1 |
| `interest` | yes/maybe/no on ideas, not a commitment | authorized_action | 1, 3 |
| `disclosure` | open/collapse items without losing work | ui_renderer | 1 |
| `visitor-session` | explore personal + societal pages before signup; nothing leaves the device | pure_calculation | personal, societal |
| `identity` | save and restore (password or passwordless) | authorized_action | after 1 |
| `consent` | record exactly what someone allowed | authorized_action | after 1, 3 |
| `donation` | give once/monthly, cancel easily | long_running_process | 2 |
| `offer` | volunteer skills/time; know it's not matched yet | authorized_action | 3 |
| `telemetry` | funnel counts without trackers | authorized_action | all |

Non-concept pieces: `propose-ideas` (algorithm, pure), `journey-view` and `admin-view` (renderers), `payment-connector` (connector).

**Post-v0.1:** `funding-ledger` (sidebar, optional), `story`, `invitation`, `matching`.

## Synchronizations (v0.1)

```
sync claim-on-signin
  when identity.signIn() -> a        where visitor-session s current
  then selection.transfer(s, a); interest.transfer(s, a); visitor-session.end(s)

sync propose-on-select
  when selection.selectDream | unselectDream (owner, pain)
  then propose-ideas(selected dreams for pain) -> journey-view

sync contact-requires-consent
  when offer.setFollowUp(o, contacted)  where not consent(owner(o), contact)
  then reject

sync forget-on-delete
  when identity.deleteAccount(a)
  then selection.forget(a); interest.forget(a); offer.withdraw(*a); consent.revoke(*a)
```

## Design checks to discuss

1. **Selection vs interest split.** Dreams (what better looks like) and ideas (what could help) are different purposes, so two concepts. Product spec §12 bundles them as `selectedIdeaIdsByDream`; this splits them. Agree?
2. **Owner refs are polymorphic** (session or account) — that's what makes `claim-on-signin` a sync rather than identity reaching into selection.
3. **`propose-ideas` is the replaceability test** (architecture plan §6 item 2): curated lookup now; graph search/LLM later behind the same contract.
4. **`journey-view` is the renderer replaceability test** (§6 item 1).

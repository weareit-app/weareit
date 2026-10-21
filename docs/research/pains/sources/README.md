# Pain catalog sources

Snapshots the catalog was seeded from, and lists that discovery reads. None of these are the catalog itself: [`../catalog.json`](../catalog.json) is.

| File | What | Trust |
| --- | --- | --- |
| `pain-inventory-2026-10-16.yaml` | The 125-pain inventory, moved here from `docs/spec/pains/` on 2026-10-19. Field meanings: [`docs/spec/pains/pain-inventory.md`](../../../spec/pains/pain-inventory.md). | Founder provisionally approved the wording. Its `evidence` lines were not re-opened, so the catalog keeps them as `leads`. |
| `published-seed-2026-10-19.json` | Groups and pains of the content editor's seed graph (`packages/content/src/tier-1.ts`, imported by `packages/database/src/tier1-import.ts`): 18 groups, 112 pains. | Stands in for the editor's latest published version. The drift check compares against the live editor. |
| `personal_pains_hierarchy_relations_v2.csv` | The founder's personal-pains pool: 808 SKOS `broader` links (`subject_id, relation, object_id, provenance`) placing 774 pains under 34 sub-areas and 24 areas. | **AI-generated, leads only.** Wording is a generated gloss, some items paraphrase survey questions, and placements are often wrong (e.g. "people treat me with less courtesy" under food insecurity). A candidate from here still needs an opened source. Checked 2026-10-19: no names, contact details or notes about anyone. |
| `personal_pains_hierarchy_audit_v2.csv` | Counts for the pool: 774 pains, 24 top-level and 34 intermediate branches, 138 high, 544 medium and 92 low confidence placements. | As above. |

To refresh the published snapshot, export `personalPainDomains` and `worldPainDomains` from `packages/content/src/tier-1.ts` with `tsx` into the same shape (`domains[]` of `{id, title, scope, order, pains[{id, title, description, dreams}]}`). Once the editor has changed, prefer the drift check against the live editor.

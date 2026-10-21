# Pain inventory

Every pain on the personal page ("What could be better for you?") and the societal page ("What could be better for us?"): the launch set plus new candidates, each mapped to outside lists. The full data was in `pain-inventory.yaml`, now kept as a snapshot at [`docs/research/pains/sources/pain-inventory-2026-10-16.yaml`](../../research/pains/sources/pain-inventory-2026-10-16.yaml); this page explains it and holds the founder's review.

**Superseded 2026-10-19** by the pain catalog, [`docs/research/pains/catalog.json`](../../research/pains/catalog.json), seeded from this inventory with every ID kept. `main` and `more_like_this_under` no longer apply: a pain is shown or not shown.

Status: **provisionally approved** by the founder, 2026-10-16, pending their own further review and outside feedback. Built in a side session from the sources below. Nothing here changes the launch content (`packages/content/`) or the specs; approved additions still need dreams and ideas before they can ship (FR-012).

## How to read an entry

| Field | Meaning |
| --- | --- |
| `id` | Stable id. Current pains keep their `packages/content` id. |
| `name`, `line` | Short name and first-person line, as they would appear on screen. Candidate wording is a first draft. |
| `page` | `personal` or `societal`. |
| `heading` | Heading on the page (regrouped by the founder, 2026-10-16). |
| `main` | `true` if listed as a main pain under its heading. |
| `more_like_this_under` | Pains (on either page) whose **More like this** shows this pain. A pain can have several. |
| `draft_name`, `draft_line` | Earlier wording, kept for reference. |
| `status` | `current` (in tier-1.ts or FR-019) or `candidate` (new). |
| `founder_choice` | Candidates only: `keep`, `cut` or `later`. |
| `gap` | `true` when nothing in the current set covers it. |
| `maps` | Framework entries (see the key below). |
| `evidence` | Why it is common: a representative survey or statistic where one exists, otherwise the framework that names it. |
| `overlaps` | Other pains that cover some of the same ground. |
| `founder_pool` | Matching area in the founder's personal-pains hierarchy (`personal_pains_hierarchy_relations_v2.csv`, 774 pains in 24 areas). |

## Framework key

The founder asked for all six lists (2026-10-16).

| Key | List | IDs used | Covers |
| --- | --- | --- | --- |
| `oecd` | OECD Well-being Framework, *How's Life?* (2020 onward) — 11 current well-being dimensions | Dimension names; no official codes | Both pages |
| `whoqol` | WHOQOL-BREF (WHO, 1996) — 26 items in 4 domains | Item numbers `Q1`–`Q26` | Personal |
| `sdg` | UN Sustainable Development Goals | Official target numbers, e.g. `8.5`, `16.7` | Mostly societal |
| `maxneef` | Max-Neef, *Human Scale Development* (1991) — 9 fundamental human needs | Need names; no official codes | Both pages |
| `gallup` | Gallup's five elements of wellbeing (Rath & Harter, 2010) | Element names | Personal |
| `wikidata` | Wikidata items | QIDs, for the future "tag anything" layer | Both pages |

OECD dimensions: Income and wealth · Work and job quality · Housing · Health · Knowledge and skills · Environmental quality · Subjective well-being · Safety · Work-life balance · Social connections · Civic engagement.

WHOQOL-BREF items: Q1 overall quality of life · Q2 satisfaction with health · **Physical** Q3 pain, Q4 need for medical treatment, Q10 energy, Q15 getting around, Q16 sleep, Q17 daily activities, Q18 capacity for work · **Psychological** Q5 enjoying life, Q6 meaning, Q7 concentration, Q11 body image, Q19 self-esteem, Q26 negative feelings · **Social** Q20 personal relationships, Q21 sex life, Q22 support from friends · **Environment** Q8 safety, Q9 healthy physical environment, Q12 enough money, Q13 information, Q14 leisure, Q23 home conditions, Q24 access to health services, Q25 transport.

Max-Neef needs: Subsistence · Protection · Affection · Understanding · Participation · Leisure (idleness) · Creation · Identity · Freedom.

Gallup elements: Career (purpose) · Social · Financial · Physical · Community.

**Wikidata caveat.** QIDs were found by searching Wikidata's API for the concept behind each pain and picking the closest item by hand. They name the general concept (e.g. `Q223270` loneliness), not the pain wording. Check before relying on one; `null` means no good item was found.

## Sources for "why it's common"

All URLs come from the founder's source map and CSVs, or are standard public series. They were not re-opened in this pass.

- Founder's personal-pains CSVs (Downloads, 2026-10-16): `personal_pains_search_pass_1.csv`, `personal_pains_raw_extracted.csv`, hierarchy v2. Their wording is a generated gloss, not source wording.
- `docs/source/it_mvp_personal_pain_source_map.md` and `docs/source/MVP_Societal_Pains_Source_Registry.md` (AI-generated, unchecked; treated as leads).
- Societal frequency: Gallup "Most Important Problem" (monthly, U.S.) <https://news.gallup.com/poll/1675/most-important-problem.aspx>; Ipsos "What Worries the World" (monthly, ~30 countries) <https://www.ipsos.com/en/what-worries-world>.

## Counts

| | Personal | Societal | Total |
| --- | --- | --- | --- |
| Current (tier-1.ts + Unemployment) | 16 | 15 | 31 |
| New candidates, batches 1–4 | 31 | 23 | 54 |
| New candidates, batch 5 | 16 | 15 | 31 |

Note: `specs/001-personal-page/spec.md` (FR-019) says the launch set has "17 personal". tier-1.ts has 15 personal pains, so with Unemployment it is 16. The spec should be corrected by whoever owns it.

## Findings

**Biggest gaps on the personal page** (areas the outside lists all name but the launch set has nothing for): low mood / depression, chronic pain and health conditions, getting medical care, debt, food, home (quality, stability, safety), caregiving and parenting, partner relationships, life admin, transport, job quality and insecurity, disability access. Each is also a large area in the founder's 774-pain pool (debt 74, life admin 120+, job quality 62, health care 40).

**Biggest gaps on the societal page**: cost of living (the top worry in Gallup and Ipsos since 2022), climate and pollution, crime and safety, immigration, schools, mental health, drugs, homelessness, AI and jobs, privacy. The current societal set is strong on democracy and information but has nothing on planet, safety or education.

**Headings (founder, 2026-10-16):** personal: Body · Mind · Money · Work · Home · Time · People · Purpose. Societal: Government · Economy · Health · Community · Fairness · Information · Environment · Safety · Kids · Making change. These replace the tier-1 headings (Head, Doing, Power, Each other, Dignity, Information, Change).

**Overlaps to decide on** (both could stay, as with Loneliness / Nobody to do things with):

- Broke · No cushion · Debt · Running out of food — all money stress; No cushion is the most redundant with Broke.
- Poor sleep · Always tired · Burnout — tiredness from three causes.
- Loneliness · No one to lean on · Nobody to do things with · Drifted apart — four faces of connection.
- Unemployment · Job could go · AI — loss of work now, soon, and as a society.
- Meaningless work · Wrong career · No path — direction at work.
- Running out of food (personal) ↔ Hunger (societal); Can't get care ↔ One illness away; Might lose my home ↔ Rent eats everything ↔ People sleeping outside; Drinking too much ↔ Addiction; Not safe here ↔ Crime and violence; Doomscrolling ↔ Screens and kids — the same issue seen from "me" and "us". These pairs are useful because a pick on one page can suggest the other.
- Kids' future · Where you're born — both about fairness across generations and places.
- **Treated differently** is first-person ("who I am counts against me") but sits on the societal page. Worth checking if it belongs on the personal page.

**Pains no framework really covers.** These map only loosely (to OECD *Civic engagement* or Max-Neef *Participation*). They are It's own thesis, not something the outside lists measure, so evidence for "common" is weaker:

- Nothing ever changes · Shouting into the void · Alone in caring (Change)
- I don't know who to vote for
- Decided somewhere else (local control)
- Procrastination and Can't focus map to no WHOQOL domain except concentration (Q7), and to no SDG.

**Where the lists are thin.** SDGs say nothing about relationships, grief, meaning or self-esteem; WHOQOL says nothing about politics, climate or information; Gallup's five elements are too coarse to tell most pains apart. OECD and Max-Neef cover everything but loosely. For the future tag layer, Wikidata is the only list with stable IDs for almost every pain (108 of 116 found; the 8 without are named in the YAML).

## Founder review

Recorded as `founder_choice` in the YAML: `keep`, `cut` or `later`. Batches of about 15.

| Batch | Date | Shown | Keep | Cut | Later |
| --- | --- | --- | --- | --- | --- |
| 1 — personal: Body, Head, Money | 2026-10-16 | 15 | 15 | 0 | 0 |
| 2 — personal: Home, Time, People, Doing | 2026-10-16 | 16 | 16 | 0 | 0 |
| 3 — societal: Economy, Planet, Power | 2026-10-16 | 13 | 13 | 0 | 0 |
| 4 — societal: Safety, Dignity, Each other, Future, Information | 2026-10-16 | 10 | 10 | 0 | 0 |
| 5 — basic needs, inner life, worries, what It is built for | 2026-10-16 | 31 | 18 | 0 | 13 |
| 6 — from outside review | 2026-10-16 | 9 new | 9 | 0 | 0 |
| **Total** | | **94** | **81** | **0** | **13** |

Batch 5 came from a brainstorm, not the source lists: needs the frameworks name but batches 1–4 skipped, Max-Neef's inner-life needs, Gallup/Ipsos worries not yet covered, and pains worked backwards from what It is built for (people finding each other and acting together). Four of its 'later' items (Lost myself, Short fuse, Past still hurts, Lost my faith or community) were 'no preference' and are recorded as later.

Approved set: **112 pains — 58 personal, 54 societal** (31 current + 81 added). 97 are main pains; 15 appear only under **More like this**. 13 more are 'later'. Inventory total: 125. In batch 6 Creativity was unparked and Moral decline was parked.

**Launch size (founder, 2026-10-16):** keep all approved pains, but mark about six per heading as "shown first"; the rest sit behind a "More" under each heading. Which ones are shown first, and how "More" looks, is for the page specs (001, 002) to decide. Every approved pain still needs dreams and ideas before it ships (FR-012).

**Structure (founder, 2026-10-16, revised after outside review):** each heading lists its main pains. An opened pain can offer **More like this**: related pains, which may come from the other page. A pain can be reached from several places but is one pain with one set of dreams. People only see one level of More like this at a time, so there are still at most three levels: heading → pain → related pain. This replaced the earlier single-parent "Say more" tree, which hid some pains under parents they weren't part of (e.g. Layoffs under Mistreatment, Dating under Loneliness).

**Wording (founder, 2026-10-16):** names are short plain topics (mostly one word, e.g. Focus, Rent, War); every line starts with "I"; US English. Names, lines, grouping and the `refines` tree are provisionally approved (2026-10-16), pending outside feedback. See [pain-tree.md](pain-tree.md) for the readable view.

## Outside review (2026-10-16)

The founder shared a written review of the provisionally approved tree and adopted these points:

- **Structure:** several routes to one pain (above). "Say more" is now **More like this**.
- **Added:** Safety at home (sensitive), Homeless, Learning, Belonging, Intimacy (personal); Trust, Disasters, Freedoms, Infrastructure (societal). Creativity unparked.
- **Not added:** "Something I want to do". The reviewer explained it was about a possible future entry point (starting from an aspiration rather than a pain), not a missing pain. Direction already covers most of it.
- **Hormones** stays parked (founder did not promote it).
- **Rewording**, to avoid building one explanation or one threshold into a pain: Fitness, Disability, Rent, Immigration, Inequality, War, Pollution, Medical bills, Mental health. The earlier lines are kept as `draft_line`.
- **Renames:** Work → Mistreatment; Company → Invitations; heading News → Information. Moral decline parked under Trust.

### Recommendations for the page specs (001, 002), recorded at the founder's request

These are for the spec owners to decide; nothing here changes the specs.

1. **"Something else" option** on each page, so someone who doesn't see their pain can still go on. Any typed text is pre-signup free text and must stay on the device (AGENTS.md privacy invariants), so it cannot be used as feedback unless the person later chooses to share it.
2. **Extra care for sensitive pains** (Safety at home, Addiction, Trauma, Illness, Debt and other money pains): never shown to others or used for matching by default; for Safety at home, help-line ideas first and nothing that encourages contact.
3. **Dreams reachable from several pains.** The same dream (e.g. "I can live well regardless of employment") should be able to sit under Unemployment, Broke and Burnout.
4. **The personal/societal split is about point of view, not about which fixes show.** A personal pain can lead to collective or policy ideas, and a societal pain to something one person can do.
5. **Judge each pain by what follows it:** does picking it show futures the person hadn't considered? Loneliness → only "I have friends" fails this test.
6. **Test with real people** across ages, incomes, abilities, family situations and politics. Watch whether they find their pain without help and whether any wording makes them feel judged. Ask about the list size too: 97 main pains is a lot even with about six shown per heading.
7. **Later:** a way to start from something someone wants to do, not only from a pain.

**Open:** four Ipsos *What Worries the World* items have no pain yet: rise of extremism, terrorism, pandemics, access to credit. Suggested as 'Say more' items under Polarization, War, Medical bills and Debt.

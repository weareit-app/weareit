# Idea Research: Brainstorming fixes per kind

- **Slug**: fix-kind-ideation
- **Created**: 2026-10-20
- **Question**: For each kind of fix (and each candidate kind), which established ideation or specification methods would help an LLM writer produce good, non-obvious, actionable fixes of that kind, and what fields should a fix of that kind carry?
- **Evidence confidence (overall)**: high on the behavior-science methods (peer-reviewed primary papers read as abstracts or full text); medium on product, organizing, and planning methods (originators' own sites or handouts, some only through secondary pages); medium on LLM ideation risks (a handful of recent primary papers, none testing It's exact setup). No source tests "brainstorm per kind, then assemble cards" directly.
- **Scope**: research only. Kinds come from `docs/style/copy-style-guide.md` ("Kinds of fixes"); the current pipeline is in `tools/possibilities/` (one writer drafts all fixes, then `briefs/classify-kinds.md` tags kinds and `briefs/feature-pitch.md` rewrites features). Example fixes below are illustrations in It's voice, written for this note, not quotes and not sourced claims.

## Summary

- **Every kind already has a mature "shape" in some field.** Feature has job stories and opportunity solution trees; Task has the GTD next action and EAST; Habit has implementation intentions and Tiny Habits recipes; Practice has deliberate practice and NVC's request; Learn has "be able to" objectives; Project has SMART and a definition of done; Group and New group have organizing practice; Ask has the Midwest Academy strategy chart; Path has theory of change. A per-kind brief can borrow each shape as **required fields**, not as copy.
- **The fields should stay out of the copy.** Job stories, if-then plans, and SMART all produce stiff sentences ("When X, I want Y, so I can Z") that break the copy guide's voice. Use them as structured fields the writer fills, then write the title and text from them.
- **Feature: write a job story first, then the pitch.** Klement's job story starts from a situation, not a persona, and keeps the solution separate from the motivation and outcome. That matches It's pains well, and makes the founder's complaint ("features need to sound like actual features") easier to fix: the pitch names the capability that serves the job. Pair it with Torres's rule of at least three solutions per opportunity and the existing `feature-patterns.md` table.
- **Habit and Schedule split cleanly on the trigger.** Habit = a cue inside an existing routine (Wood & Neal: habits are context-cued, without a goal in between); Schedule = a clock or calendar slot. Gollwitzer's if-then form ("Whenever situation x arises, I will…") and Fogg's "After I [anchor], I will [tiny behavior]" give the Habit fields: cue, tiny behavior.
- **Habits take long and vary a lot**: 18 to 254 days to plateau in Lally et al.'s study, and missing one day didn't materially matter. Habit copy should never promise a number of days; one missed day is fine to say.
- **Implementation intentions have the strongest evidence of anything here** (meta-analytic d = 0.65 for if-then plans; mental contrasting plus if-then plans, g = 0.34). That supports making an if-then first step available to Task, Habit, and Schedule, not only Habit.
- **Task fits the GTD "next action" and EAST.** The data model's `firstStep` (20 minutes or less) is already a next action. One-time environment changes are EAST's "make it easy" and BCW's "environmental restructuring": defaults, removing hassle, simplifying.
- **Practice needs a repeated situation and feedback; Learn needs a "be able to" statement.** Deliberate practice is structured, repeated, with feedback, but explains far less variance outside games, music, and sport (under 1% in professions per Macnamara et al.), so Practice copy shouldn't oversell it. Learn should use a verb above "remember" in revised Bloom terms (apply, decide, spot), which also enforces the copy guide's "not just learn about".
- **Group and New group map to organizing practice.** Ganz's five practices (relationships, story, strategy, action, structure), McAlevey's "structure tests," and ABCD asset mapping give fields for what members actually do and what the first real test of the group is.
- **Ask/advocate earns a kind.** The Midwest Academy chart insists the target is "always a person with a name, not an institution", and the Community Tool Box plan names a decision-maker and sources of influence. Hirschman's exit and voice are distinct responses, and Flynn & Lake found people underestimate by as much as half how often others say yes to direct requests. Asks need fields (decision-maker, specific yes/no ask, who else asks) that Task doesn't carry.
- **Use a resource earns a kind, mainly for its fields.** Benefits go unclaimed for reasons of awareness and complexity (Bhargava & Manoli, IRS field experiment), and 211 handles over 13 million requests a year. Fields: who runs it, who qualifies, how to reach it, what to have ready, and cost.
- **Give/support is weaker as a kind and has a naming clash.** The evidence on giving and well-being is mixed in large replications, and "support" is It's reserved word for paying It. Mutual aid fits better under Group or New group (Spade frames it as organizing, not charity). If kept, call it "Help someone" or "Give", not "Support".
- **The literature suggests one more kind: Leave or switch (Hirschman's "exit").** Moving to a co-op bank, changing doctors, or leaving a job are neither Tasks nor Asks in spirit. Small numbers of cards may need it; test before adding.
- **Per-kind generation helps diversity but risks filler and incoherence.** LLM ideation collapses into duplicates (about 5% unique out of 4,000 in Si et al.), homogenizes across users and models, and gets more diverse when prompts are attribute-conditioned or narrowed (Yu et al.; Rietzschel et al. for humans). Quotas per kind would invite filler, and per-kind pools can produce fixes that don't deliver the card's dream. Use per-kind pools with **no quotas and an explicit "nothing good here" option**, then a separate assembly step that checks each fix against the dream.
- **A Zwicky box (morphological analysis) is the right frame for "brainstorm per kind, then assemble."** Treat kind, lens, and ambition as parameters, drop inconsistent pairs first (Habit × societal change rarely fits), and generate only into the consistent cells.

## Feature (something It would build)

**Methods**

- **Jobs to be done (Christensen).** A job is the progress a person tries to make in a particular circumstance, with functional, social, and emotional sides. — [source: christenseninstitute.org/theory/jobs-to-be-done; HBR 2016 article page opened, body paywalled] (confidence: high that this is the definition)
- **Job stories (Klement, 2013).** A situation, then a motivation, then an expected outcome ("When…, I want to…, so I can…"). Klement's point is that user stories ("As a [persona]…") tie the solution to motivations and lose the situation and the anxieties around it; job stories keep the trigger situation and leave the solution open. — [source: intercom.com/blog/using-job-stories-design-features-ui-ux, by Klement] (confidence: high) *Relevance: It's pains are situations already. "When I'm lying awake at 2am…" is a natural job-story start; a persona would add nothing.*
- **Outcome statements (Ulwick, outcome-driven innovation).** A desired outcome is phrased as a direction (minimize or increase), a metric (time, likelihood), an object, and a context clarifier, e.g. "minimize the time it takes to…". — [source: secondary only: productlessonsravi.substack.com and jobs-to-be-done.notion.site, both citing Ulwick's *What Customers Want*; Strategyn's own page opened but didn't give the format] (confidence: medium) *Relevance: a "so I can" clause written as a measurable outcome keeps features from being vague.*
- **Opportunity solution trees (Torres).** An outcome at the root, then opportunities (unmet needs, pain points, desires), then solutions, then assumption tests. Test for a disguised solution: if there is only one way to address an "opportunity", it's a solution. Brainstorm for one target opportunity at a time and compare at least three solutions. — [source: producttalk.org/opportunity-solution-trees, 2023] (confidence: high) *Relevance: dream ≈ outcome, pain sub-situations ≈ opportunities, features ≈ solutions. "At least three per opportunity, then compare" is a usable brief rule.*
- **How Might We (d.school).** Reframe a challenge as a question to open ideation, by amplifying what works, exploring the opposite, or pushing to an extreme. — [source: dschool.stanford.edu/resources/how-might-we-questions; IDEO Design Kit page returned 403] (confidence: medium) *Relevance: useful as a step before the job story, to get several angles on one situation.*

**Fields a Feature fix could carry**

- `jobStory`: `{when, want, soThat}`, internal only.
- `pattern`: one of the `feature-patterns.md` rows (directory, private match at a threshold, campaign organizing, and so on), or `new`.
- `dataOrTools`: the public data or existing tools that would make it work (already asked for in the copy guide).
- `alternativesConsidered`: at least two other ways to serve the same job (Torres), internal only.
- `riskiestAssumption`: what must be true for people to use it, internal only.
- Existing: `title` (names the capability), `whatChanges` (verb-first pitch), `firstStep` (doable today without It, or "Tell us you'd use this").

**What the writer brief for this kind could ask for**

> For each pain situation, write a job story (when / want / so that) without naming a solution. Then list three different things It could build for that job, each matched to a feature pattern or marked new, and keep the strongest. Write the title as the capability and the text as a verb-first pitch naming the data or tools behind it.

- Good: **Title:** "See tenant groups and rent rules for your address". **Text:** "Shows the tenant association, rent rules, and free legal help that apply to your building, drawn from city rental registries and court self-help directories, so you know who to call before your lease renewal arrives."
- Bad: **Title:** "Organize your building". **Text:** "It could help renters come together." (A user action as the title, "It could", no data, no job.)

## Task (do once)

**Methods**

- **GTD next action (Allen).** A next action is "your physical, visible next step"; a project is any outcome needing more than one action. — [source: gettingthingsdone.com/2010/10/some-key-gtd-definitions] (confidence: high) *Relevance: this is the Task/Project boundary, and the data model's `firstStep` is already a next action.*
- **EAST (Behavioural Insights Team, 2014).** Make it Easy (defaults, cut the "hassle factor", simplify), Attractive, Social, Timely (prompt when people are receptive, help them plan their response to events). — [source: BIT EAST executive summary PDF, transparencyschool.org mirror, text extracted] (confidence: high) *Relevance: one-time changes that keep working (grayscale, blackout curtains, autopay) are "set a default" and "remove a hassle." That gives the writer a lens for non-obvious Tasks.*
- **Behaviour Change Wheel (Michie, van Stralen & West, 2011).** Behavior comes from capability, opportunity, and motivation (COM-B). Nine intervention functions include environmental restructuring, enablement, training, education, modelling, and restriction; seven policy categories include regulation, legislation, and service provision. — [source: PMC3096582] (confidence: high) *Relevance: "environmental restructuring" is the Task lens; the policy categories are the Ask lens (below).*
- **Implementation intentions (Gollwitzer 1999; Gollwitzer & Sheeran 2006).** Plans of the form "Whenever situation x arises, I will initiate the goal-directed response y!" hand control to a cue. Meta-analysis: d = 0.65 on goal attainment. — [source: Gollwitzer 1999 abstract via OpenAlex, doi:10.1037/0003-066X.54.7.493; effect size as cited in Wang et al. 2021, Frontiers in Psychology; the 2006 chapter itself not read] (confidence: high on the format; medium on the exact effect size, read through a citing paper) *Relevance: a Task's first step works better with a when and where ("Tonight, after dinner, order…").*

**Fields**

- `action` + `object` (title), `doneWhen` (what is true afterward), `keepsWorking: bool` (one-time change that persists), `lever`: default | remove hassle | simplify | timing | other, `firstStep` with a when.

**What the writer brief could ask for**

> List one-time actions that change the situation, especially ones that set a better default or remove a hassle so the change keeps working without willpower. For each, say what is true when it's done. Write the title as verb plus object; put the "why it works" in the text.

- Good: **Title:** "Move your phone charger out of the bedroom". **Text:** "If the phone charges in the kitchen, the late-night scroll needs a walk, and most nights you won't bother. A cheap alarm clock covers the one thing the phone was doing there."
- Bad: **Title:** "Reduce screen time". (No action, no object, no done state; it's an outcome.)

## Schedule (recurring calendar commitment)

**Methods**

- **Implementation intentions with a time cue.** The if-then format works for clock cues ("Every Sunday at 4pm…") as well as situational ones. — [source: Gollwitzer 1999] (confidence: high)
- **EAST "Social": commit to others.** Commitment devices are often effective because they're social. — [source: BIT EAST] (confidence: high) *Relevance: a standing commitment with another person (a weekly walk) is a Schedule that also carries the social lever.*
- **WOOP / mental contrasting (Oettingen).** Wish, Outcome, Obstacle, Plan; the plan is "If [obstacle], then I will [action]." Meta-analysis of mental contrasting with implementation intentions: 21 articles, 15,907 participants, g = 0.34, larger when experimenter-led. — [source: woopmylife.org/en/practice; Wang et al. 2021, Frontiers in Psychology] (confidence: high) *Relevance: the "obstacle" step gives a Schedule fix its one plain limit ("If the weather's bad, call instead of walking").*

**Fields**

- `what`, `cadence` (weekly, monthly), `withWhom` (optional), `slot` (a suggested day or time), `likelyObstacle` + `ifThen` (WOOP), `firstStep` (put the first one on the calendar or invite the person).

**What the writer brief could ask for**

> Name what repeats, how often, and with whom. Name the most likely reason it would lapse, and give one if-then fallback in the text if it changes what the reader would do.

- Good: **Title:** "Set up a standing Sunday call with one old friend". **Text:** "A fixed time takes away the 'we should catch up' back-and-forth. If one of you can't make it, move it to the next evening rather than skipping the week."
- Bad: **Title:** "Stay in touch more". (No cadence, no slot, no person.)

## Habit (cue-triggered behavior; use sparingly)

**Methods**

- **Wood & Neal (2007).** Habits are learned links between a response and its context (place, preceding action); once formed, the context triggers the response without a goal in between, and habits shift slowly. — [source: Psychological Review abstract, PMID 17907866] (confidence: high) *Relevance: a Habit fix must name a context cue, not a goal.*
- **Lally et al. (2010).** 96 volunteers repeated a behavior daily in the same context for 12 weeks; time to reach 95% of automaticity ranged from 18 to 254 days, and missing one opportunity didn't materially affect formation. Lally later summarized the average as 66 days and stressed the variability. — [source: EJSP abstract via OpenAlex, doi:10.1002/ejsp.674; surrey.ac.uk interview with Lally, 2026] (confidence: high) *Relevance: never promise "21 days"; "missing a day is fine" is a true, useful limit.*
- **Fogg Behavior Model and Tiny Habits.** Behavior happens when motivation, ability, and a prompt come together. Tiny Habits recipes read "After I [anchor], I will [tiny behavior]"; a good anchor matches the new behavior's frequency, place, and theme. — [source: behaviormodel.org; tinyhabits.com/good-spot] (confidence: high on the format; the "celebrate" step and size limits only seen in secondary pages)
- **BCT Taxonomy v1 (Michie et al., 2013).** 93 behavior change techniques in 16 groups, built by expert consensus. — [source: Annals of Behavioral Medicine abstract, PMID 23512568] (confidence: high) *Relevance: a checklist the writer can scan for techniques beyond cue-and-repeat (habit reversal, restructuring the environment, prompts), mostly useful for the judge or a repair pass. Group names weren't verified from the paper.*

**Fields**

- `cue` (an existing routine with a clear end point), `behavior` (small enough to do even on a bad day), `replaces` (optional: the behavior it substitutes for).

**What the writer brief could ask for**

> Only write a Habit when the pain has a moment that recurs inside an existing routine. Name the cue and the small behavior in the title. Don't promise how long it takes.

- Good: **Title:** "When you put your phone on the charger, set tomorrow's alarm and leave it there". **Text:** "Pairing the new step with something you already do every night means you don't have to remember it. Missing a night doesn't undo it."
- Bad: **Title:** "Build a better bedtime routine". (No cue; this is a Project or an outcome.)

## Practice (skill improved over time, usually conversational)

**Methods**

- **Deliberate practice (Ericsson, Krampe & Tesch-Römer, 1993).** Expertise comes from effortful activities designed to improve performance. — [source: Psychological Review abstract via OpenAlex] (confidence: high on the original claim)
- **Macnamara, Hambrick & Oswald (2014).** Deliberate practice explained 26% of performance variance in games, 21% in music, 18% in sports, 4% in education, and under 1% in professions. — [source: Psychological Science abstract, PMID 24986855] (confidence: high) *Relevance: Practice fixes shouldn't imply that repetition alone makes someone good at hard conversations.*
- **Nonviolent Communication (Rosenberg).** Four components: observation, feeling, need, request. A request is specific, doable, and says what you do want. — [source: cnvc.org pages (founder and "four components" framing); request criteria from PuddleDancer Press, Rosenberg's publisher, secondary] (confidence: medium) *Relevance: gives a Practice a concrete "move" to rehearse, which avoids "communicate better" vagueness.*
- **Training (BCW intervention function).** Building skills is distinct from education (knowledge). — [source: PMC3096582] (confidence: high) *Relevance: the Practice/Learn line.*

**Fields**

- `skill`, `situation` (when it comes up), `move` (one concrete thing to try, like a question or a request), `feedback` (how the person knows it went better), `featureIdea` (already required).

**What the writer brief could ask for**

> Name the skill and the situation where it's used. Give one concrete move to try next time and a sign that it went better. Add the coaching feature It could build as `featureIdea`.

- Good: **Title:** "Practice asking for one specific change instead of airing every complaint". **Text:** "Asking 'Could you text me if you'll be home after nine?' gets a yes far more often than a list of what's been bothering you. Try it in the next small disagreement, not the biggest one."
- Bad: **Title:** "Communicate better with your partner". (No situation, no move.)

## Learn (usable skill or knowledge, often in one sitting)

**Methods**

- **Revised Bloom's taxonomy (Anderson & Krathwohl, 2001; Krathwohl 2002).** Six cognitive processes as verbs (remember, understand, apply, analyze, evaluate, create) crossed with four knowledge types (factual, conceptual, procedural, metacognitive); objectives pair a verb with a type of knowledge. — [source: secondary only, teachthought.com; Krathwohl 2002 metadata via OpenAlex, text not readable] (confidence: medium) *Relevance: "Learn how one city…" is "remember/understand" about someone else. The copy guide's rule matches Bloom: the Learn should reach apply or evaluate for the reader's own situation.*
- **Education vs. training (BCW).** Education builds knowledge; training builds skill. — [source: PMC3096582] (confidence: high)

**Fields**

- `ableTo` (verb above "understand": apply, check, decide, spot, calm, read), `inMinutes` (rough time), `where` (a named source if real; else speculative), `useWhen` (the situation the reader will use it in).

**What the writer brief could ask for**

> Write what the reader will be able to do afterward, starting with a verb they'd use in their own life. If the verb is "know about" or "learn how [someone else]…", it isn't a Learn: turn it into a Task, an Ask, or drop it.

- Good: **Title:** "Learn to read your lease for the renewal and rent-increase terms". **Text:** "Two clauses decide how much notice you get and how much the rent can go up. Ten minutes with a highlighter tells you whether you need help before you sign again."
- Bad: **Title:** "Learn about tenant rights". (No ability, no situation.)

## Project (bounded multi-step effort)

**Methods**

- **GTD project definition.** Any outcome needing more than one action. — [source: gettingthingsdone.com] (confidence: high)
- **SMART (Doran, 1981).** Specific, Measurable, Assignable, Realistic, Time-related; Doran said not every objective needs all five. — [source: secondary only, Wikipedia "SMART criteria" and projectsmart.co.uk; original article not opened] (confidence: medium)
- **Definition of done (Scrum Guide 2020).** A formal description of the state the work must reach to be finished. — [source: scrumguides.org] (confidence: high) *Relevance: a Project title names the finished thing; a `doneWhen` field forces it.*
- **Logic model (W.K. Kellogg Foundation).** Resources, activities, outputs (direct products), outcomes (changes in people), impact. — [source: Logic Model Development Guide PDF, EPA copy, text extracted] (confidence: high) *Relevance: separates "we held a repair night" (output) from "people kept their appliances" (outcome), which helps the text say why it matters.*

**Fields**

- `finishedThing` (title), `doneWhen`, `duration` (days or weeks), `steps` (3–6, internal), `withWhom`, `firstStep`.

**What the writer brief could ask for**

> Name the finished thing, roughly how long it takes, and who does it with you. List the steps internally to check it's really bounded; put only the first step in the copy.

- Good: **Title:** "Organize a tool-lending shelf in your building's laundry room". **Text:** "A shelf, a sign-out sheet, and a dozen donated tools is a weekend's work, and neighbors start talking to each other over it."
- Bad: **Title:** "Build community in your building". (No end, no finished thing.)

## Group (join one) and New group (start one)

**Methods**

- **Organizing practices (Ganz).** Ganz teaches five practices: relationship building, storytelling, strategizing, action, and structuring; leadership spreads in a cascade ("snowflake"). — [source: hks.harvard.edu, "Marshall Ganz: Practicing democracy"] (confidence: high that these are his five) *Public narrative's "story of self, us, and now" seen only in secondary pages (commonslibrary.org).*
- **Structure tests (McAlevey).** A structure test is a public, risky action (like a supermajority petition) that shows whether a group really has its most trusted members, the "organic leaders". — [source: thenation.com interview with McAlevey, 2017] (confidence: high) *Relevance: a New group fix is stronger when it names the first real test ("get most of the building to sign one letter"), not just "start a group".*
- **Asset-based community development (Kretzmann & McKnight, 1993).** Start from what a community already has: individuals' skills, citizen associations, and local institutions, rather than its needs. — [source: secondary only; DePaul ABCD Institute page returned 403; summary from search results] (confidence: medium) *Relevance: a Group writer should look for existing associations first (churches, PTAs, tenant groups, unions) before suggesting a new one.*
- **Mutual aid (Spade, 2020).** Mutual aid projects meet survival needs directly, get many people active beyond voting or posting, and let people practice new relationships; pitfalls include propping up the systems it works around and copying charity models. — [source: Social Text abstract, doi:10.1215/01642472-7971139] (confidence: high)
- **Modelling and social norms.** BCW lists modelling as an intervention function; EAST's "Social" uses networks and norms. — [source: PMC3096582; BIT EAST] (confidence: high)

**Fields**

- Group: `groupType` (named kind of group), `howToFind` (directory or lookup), `whatMembersDo`, `firstStep` (go to one meeting, message one organizer).
- New group: `who` (the people it's for), `purpose` (one sentence), `firstGathering`, `firstTest` (the first thing the group does together that shows it's real), `existingFirst` (what to check exists before starting one).

**What the writer brief could ask for**

> Group: name a kind of group that already exists in most places, how to find yours, and what members actually do. New group: say who it's for, the first gathering, and the first thing the group would do together that shows it's working. Check whether a Group fix would serve better before writing a New group.

- Good (Group): **Title:** "Join your building's tenant association". **Text:** "Members compare notes on repairs and rent increases and sometimes negotiate as one. Your city's tenant union usually keeps a list of building groups."
- Good (New group): **Title:** "Start a tenant association in your building". **Text:** "Start with a knock on five doors about one shared problem, like the broken heat. If most of the building will sign one letter to the landlord, you have a group."
- Bad: **Title:** "Connect with your community". (No group, no action.)

## Path (sequence toward a bigger change; not used yet)

**Methods**

- **Theory of change (Center for Theory of Change).** Start with the long-term goal and work backward to the preconditions that must be true, and how they connect; then choose interventions for each. — [source: theoryofchange.org/what-is-theory-of-change] (confidence: high)
- **Logic models (Kellogg).** Short-term outcomes in one to three years, longer-term in four to six, impact in seven to ten. — [source: Kellogg guide, EPA copy] (confidence: high) *Relevance: a Path's steps could be other fixes, ordered by precondition.*
- **Opportunity solution trees.** Nested opportunities, parent and child. — [source: producttalk.org] (confidence: high)

**Fields**

- `goal` (usually the dream), `steps` (ordered fix IDs from the same card or pain), `preconditionFor` (why step 2 needs step 1).

**What the writer brief could ask for**

> Don't write Paths in the per-kind pass. In assembly, if two or three fixes on a card depend on each other (Learn → Ask → New group), record the order as a Path rather than inventing a new fix.

## Where kinds blur, and how to decide

| Boundary | Test | Method behind the test |
| --- | --- | --- |
| **Task vs. Ask** | Does the outcome depend on someone else saying yes? If so, it's an Ask; its first step can still be a Task. | Midwest Academy chart (target with power to say yes); Hirschman's voice |
| **Task vs. Project** | One action finishes it → Task; more than one, with an end → Project. | GTD project definition |
| **Habit vs. Schedule** | Triggered by something you already do → Habit; triggered by a date or time → Schedule. | Wood & Neal (context cue); Gollwitzer (situation or time cue) |
| **Habit vs. Practice** | Same behavior repeated automatically → Habit; getting better at it with feedback → Practice. | Wood & Neal; Ericsson |
| **Learn vs. Practice** | Usable after one sitting → Learn; improves only with repetition in real situations → Practice. | Revised Bloom (apply); BCW education vs. training |
| **Group vs. Project vs. New group** | Has an end → Project; ongoing membership that exists → Group; ongoing and you start it → New group. A New group's first meeting is a Project-sized effort, but the kind follows what lasts. | GTD; Ganz (structure) |
| **Task vs. Use a resource** | The action is contacting an existing service → Use a resource. | 211; BCW "service provision" |
| **Any kind vs. Feature** | If the fix is a question It should ask the person, or something It would run, it's a Feature (the copy guide already says this). | Torres (solution vs. opportunity) |

A second check: map each fix to a **BCW intervention function**. Education → Learn; training → Practice; environmental restructuring → Task; modelling → Group; enablement → Use a resource or Feature; restriction, regulation, legislation → Ask (or a societal proposal). If a pain's fixes cover only one or two functions, the card is probably lopsided. — [source: PMC3096582; mapping is this note's, not Michie's]

## Candidate kinds

**Ask/advocate: earns a place.**
- Planning tools treat the ask as its own object: Community Tool Box plans name decision-makers and sources of influence; the Midwest Academy chart wants a named target, short-term to long-term goals, and a constituency with power over the target. — [source: ctb.ku.edu, Chapter 30 Section 7; Midwest Academy Strategy Chart 2015] (confidence: high)
- Hirschman treats voice (pushing for change from inside) as distinct from exit (leaving). — [source: Harvard University Press 1970 via CASBS catalog and ANU chapter abstract; definitions from secondary search summary] (confidence: medium)
- People underestimate by up to 50% how often others agree to a direct request, mainly because they ignore how awkward saying no is. — [source: Flynn & Lake 2008, JPSP, PMID 18605856] (confidence: high) *Relevance: a true, useful line for Ask copy, and a reason for a kind that encourages asking.*
- Many current Tasks are Asks already ("Ask your school board for a later start time", "Ask your city council to fund lawyers for tenants" in `classify-kinds.md`).
- Fields: `decisionMaker` (a role with power, like "your landlord" or "your city council member"), `ask` (a yes/no request), `alsoAsking` (who else could join), `precedent` (the named example), `firstStep`.

**Use a resource: earns a place, mainly for its fields.**
- Unclaimed benefits are common, and a mailing, simpler forms, and showing the benefit's size increased claims, while trying to reduce stigma or perceived audit risk didn't. — [source: Bhargava & Manoli 2015, AER, abstract via IDEAS/RePEc] (confidence: high)
- 211 is a free national referral line for basic needs (housing, food, transport, health), run by over 200 local organizations, with over 13 million requests a year. — [source: 211.org/about-us] (confidence: high, self-reported figures)
- The README already requires "real crisis and care resources" for sensitive pains, and status `existing_resource` already exists. A kind lets the writer fill the fields that make the resource usable.
- Fields: `resource` (name or type), `runBy`, `whoQualifies`, `howToReach` (phone, text, web), `haveReady` (documents), `cost`.

**Give/support: weak; fold it in elsewhere.**
- Prosocial spending raised happiness in some studies (Dunn et al. 2008; Aknin et al. 2013), but a 2020 registered replication found it in one of its paradigms and not in another. — [source: PMID 18356530; 23421360; 32250135] (confidence: high that evidence is mixed)
- Spade frames mutual aid as organizing, not charity, which puts it under Group or New group. — [source: Social Text abstract]
- "Support" is reserved for paying It (AGENTS.md), so a "support" kind would confuse. If a giving kind is wanted, call it "Help someone" and require a named recipient and what's given (time, skill, money).

**Missing kinds the literature suggests**
- **Leave or switch** (Hirschman's exit): change banks, doctors, carriers, jobs, apps. Common for consumer and work pains. Could sit under Task, but the copy differs (what to switch to, what you lose). Test on two or three pains before adding.
- **Talk to someone you know**: help-seeking from a friend or relative. Flynn & Lake's evidence supports it, but it fits Ask if Ask isn't limited to institutions. Recommend Ask covers both.

## Risks of per-kind generation

- **Filler from quotas.** LLMs run out of distinct ideas fast: of 4,000 generated seed ideas per topic, only about 200 were non-duplicates, and the share of new ideas fell as generation went on. — [source: Si, Yang & Hashimoto 2024, arXiv 2409.04109, section 7.1] (confidence: high) *Implication: a quota of, say, three Habits per pain will produce repeats or weak fits for pains with no recurring moment. Allow "none" with a reason, as the README already does for exemplars (`shortfallReason`).*
- **Homogenization across writers and models.** ChatGPT users produced less semantically distinct ideas than users of another tool (Anderson et al. 2024); stories written with LLM ideas were rated better but were more similar to each other (Doshi & Hauser 2024); different models give strikingly similar open-ended answers (Jiang et al. 2025). — [source: arXiv 2402.01536; Science Advances, PMID 38996021; arXiv 2510.22954] (confidence: high) *Implication: separate per-kind agents on the same model won't be independent. Diversity has to come from the brief (different methods and exemplars), not from running more agents.*
- **Structured prompts do help.** Chain-of-thought prompting brought GPT-4's idea diversity close to human groups (Meincke, Mollick & Terwiesch 2024); prompts conditioned on varied attributes produced more diverse and less biased data than plain class prompts (Yu et al. 2023); for people, narrower problems produced more creative ideas, though selecting the creative ones needed explicit instructions (Rietzschel, Nijstad & Stroebe 2014). — [source: arXiv 2402.01727 abstract (per-prompt numbers from alphaxiv.org summary, secondary); arXiv 2306.15895; Creativity Research Journal via OpenAlex] (confidence: medium–high; none tests kind-specific briefs for life-improvement copy) *Implication: per-kind briefs are a form of attribute conditioning and narrowing, so they should help diversity, but selection still needs its own step.*
- **Incoherent cards.** Fixes drafted per kind, apart from the dream, may not deliver it. The founder already killed fixes that "blur two different problems" (`config/style-guide.md`). *Mitigation: per-kind pools are drafted against the pain and its exemplars, then an assembly writer picks fixes per dream and must say how each delivers it; the judge's rubric checks it.*
- **Method language leaking into copy.** Job stories, if-then plans, and SMART goals read as templates. *Mitigation: keep them in fields and `writerNotes`; lint for "When I…, I want…" and "If… then I will…" patterns in titles.*
- **Kind drift between writers.** Separate writers will draw the boundaries differently. *Mitigation: keep the classify pass as an audit, using the boundary table above.*
- **Cost.** More agents per pain. The current single writer already does exemplar research; per-kind writers should share one exemplar set rather than each searching.

**Suggested shape** (for the founder to weigh, not a decision): shared exemplar research → per-kind pools (Feature, Task, Ask, Use a resource, Schedule/Habit, Practice/Learn, Group/New group/Project), each with its method, its fields, and no quota → card assembly against dreams, with a coverage check by kind and BCW function → classify-kinds as an audit → judges as now. A Zwicky box (kind × lens × ambition), with inconsistent pairs removed first, tells the assembler which cells are worth filling. — [source: swemorph.com/ma.html (Ritchey on Zwicky's general morphological analysis and cross-consistency assessment)] (confidence: high on the method; the application is this note's)

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Should Ask cover asking people you know, or only institutions and officials?]
- [NEEDS CLARIFICATION: Add Use a resource as a kind, or keep it as Task plus the `existing_resource` status with extra fields?]
- [NEEDS CLARIFICATION: Is Leave or switch worth a kind? Needs a test on two or three consumer and work pains.]
- Not verified from primary text: Ulwick's outcome-statement format, SCAMPER (Osborn/Eberle; not researched), Doran's SMART article, Ganz's public narrative, ABCD asset categories, revised Bloom wording, NVC request criteria, and the BCTTv1 group names.
- No study found tests per-category LLM generation for advice or action content; the risks above are extrapolated from research-idea, story, and product-idea tasks.

## Sources

All accessed 2026-10-20. "Opened" means the page or abstract was loaded and read; "secondary" means the claim was seen only on a page that isn't the originator's.

- Repo: `AGENTS.md`, `docs/style/copy-style-guide.md`, `tools/possibilities/README.md`, `tools/possibilities/briefs/{writer,classify-kinds,feature-pitch}.md`, `tools/possibilities/config/{feature-patterns,rubric,style-guide}.md`, `tools/possibilities/data-model.md` (local read)
- Christensen Institute, Jobs to Be Done theory: https://www.christenseninstitute.org/theory/jobs-to-be-done/ (opened)
- Christensen, Hall, Dillon & Duncan (2016), "Know Your Customers' Jobs to Be Done," HBR: https://hbr.org/2016/09/know-your-customers-jobs-to-be-done (opened; body paywalled)
- Klement (2013), job stories, Intercom blog: https://www.intercom.com/blog/using-job-stories-design-features-ui-ux/ (opened)
- Ulwick outcome statements, secondary: https://productlessonsravi.substack.com/p/why-i-havent-found-a-more-accurate ; https://jobs-to-be-done.notion.site/Comparing-ODI-and-PJTBD-Format-w-Reasoning-182e6d142d0580c18ce4d7004ecc9d01 (search results only); Strategyn: https://strategyn.com/jobs-to-be-done/customer-needs/ (opened; format not given)
- Torres (2023), Opportunity solution trees: https://www.producttalk.org/opportunity-solution-trees/ (opened)
- d.school, How Might We questions: https://dschool.stanford.edu/resources/how-might-we-questions (opened); IDEO Design Kit https://www.designkit.org/methods/3 (403)
- Fogg Behavior Model: https://www.behaviormodel.org/ ; https://behaviordesign.stanford.edu/resources/fogg-behavior-model (opened)
- Tiny Habits anchors and recipe: https://tinyhabits.com/good-spot/ (opened)
- Gollwitzer (1999), "Implementation intentions: Strong effects of simple plans," American Psychologist 54(7), doi:10.1037/0003-066X.54.7.493 (abstract via OpenAlex)
- Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology 38, doi:10.1016/S0065-2601(06)38002-1 (metadata only; effect size via Wang et al.)
- Wang, Wang & Gai (2021), meta-analysis of MCII, Frontiers in Psychology: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.565202/full (opened)
- WOOP: https://woopmylife.org/en/practice (opened)
- Lally, van Jaarsveld, Potts & Wardle (2010; online 2009), "How are habits formed," EJSP, doi:10.1002/ejsp.674 (abstract via OpenAlex); Lally interview: https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally (opened)
- Wood & Neal (2007), Psychological Review, doi:10.1037/0033-295X.114.4.843 (abstract via Europe PMC)
- Michie, van Stralen & West (2011), Behaviour Change Wheel: https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582/ (opened)
- Michie et al. (2013), BCT Taxonomy v1, Ann Behav Med, doi:10.1007/s12160-013-9486-6 (abstract via Europe PMC)
- GTD key definitions: https://gettingthingsdone.com/2010/10/some-key-gtd-definitions/ (opened)
- Behavioural Insights Team (2014), EAST executive summary: https://transparencyschool.org/wp-content/uploads/EAST_ExecSummary.pdf (opened, text extracted); BIT copy https://bi.team/wp-content/uploads/2014/04/BIT-EAST.pdf (loaded, not readable)
- Ericsson, Krampe & Tesch-Römer (1993), Psychological Review, doi:10.1037/0033-295X.100.3.363 (abstract via OpenAlex)
- Macnamara, Hambrick & Oswald (2014), Psychological Science, doi:10.1177/0956797614535810 (abstract via Europe PMC)
- Center for Nonviolent Communication: https://www.cnvc.org/learn/what-is-nvc (opened); request criteria, secondary: https://nonviolentcommunication.com/learn-nonviolent-communication/nvc-teamwork/ (search result)
- Revised Bloom, secondary: https://www.teachthought.com/learning/what-is-blooms-revised-taxonomy/ (opened); Krathwohl (2002), Theory Into Practice 41(4), doi:10.1207/s15430421tip4104_2 (metadata only)
- Doran (1981), SMART, secondary: https://en.wikipedia.org/wiki/SMART_criteria ; https://www.projectsmart.co.uk/brief-history-of-smart-goals.php (search results only)
- Scrum Guide 2020: https://scrumguides.org/scrum-guide.html (opened)
- W.K. Kellogg Foundation, Logic Model Development Guide (2004): https://19january2021snapshot.epa.gov/sites/static/files/2015-09/documents/logic-model-development-guide.pdf (opened, text extracted)
- Center for Theory of Change: https://www.theoryofchange.org/what-is-theory-of-change/ (opened)
- Ganz: https://www.hks.harvard.edu/centers/cpl/what-we-do/news-commentary/marshall-ganz-practicing-democracy (opened); public narrative, secondary: https://commonslibrary.org/the-power-of-story-the-story-of-self-us-and-now/ (search result)
- McAlevey interview, The Nation (2017): https://www.thenation.com/article/archive/labor-movement-must-learn/tnamp/ (opened)
- Kretzmann & McKnight (1993), ABCD: https://resources.depaul.edu/abcd-institute/publications/Pages/basic-manual.aspx (403); summary from search results, secondary
- Spade (2020), "Solidarity Not Charity," Social Text 38(1), doi:10.1215/01642472-7971139 (abstract via OpenAlex)
- Community Tool Box, Developing a Plan for Advocacy: https://ctb.ku.edu/en/table-of-contents/advocacy/advocacy-principles/advocacy-plan/main (opened)
- Midwest Academy Strategy Chart (2015): https://www.countyhealthrankings.org/sites/default/files/media/document/resources/MidwestAcademy_Strategy_Chart_2015.pdf (opened, text extracted)
- Hirschman (1970), Exit, Voice, and Loyalty: https://casbs.stanford.edu/exit-voice-and-loyalty-responses-decline-firms-organizations-and-states ; https://researchportalplus.anu.edu.au/en/publications/albert-o-hirschman-exit-voice-and-loyalty-responses-to-decline-in/ (opened; definitions from search summary, secondary)
- Flynn & Lake (2008), JPSP, doi:10.1037/0022-3514.95.1.128 (abstract via Europe PMC)
- Bhargava & Manoli (2015), AER 105(11): https://ideas.repec.org/a/aea/aecrev/v105y2015i11p3489-3529.html (opened)
- 211: https://www.211.org/about-us (opened)
- Dunn, Aknin & Norton (2008), Science, doi:10.1126/science.1150952; Aknin et al. (2013), JPSP, doi:10.1037/a0031578; Aknin et al. (2020), JPSP, doi:10.1037/pspa0000191 (abstracts via Europe PMC)
- Ritchey, General morphological analysis: https://www.swemorph.com/ma.html (opened)
- Si, Yang & Hashimoto (2024): https://arxiv.org/abs/2409.04109 (abstract via arXiv API; section 7.1 via https://arxiv.org/html/2409.04109v1)
- Anderson, Shah & Kreminski (2024): https://arxiv.org/abs/2402.01536 (abstract via arXiv API)
- Meincke, Mollick & Terwiesch (2024): https://arxiv.org/abs/2402.01727 (abstract via arXiv API); per-prompt figures from https://www.alphaxiv.org/abs/2402.01727 (secondary summary)
- Doshi & Hauser (2024), Science Advances, doi:10.1126/sciadv.adn5290 (abstract via Europe PMC)
- Jiang et al. (2025), Artificial Hivemind: https://arxiv.org/abs/2510.22954 (abstract via arXiv API)
- Yu et al. (2023), AttrPrompt: https://arxiv.org/abs/2306.15895 (abstract via arXiv API)
- Rietzschel, Nijstad & Stroebe (2014), Creativity Research Journal, doi:10.1080/10400419.2014.901084 (abstract via OpenAlex)

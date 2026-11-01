# Idea Research: What the dream layer is for

- **Slug**: dream-layer
- **Created**: 2026-10-20
- **Question**: In It, a person opens a pain, picks one or more dreams, and sees fixes under each picked dream. The dream layer is asked to do four jobs: (1) let a person recognize their own version of the pain; (2) show that a better future is possible; (3) headline the person's page once the pain collapses; (4) hold many kinds of fixes. What do established frameworks and evidence say about layering a problem, a desired end state, a vision of what's possible, and the ways to get there? Which jobs does each framework serve, at what altitude does it put the "dream", what test does it imply, and does it argue for separate layers or one layer with a priority?
- **Evidence confidence (overall)**: high on the goal-hierarchy and goal-systems findings and on the solution-focused question experiments (primary abstracts, and the official SFBT manual read in full text); medium on futures and Jobs to Be Done (originators' own sites, some details only secondhand); low on product evidence (few primary sources exist). No source tests It's exact screen. Nothing here decides anything; the options at the end are inputs to the founder's next grilling round.
- **Scope**: research only. Context read: `GLOSSARY.md` (Pain, Dream, Means, Fix); `docs/architecture/decisions.md`, "Generated possibility content"; `docs/spec/features.md` (dream rows and the collapsed headline); `AGENTS.md` product intent; `docs/research/fix-kind-ideation/research.md`; and the redrafted pilot dreams with their screen verdicts in `dreams.json` and `dream-screen.json` for `poor-sleep/20261020-202908`, `rent-eats-everything/20261020-202909`, and `loneliness/20261020-202910` on `origin/claude/possibilities-pilot-79a436`. All web pages were opened on 2026-10-20 unless marked otherwise. Example wordings below are illustrations written for this note, not quotes.

## Summary

- **Every layered framework separates the "what I want" from the "how I'll get it", and none asks one item to do both.** Means-end chains (attribute → consequence → value), control theory ("be" goals above "do" goals), theory of change (long-term goal → preconditions → interventions), logic models (activities → outputs → outcomes → impact), Jobs to Be Done (job → desired outcomes → solutions), and Fogg's Tiny Habits (aspiration → swarm of behaviors) all keep the ends layer free of means. That supports the founder's end-state definition and says means-shaped dreams were doing a fix's job.
- **Altitude is relative, so a why test is the standard tool, but it needs a stopping rule.** Action identification theory (Vallacher & Wegner) says any action can be named at many levels, with "why" moving up and "how" moving down. Asking "why?" never stops on its own; means-end chains climb to personal values. The founder's rule, stop when the answer leaves the pain, is the stopping rule these frameworks leave to the user.
- **The swap test has no backing as a definition.** Goal systems theory (Kruglanski and colleagues) treats ends shared by several routes (equifinality) and means shared by several ends (multifinality) as normal structure. Nothing in it says an end state must belong to one problem. The 4 swap failures in the pilot (of 29 dreams) are end states that a neighboring pain genuinely shares, such as staying in one's home (Rent and Eviction).
- **The "too general" failure that the swap test catches is better described as the value level.** "I'm happy" and "I have energy all day" are what Gutman calls values and Carver and Scheier call "be" goals. A test that names the level ("does it still name this pain's domain?") would keep shared end states and still reject values.
- **"Reads like the pain switched off" has a named fix in solution-focused practice.** The official SFBT manual says a useful preferred-future picture describes the presence of wanted behavior rather than the absence of the problem, a beginning step rather than a final result, and what other people would notice. Its standard move is "What will be there instead?" In the pilot, 4 of 29 dream titles and 15 of 29 lines rely on "not", "no", "without", or "instead of".
- **Avoidance framing has a cost beyond tone.** People pursuing more avoidance goals reported lower well-being over a semester, mediated by perceived progress (Elliot, Sheldon & Church 1997). A dream written as the pain's absence is an avoidance goal.
- **Vivid ideal futures alone lower effort.** Oettingen's studies found that positive fantasies about a desired future predicted less effort and worse outcomes, while positive expectations (judging it likely) predicted more. Fantasies about idealized futures also lowered measured energy (Kappes & Oettingen 2011, title and metadata only). An inspiring dream with no route attached is the pattern that backfires.
- **"Better is possible" works through routes and expectations, not novelty.** Hope theory defines hope as perceived pathways plus agency. Kruglanski, Pierro, and Sheveland found that people with more routes to a goal were more committed to the goal, through higher expectancy, but less committed to any single route. So the fixes and their real examples, not the dream's wording, are what make a dream feel possible.
- **Contrasting a desired future with present reality beats either alone.** Fantasy realization theory says contrasting turns wishes into binding goals when expectations are favorable; indulging or dwelling alone gives moderate commitment regardless of expectations. Mental contrasting with if-then plans has a meta-analytic g of about 0.34. It's page (pain, then dream, then fixes) already contains the three pieces.
- **Solution-focused questions beat problem-focused ones on action, but the gap is modest.** In randomized studies (Grant 2012; Neipp et al. 2015), solution-focused questions raised self-efficacy, goal approach, and action steps more than problem-focused questions. A later four-arm study (Neipp et al. 2021) found the two more similar than different; the miracle question mainly reduced negative affect, and scaling questions produced the most action steps.
- **Recognition matters, but mostly as a gate.** Tailoring health messages to a person has a real but small effect (r ≈ .07 across 57 studies). Possible selves move behavior when they feel like one's "true" self and are linked to strategies (Oyserman, Bybee & Terry 2006). Being recognized gets attention; the desired state plus credible routes produces action.
- **No primary evidence was found that surprise at what's possible drives action.** The nearest evidence points the other way: positive fantasies sap effort unless tied to expectations and obstacles. What helps is believing a better state is attainable for oneself, which is a judgement about routes, not novelty.
- **Futures work separates "preferable" from "possible" and "plausible".** In Voros's futures cone, preferable futures are normative ("should") judgements that can sit anywhere in the cone; plausibility is a separate, knowledge-based judgement. It's job 2 ("better is possible") is a plausibility claim, and the dream (a preference) can't carry it alone.
- **The headline job fits the stable, higher level.** Jobs to Be Done holds that jobs are stable while solutions change (Strategyn); control theory puts identity at the top of the goal hierarchy; high-level construals support self-control (Fujita et al. 2006). A headline that names the end state survives the person swapping fixes; a means-shaped headline does not.
- **The frameworks point to separate layers with clear jobs, not one layer with a priority.** Recognition fits a facet or circumstance layer (JTBD's circumstance, SFBT's problem description). The end state fits the dream (headline and container). Possibility fits a proof layer of real examples or routes. Whether It needs all three as screens, or as fields within one card, is the product decision.

## The four jobs and It's three tries

Jobs used in the table below: **R** recognize your own version of the pain; **P** show a better future is possible; **H** headline the page after collapse; **F** hold many kinds of fixes.

The pilot's redrafted dreams (`dream-screen.json`, three runs) give the current state:

| Pain | Dreams | Pass | Fail (why) | Fail (swap) |
| --- | --- | --- | --- | --- |
| poor-sleep | 11 | 10 | 1 (breathing easily) | 0 |
| rent-eats-everything | 9 | 5 | 1 (fair rent) | 3 (staying in my home; payments that build something; rents ordinary paychecks cover) |
| loneliness | 9 | 7 | 1 (friends get in touch first) | 1 (someone would notice if I went quiet) |

Read against the frameworks below, the redraft does well on R and F. Each poor-sleep dream maps to a distinct sub-situation (falling asleep, staying asleep, waking early, hours, quality, timing, pills, worry, a partner), which is close to what JTBD calls circumstances and Torres calls opportunities. It does less well on P, and its absence-phrased items are weaker on H.

## Goal hierarchies

### Means-end chain theory (Gutman 1982; Reynolds & Gutman 1988)

- **What it says.** Gutman's model links what a person perceives about a product to their values. Later accounts describe three levels: attributes (concrete features), consequences (what the feature does for the person, functional or psychosocial), and values (the end states a person lives for). Laddering interviews move up the chain by asking why each level matters. — [source: Gutman 1982, *Journal of Marketing* 46(2), abstract via OpenAlex; level names from marketing-dictionary.org "Laddering", secondary] (confidence: high on the model's existence, medium on level detail, secondhand)
- **Jobs served.** F (attributes and consequences are where means live), H weakly (values are too abstract for a page headline).
- **Altitude.** Puts "what the person really wants" at the value level, above any single product. It's dream sits at the consequence level: what changes for me, inside one pain.
- **Test implied.** The laddering probe is the why test. It never stops by itself; the chain ends in values like security or self-respect. The founder's stopping rule ("stop when the answer leaves this pain") is a choice the theory leaves open, and it's a reasonable one: it stops one level below values.
- **Layers or priority.** Separate layers. A means (attribute) and an end (consequence) are different kinds of thing.

### Control theory and goal hierarchies (Carver & Scheier)

- **What it says.** Self-regulation runs on discrepancy-reducing feedback loops: compare where you are with a reference value and act to close the gap. — [source: Carver & Scheier 1982, *Psychological Bulletin* 92(1), abstract via OpenAlex] (confidence: high) Their goals form a hierarchy: abstract "be" goals (who I want to be) at the top, concrete "do" goals (what I'll do) below, with identity at the highest levels; higher levels answer "why", lower levels "how". — [source: Berkman, Livingston & Kahn 2017, *Psychological Inquiry* 28(2–3), PMC6377081, describing Carver & Scheier 1998; secondary] (confidence: medium, secondhand)
- **Related.** Action identification theory: any action can be identified at many levels, from how it is done to why it is done, and people move to lower levels when an action gets hard to maintain. — [source: Vallacher & Wegner 1987, *Psychological Review* 94(1), abstract via OpenAlex] (confidence: high) Priming high-level construals increased self-control across six experiments. — [source: Fujita, Trope, Liberman & Levin-Sagi 2006, *JPSP* 90(3), abstract via OpenAlex] (confidence: high)
- **Jobs served.** H (higher levels give the stable "why" a headline needs) and F (the "do" levels hold means). It says little about R or P.
- **Altitude.** A dream is a mid-level reference value: above any fix, below "be" goals such as "I'm a rested, capable person".
- **Test implied.** Why moves up, how moves down. Too low: it answers "how?" for something else in the same pain. Too high: it's a "be" goal or identity that no single pain owns. Vallacher and Wegner also suggest that when a fix gets hard, people drop to its mechanics, so the headline should stay at the why level to keep meaning available.
- **Layers or priority.** Separate levels, linked. The hierarchy is the point.

### Goal systems theory (Kruglanski, Shah, Fishbach and colleagues)

- **What it says.** Goals and means form networks. Configurations include equifinality (several means to one goal), multifinality (one means to several goals), unifinality, and counterfinality. People choose means that maximize goal attainment, and a goal–means link weakens as a means serves more goals or a goal gets more means. — [source: Fishbach, Kopetz & Kruglanski 2023, introduction to *Goal Systems Theory*, Oxford Academic chapter abstract; Kruglanski et al. 2002, *Advances in Experimental Social Psychology* 34, metadata only] (confidence: high)
- **Dilution.** The more goals a single means is seen to serve, the less effective people judge it for each one, and the less likely they choose it when only one goal is active. — [source: Zhang, Fishbach & Kruglanski 2007, *JPSP* 92(3), abstract via OpenAlex] (confidence: high) Multifinal means promise more total value but lower expectancy for each goal. — [source: Kruglanski et al. 2013, *PSPR* 17(1), abstract via OpenAlex] (confidence: high)
- **Equifinality set size.** In four studies, more means to a goal went with more commitment to the goal and less commitment to each means; expectancy of attainment and goal importance mediated the goal effect. — [source: Kruglanski, Pierro & Sheveland 2011, *European Journal of Social Psychology* 41(3), abstract via OpenAlex and Sapienza IRIS] (confidence: high)
- **Jobs served.** F directly, P indirectly (many routes raise expectancy). It's the strongest evidence that holding many fixes under one dream helps commitment to the dream.
- **Altitude.** Neutral: any node can be a goal for the level below and a means for the level above.
- **Test implied.** No uniqueness test. Shared ends are expected. For It, this argues for linking a shared dream to several pains (a Rent dream and an Eviction dream that are the same node) rather than failing it. Dilution warns the other way for fixes: a fix shown under many dreams may look weaker for each, so the copy should name the specific dream it serves.
- **Layers or priority.** A graph, not one layer; It's content graph decision (fixes link to several dreams) already matches it.

## Preferred futures

### Solution-Focused Brief Therapy: preferred future and the miracle question (de Shazer, Berg)

- **What it says.** Practice centers on clients' best hopes, descriptions of their preferred futures, existing exceptions, and progress toward what they want. The miracle question asks a client to suppose the problem was solved overnight and describe what would be different the next morning. Clients who built clear, detailed miracle pictures ("well-formed goals") were more motivated and progressed in fewer sessions; this is practice experience, not a trial. — [source: SFBTA Research Committee 2025, *Solution Focused Therapy Treatment Manual for Working with Individuals*, 3rd ed., pp. 12, 16, 18–19] (confidence: high that this is the official account)
- **Three properties of a useful picture.** The manual lists: the presence of desirable behaviors rather than the absence of problems; a beginning step rather than a final result; and what others as well as the client would notice. When clients describe what they don't want, therapists ask what will be there instead; when answers are general, they ask for a feeling, thought, or action that would show it. — [source: SFBTA manual, pp. 21, 32–33] (confidence: high)
- **Evidence.** A systematic review of 43 controlled studies found 74% reported significant benefit, strongest for adult depression. — [source: Gingerich & Peterson 2013, *Research on Social Work Practice* 23(3), abstract via OpenAlex] (confidence: medium; mixed-quality studies) Randomized studies of single question sets: solution-focused questions, including the miracle question, increased goal approach, self-efficacy, and action steps more than problem-focused questions. — [source: Grant 2012, *Journal of Systemic Therapies* 31(2), abstract via OpenAlex; Neipp et al. 2015, *JMFT*, abstract via OpenAlex] (confidence: high for short-term lab effects) A four-arm follow-up found problem- and solution-focused questions more similar than different; the miracle and exception questions mainly reduced negative affect, and scaling questions produced the most action steps. — [source: Neipp et al. 2021, *Journal of Family Therapy*, abstract via OpenAlex] (confidence: high)
- **Jobs served.** R (the preferred future is in the client's own words), H (the picture is the reference point for progress), and P (exceptions show the better state already happens sometimes).
- **Altitude.** Concrete and observable: what you'd notice on a better day, not a final cure. That's slightly lower than "the pain resolved", and above any means.
- **Test implied.** Three wording tests It doesn't use yet: **presence** (what's there instead, not what's gone); **noticeable** (what would I or someone else notice?); **beginning** (the first signs, not the finished state). Example: "Sleeping through the night without waking" becomes something like "I close my eyes, and the next thing I know it's morning", and "Not worrying about sleep anymore" becomes "I get into bed thinking about tomorrow's plans and drift off".
- **Layers or priority.** One picture, built from many small details. SFBT keeps the problem description, the preferred future, exceptions, and steps (scaling) as separate conversational moves.

### Possible selves (Markus & Nurius 1986; Oyserman)

- **What it says.** Possible selves are the selves a person hopes to become, expects to become, or fears becoming, and they link self-concept to motivation. — [source: Markus & Nurius 1986, *American Psychologist* 41(9); not opened, content from secondary summaries] (confidence: medium, secondhand) Youths whose expected selves were balanced by a feared self in the same domain were less delinquent. — [source: Oyserman & Markus 1990, *JPSP* 59(1), abstract via OpenAlex] (confidence: high) A brief intervention that linked academic possible selves to strategies, made them feel congruent with social identity, and reframed difficulty raised grades and test scores over two years, mediated by change in possible selves. The authors' hypothesis was that possible selves alone aren't enough without plausible strategies. — [source: Oyserman, Bybee & Terry 2006, *JPSP* 91(1), abstract via OpenAlex] (confidence: high) Oyserman et al.'s "Possible selves as roadmaps" (2004) develops the strategies point; metadata only.
- **Jobs served.** R (the self must feel like "me"), H (a possible self is a natural headline: "someone who sleeps through the night"), P only when paired with strategies.
- **Altitude.** Self-level, between a single end state and identity.
- **Test implied.** Would this person say "that's me, later"? Balance: a hoped-for self is stronger with its feared counterpart in the same domain, which the pain already supplies.
- **Layers or priority.** Separate: the self (dream) and the strategies (fixes) are distinct, and the pairing is what works.

### Hope theory (Snyder)

- **What it says.** Hope is the perceived ability to find pathways to desired goals and to motivate oneself, through agency thinking, to use them. Higher hope relates to better outcomes in several domains. — [source: Snyder 2002, *Psychological Inquiry* 13(4), abstract via OpenAlex; Snyder et al. 1991, *JPSP* 60(4), metadata only] (confidence: high on the definition)
- **Jobs served.** P (pathways are what make a future feel possible) and F (pathways are fixes).
- **Altitude.** Goals at whatever level a person holds them; the theory's weight is on routes.
- **Test implied.** Does the person see at least one route to it, and believe they can take it? A dream shown without fixes fails this by construction.
- **Layers or priority.** Separate: goal, pathways, agency.

### Mental contrasting and fantasy realization (Oettingen)

- **What it says.** Positive expectations (judging a desired future likely) predicted more effort and better outcomes; positive fantasies (enjoying images of it) predicted the reverse, in job seekers, students, and surgery patients, up to two years later. — [source: Oettingen & Mayer 2002, *JPSP* 83(5), abstract via OpenAlex] (confidence: high) Contrasting a desired future with present reality produces strong commitment when expectations are high and disengagement when they are low; fantasizing alone or reflecting on reality alone gives moderate commitment regardless of expectations. — [source: Oettingen, Pak & Schnetter 2001, *JPSP* 80(5); Oettingen 2012, *European Review of Social Psychology* 23(1); abstracts via OpenAlex] (confidence: high) Kappes & Oettingen 2011, "Positive fantasies about idealized futures sap energy" (*JESP* 47), opened only as a title and metadata. Mental contrasting with implementation intentions: g = 0.34 across 21 articles, 0.24 after a publication-bias adjustment. — [source: Wang, Wang & Gai 2021, *Frontiers in Psychology*] (confidence: high)
- **Jobs served.** P (but with a warning), and the pain–dream–fixes order as a whole.
- **Altitude.** The wish should be challenging but feasible and specific; the outcome is how fulfilling it would feel. — [source: woopmylife.org/en/practice] (confidence: high)
- **Test implied.** Not "is it inspiring?" but "do I believe it can happen for me?". An inspiring dream with no route attached is a fantasy, the pattern that predicted lower effort.
- **Layers or priority.** Ordered steps: wish, outcome, obstacle, plan. It's pain sits where WOOP has the obstacle, but It shows it first; this is closer to "reverse contrasting", which Oettingen's later studies used as a control condition (Kappes & Oettingen 2014, seen only in a search summary). Whether showing the pain before the dream weakens the effect is untested for It.

## Futures and change planning

### The futures cone (Hancock & Bezold; Voros; Dunne & Raby)

- **What it says.** Voros's cone nests classes of future: potential, preposterous, possible ("might"), plausible ("could", given current knowledge), probable ("likely"), and projected (the default baseline). Preferable futures ("should") are normative value judgements, not a band of likelihood; they can come from anywhere in the cone. Voros traces the cone to Taylor (1990) and Hancock & Bezold (1994), building on Henchey (1978), and used it in his generic foresight process. — [source: Voros 2017, "The Futures Cone, use and history", thevoroscope.com; Voros 2003, *foresight* 5(3), abstract via OpenAlex] (confidence: high) Dunne & Raby's *Speculative Everything* (2013) adapts the cone from a talk by Stuart Candy and asks who decides what counts as preferable. — [source: search summaries only; the book was not opened] (confidence: low, secondhand)
- **Jobs served.** P, by separating it from H. "Better is possible" is a plausibility claim; "this is what I want" is a preference.
- **Altitude.** A preferable future can be at any altitude; the cone is about likelihood, not hierarchy.
- **Test implied.** Two different checks: is this preferable to the person (the dream screen's job), and is it plausible (the evidence's job, carried by verified examples and honest status on fixes)? A dream can pass the first and say nothing about the second.
- **Layers or priority.** Separate: preference and plausibility are different judgements.

### Theory of change and logic models

- **What it says.** Theory of change starts from long-term goals and works back to the conditions (outcomes) that must be in place, which become preconditions; activities and interventions are then linked to those outcomes, all mapped in an outcomes framework. — [source: Center for Theory of Change, "What is Theory of Change?"] (confidence: high) The Kellogg guide defines outputs as direct results of activities; outcomes as specific changes in participants' behavior, knowledge, skills, status, or functioning, mostly at the individual level (short-term in 1–3 years, longer-term in 4–6); and impact as fundamental change in organizations, communities, or systems in 7–10 years. Outcomes are written as change statements and sit within the program's sphere of influence. — [source: W.K. Kellogg Foundation, *Logic Model Development Guide* (2004), pp. 9, 15, 27] (confidence: high)
- **Jobs served.** F (interventions hang off outcomes) and H (the long-term goal heads the map). Not R or P.
- **Altitude.** The "outcome versus impact" split matches It's personal versus societal pains. A personal dream is an outcome (a change in my state); a societal dream is closer to impact (a change in a community or system). The decision record already says a dream describes the world only when the pain is about the world.
- **Test implied.** Outcomes are conditions, not activities; and preconditions are outcomes too. That suggests a third level It doesn't have: "rent I know a year ahead" can be a precondition of "rent that leaves enough for everything else". The pilot's why failures (fair rent, friends getting in touch first, breathing easily) are exactly preconditions: real conditions, but means to another condition in the same pain.
- **Layers or priority.** Separate layers, with preconditions in between.

## Jobs to Be Done

- **What it says (Ulwick / Strategyn).** A job is what a customer is trying to get done, stated in a single solution-free statement. Jobs are stable while products change; a job has a map of steps, and desired outcomes are the metrics customers use to judge success, often 50 to 150 per job. — [source: strategyn.com/jobs-to-be-done] (confidence: high) Desired outcome statements take the form direction, metric, object, and clarifier, usually starting "minimize". — [source: secondary only, productlessonsravi.substack.com and MIT ILP summaries of Ulwick] (confidence: medium, secondhand)
- **What it says (Christensen).** A job is the progress a person is trying to make in a particular circumstance, with functional, social, and emotional sides, and people hire products for different jobs as circumstances change. — [source: christenseninstitute.org/theory/jobs-to-be-done] (confidence: high) Klement defines a job as the process of moving from an existing life situation to a preferred one, against constraints. — [source: secondary summaries of *When Coffee and Kale Compete*; jtbd.info not opened] (confidence: medium, secondhand)
- **Jobs served.** R (the circumstance is how people recognize themselves), H (the job is stable), F (solutions are many and change).
- **Altitude.** The job sits above any solution. Strategyn's kettle example: boiling water is a step within the job of making a hot drink.
- **Test implied.** "Solution-free" is the means test: if the statement names a product, program, or action, it's a solution. "Stable" gives a second test: would this still be the goal if every current fix disappeared? Ulwick's outcome format also suggests the dream line could carry a measurable sense of "better" (fewer nights awake, less of my pay on rent) without naming a means.
- **Layers or priority.** Separate: circumstance, job, outcomes, solutions. The circumstance layer is the one It folds into the dream today.

## Product evidence

Few products publish research on how they present a desired state before actions; most of what exists is third-party UX commentary, which is excluded here.

- **WOOP (Oettingen's own app and site).** The person names a wish, imagines the best outcome, then the main inner obstacle, then an if-then plan, and is told to keep that order. — [source: woopmylife.org/en/practice] (confidence: high that this is the design; the effect evidence is the mental-contrasting research above)
- **Tiny Habits (Fogg).** The official "Swarm of Bs" worksheet puts an aspiration or outcome at the center and surrounds it with behaviors. — [source: tinyhabits.com worksheet PDF, 2017] (confidence: high that the worksheet exists) Secondary summaries of the book describe checking whether a goal is an abstract aspiration or a concrete outcome, brainstorming many behaviors, then mapping them by impact and feasibility. — [source: shortform.com summaries; book not opened] (confidence: medium, secondhand)
- **Goal setting in physical activity.** Across 52 interventions, setting goals had a medium effect on physical activity (d = 0.55). — [source: McEwan et al. 2016, *Health Psychology Review* 10(1), abstract via OpenAlex] (confidence: high) It doesn't isolate how the desired state was presented.
- **Duolingo.** No first-party source on its onboarding motivation question was found; only third-party UX reviews, so it is not used.

Both product patterns put one desired state first and many actions under it, which is It's dream-then-fixes shape. Neither asks the desired state to inspire on its own.

## Frameworks against the four jobs

| Framework | R recognize | P possible | H headline | F hold fixes | Dream altitude | Test it implies | Layers or one |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Means-end chain | – | – | weak (values too abstract) | yes | consequence, below values | why ladder, with a stopping rule | separate |
| Control theory / action identification | – | – | yes | yes | mid-level reference, below "be" goals | why up, how down; not a "be" goal | separate, linked |
| Goal systems theory | – | indirect (more routes, more expectancy) | – | yes | any node | no uniqueness; shared ends are normal; watch dilution | graph |
| SFBT preferred future | yes | partly (exceptions) | yes | – | concrete, noticeable first signs | presence, noticeable, beginning | separate moves |
| Possible selves | yes | only with strategies | yes | needs strategies | self-level | "that's me, later"; balanced with feared self | separate, paired |
| Hope theory | – | yes (pathways) | – | yes | any | at least one route I can take | separate |
| Mental contrasting / WOOP | – | warns: fantasy alone backfires | – | via plans | challenging, feasible, specific | do I expect it can happen? | ordered steps |
| Futures cone | – | yes (plausibility) | yes (preference) | – | any | preferable ≠ plausible | separate judgements |
| Theory of change / logic model | – | – | yes | yes | outcome (personal) or impact (societal) | condition, not activity; preconditions | separate, with preconditions |
| Jobs to Be Done | yes (circumstance) | – | yes (stable) | yes | above solutions | solution-free; stable without fixes | separate |
| WOOP / Tiny Habits products | – | – | yes | yes | one wish or aspiration | one desired state, many actions | separate |

No framework puts all four jobs on one item. R is served by circumstance or self-description, P by routes and evidence, H and F by the end-state level.

## Options for It

Each option keeps the founder's 2026-10-20 definition of a dream as an end state; they differ in where R and P live.

### A. One layer, end-state dreams, rewritten for presence

Keep pain → dream → fixes. Change the dream brief and screen: replace the swap test with a value-level test (still names this pain's domain; isn't a "be" goal like "I'm happy"), and add SFBT's presence and noticeable tests. Shared end states link to several pains rather than failing.

- **Serves:** R (dreams are already distinct sub-situations), H, F. P comes only from fixes once a dream is picked.
- **Trade-offs:** cheapest; no new screens or content types. P stays weak at the moment of choosing, before any fix is shown. Shared dreams need the content model to allow one dream under several pains, which it may not yet.

### B. One layer with a priority: dream as headline and container, fixes carry possibility

Same as A, but each dream card previews one or two verified fixes or examples ("In Vienna…", "A free weekly 5k near you") as proof, not as the dream.

- **Serves:** all four, with P borrowed from fixes. Matches hope theory and the equifinality findings (visible routes raise expectancy).
- **Trade-offs:** puts the means-shaped dreams' inspiring material back on screen without making it the dream. Needs a rule for which fix is the preview, and more screen space per dream. Risks dilution if the same fix previews under several dreams.

### C. Two layers: facet, then dream

Let people pick their version of the pain first ("I wake at 4 and can't get back to sleep"), with the dream as its presence-phrased end state ("I sleep until it's light out"). Fixes hang off the dream.

- **Serves:** R explicitly (JTBD circumstance, SFBT problem description), then H and F at the dream.
- **Trade-offs:** clearer recognition and a natural home for the "reads like the pain switched off" problem, since the facet carries the pain wording and the dream carries the presence wording. Doubles the items a writer drafts and the founder reviews per pain, and adds a tap before anything hopeful appears. The pilot's dreams already map almost one-to-one to facets, so the gain may be mostly wording.

### D. Three layers: facet, dream, possibility, then fixes

Add a possibility layer between dream and fixes: a sourced, real instance where the dream is true for people ("Most renters in Vienna pay under a quarter of their income"), at plausible-future altitude.

- **Serves:** each job gets its own layer (R facet, H and F dream, P possibility).
- **Trade-offs:** most faithful to the frameworks and to the product intent's "see a better future as possible". Most content and most review: every possibility needs a verified source, and the generator's examples stage already produces most of the raw material. Risk of the fantasy effect if possibilities are shown as vivid ideals without routes; they should sit next to fixes, not instead of them.

### E. Keep means-shaped items, rename them

Bring back the means-shaped drafts as "possibilities" or "ways", with the end state as a short headline above them. This is D without facets.

- **Serves:** P and F strongly, H via the headline.
- **Trade-offs:** reuses the first pilot drafts. Overlaps with fixes, since the decision record says anything that produces the end state is a fix, however large; this option would need a rule for what makes a possibility different from a fix (for example, "real somewhere, not yet here").

## Recognition versus surprise: what the evidence says

- **Recognition is necessary but weak on its own.** Tailoring to the person has a small effect (r ≈ .07, Noar et al. 2007). Problem-focused questions, which are mostly recognition, improved goal approach but didn't move self-efficacy or affect (Grant 2012), and dwelling on reality alone gave only moderate commitment (Oettingen et al. 2001). A possible self needs to feel like one's true self to motivate (Oyserman et al. 2006), so recognition works as a gate rather than an engine.
- **Surprise or inspiration on its own can backfire.** Positive fantasies about a desired future predicted less effort (Oettingen & Mayer 2002). No primary study found here shows that novelty or surprise about what's possible increases action.
- **What drives action is the contrast plus credible routes.** Contrasting the desired future with present reality (Oettingen et al. 2001; Wang et al. 2021), linking a possible self to strategies (Oyserman et al. 2006), seeing more routes to a goal (Kruglanski, Pierro & Sheveland 2011), and solution-focused questions that ask what will be different and what steps come next (Grant 2012; Neipp et al. 2015, 2021) all raised commitment, self-efficacy, or action steps.
- **For It:** a person needs to recognize their version (R) to care, but "better is possible" persuades through believable routes rather than surprise. That puts the weight of job 2 on fixes, their honest status, and their verified examples, more than on the dream's wording.

## Gaps and open questions

- No study tests showing the problem before the desired future versus after it in a product. Oettingen's work implies order matters; It shows the pain first.
- No source compares one combined layer with separate facet and dream layers for engagement or action.
- Markus & Nurius 1986, Carver & Scheier 1998, Kruglanski et al. 2002, Dunne & Raby 2013, and Klement's book were not opened; their content here is from metadata, citing papers, or summaries.
- Whether shared end states across pains (equifinality) should be one dream node or copies is a content-model question, not a research one.
- The SFBT evidence on question types is short-term and mostly student samples.

## Sources

Opened on 2026-10-20 unless stated.

- Gutman (1982), "A Means-End Chain Model Based on Consumer Categorization Processes," *Journal of Marketing* 46(2), doi:10.1177/002224298204600207 (abstract via OpenAlex: https://api.openalex.org/works/doi:10.1177/002224298204600207)
- Marketing Dictionary, "Laddering": https://marketing-dictionary.org/l/laddering/ (secondary)
- Carver & Scheier (1982), "Control theory," *Psychological Bulletin* 92(1), doi:10.1037/0033-2909.92.1.111 (abstract via OpenAlex)
- Berkman, Livingston & Kahn (2017), "Finding the 'self' in self-regulation," *Psychological Inquiry* 28(2–3): https://pmc.ncbi.nlm.nih.gov/articles/PMC6377081/ (opened; secondary for Carver & Scheier 1998)
- Vallacher & Wegner (1987), "What do people think they're doing?," *Psychological Review* 94(1), doi:10.1037/0033-295X.94.1.3 (abstract via OpenAlex)
- Fujita, Trope, Liberman & Levin-Sagi (2006), "Construal levels and self-control," *JPSP* 90(3), doi:10.1037/0022-3514.90.3.351 (abstract via OpenAlex)
- Kruglanski et al. (2002), "A theory of goal systems," *Advances in Experimental Social Psychology* 34, doi:10.1016/S0065-2601(02)80008-9 (metadata only)
- Fishbach, Kopetz & Kruglanski (2023), "Introduction: The Principles of Goal Systems Theory," in *Goal Systems Theory* (Oxford): https://academic.oup.com/book/45852/chapter/400777985 (abstract only)
- Zhang, Fishbach & Kruglanski (2007), "The dilution model," *JPSP* 92(3), doi:10.1037/0022-3514.92.3.389 (abstract via OpenAlex)
- Kruglanski et al. (2013; online 2012), "Features of multifinality," *PSPR* 17(1), doi:10.1177/1088868312453087 (abstract via OpenAlex)
- Kruglanski, Pierro & Sheveland (2011; online 2010), "How many roads lead to Rome?," *EJSP* 41(3), doi:10.1002/ejsp.780 (abstract via OpenAlex; record at https://iris.uniroma1.it/handle/11573/357385)
- SFBTA Research Committee (2025), *Solution Focused Therapy Treatment Manual for Working with Individuals*, 3rd ed.: https://www.sfbta.org/Solution%20Focused%20Therapy%20Treatment%20Manual%20for%20Working%20with%20Individuals%20-3rd%20Edition-%20final.pdf (full text, pp. 12, 16, 18–21, 32–33)
- Gingerich & Peterson (2013), "Effectiveness of Solution-Focused Brief Therapy," *Research on Social Work Practice*, doi:10.1177/1049731512470859 (abstract via OpenAlex)
- Grant (2012), "Making Positive Change," *Journal of Systemic Therapies* 31(2), doi:10.1521/jsyt.2012.31.2.21 (abstract via OpenAlex)
- Neipp et al. (2015), "The Effect of Solution-Focused Versus Problem-Focused Questions: A Replication," *JMFT*, doi:10.1111/jmft.12140 (abstract via OpenAlex)
- Neipp et al. (2021), "Solution-Focused versus Problem-Focused Questions: Differential Effects of Miracles, Exceptions and Scales," *Journal of Family Therapy*, doi:10.1111/1467-6427.12345 (abstract via OpenAlex)
- Markus & Nurius (1986), "Possible selves," *American Psychologist* 41(9), doi:10.1037/0003-066X.41.9.954 (not opened; secondhand)
- Oyserman & Markus (1990), "Possible selves and delinquency," *JPSP* 59(1), doi:10.1037/0022-3514.59.1.112 (abstract via OpenAlex)
- Oyserman, Bybee & Terry (2006), "Possible selves and academic outcomes," *JPSP* 91(1), doi:10.1037/0022-3514.91.1.188 (abstract via OpenAlex)
- Oyserman, Bybee, Terry & Hart-Johnson (2004), "Possible selves as roadmaps," *Journal of Research in Personality* 38, doi:10.1016/S0092-6566(03)00057-6 (metadata only)
- Snyder (2002), "Hope theory: Rainbows in the mind," *Psychological Inquiry* 13(4), doi:10.1207/S15327965PLI1304_01 (abstract via OpenAlex)
- Snyder et al. (1991), "The will and the ways," *JPSP* 60(4), doi:10.1037/0022-3514.60.4.570 (metadata only)
- Oettingen & Mayer (2002), "The motivating function of thinking about the future," *JPSP* 83(5), doi:10.1037/0022-3514.83.5.1198 (abstract via OpenAlex)
- Oettingen, Pak & Schnetter (2001), "Self-regulation of goal setting," *JPSP* 80(5), doi:10.1037/0022-3514.80.5.736 (abstract via OpenAlex)
- Oettingen (2012), "Future thought and behaviour change," *European Review of Social Psychology* 23(1), doi:10.1080/10463283.2011.643698 (abstract via OpenAlex)
- Kappes & Oettingen (2011), "Positive fantasies about idealized futures sap energy," *JESP* 47, doi:10.1016/j.jesp.2011.02.003 (metadata only)
- Wang, Wang & Gai (2021), meta-analysis of MCII, *Frontiers in Psychology*: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.565202/full
- WOOP practice page: https://woopmylife.org/en/practice
- Elliot, Sheldon & Church (1997), "Avoidance personal goals and subjective well-being," *PSPB* 23(9), doi:10.1177/0146167297239001 (abstract via OpenAlex)
- Noar, Benac & Harris (2007), "Does tailoring matter?," *Psychological Bulletin* 133(4), doi:10.1037/0033-2909.133.4.673 (abstract via OpenAlex)
- Voros (2017), "The Futures Cone, use and history": https://www.thevoroscope.com/2017/02/24/the-futures-cone-use-and-history/
- Voros (2003), "A generic foresight process framework," *foresight* 5(3), doi:10.1108/14636680310698379 (abstract via OpenAlex)
- Dunne & Raby (2013), *Speculative Everything*, MIT Press (not opened; cone adaptation from search summaries, secondhand)
- Center for Theory of Change, "What is Theory of Change?": https://www.theoryofchange.org/what-is-theory-of-change/
- W.K. Kellogg Foundation (2004), *Logic Model Development Guide*: https://19january2021snapshot.epa.gov/sites/static/files/2015-09/documents/logic-model-development-guide.pdf (full text, pp. 9, 15, 27)
- Strategyn, "Jobs-to-be-Done": https://strategyn.com/jobs-to-be-done/
- Ulwick outcome statement format, secondary: https://productlessonsravi.substack.com/p/why-i-havent-found-a-more-accurate ; https://ilp.mit.edu/node/13140 (search results only)
- Christensen Institute, "Jobs to Be Done": https://www.christenseninstitute.org/theory/jobs-to-be-done/
- Klement, *When Coffee and Kale Compete* (2018), definition via secondary summaries (not opened)
- Fogg, "Swarm of Bs" worksheet (2017): https://tinyhabits.com/wp-content/uploads/2022/01/TinyHabits-SwarmofBs-final.pdf ; book method via https://www.shortform.com/blog/steps-to-achieving-goals/ (secondary)
- McEwan et al. (2016; online 2015), goal setting for physical activity, *Health Psychology Review*, doi:10.1080/17437199.2015.1104258 (abstract via OpenAlex)
- Pilot dreams and screen verdicts: `git show origin/claude/possibilities-pilot-79a436:docs/research/possibilities/runs/{poor-sleep/20261020-202908,rent-eats-everything/20261020-202909,loneliness/20261020-202910}/dream-screen.json`

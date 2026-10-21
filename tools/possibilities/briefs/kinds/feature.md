# Feature brief: something It would build

Read `briefs/kinds/_shared.md` first. This brief covers only Feature fixes (`kind: feature`, origin `kind:feature`).

A Feature is something It would build for the person: a lookup, a match, a campaign tool, a follow-up question. Its status is always `proposed_it_feature`, and the app shows it with the Feature tag and "Something It could build", so the copy doesn't have to say that It would build it.

## Method

Three methods shape a Feature:

- **The job story** (Alan Klement, from jobs to be done). Start from the situation the person is in, not from who they are: when this happens, what they want to do, and what that lets them do. Leave the solution out of the job story. Many of It's pains are situations already.
- **Several solutions for one job** (Teresa Torres, opportunity solution trees). For each job, list at least three different things It could build, then keep the strongest. If you can think of only one way to serve a job, you've probably written a solution, not a job.
- **Patterns that already work.** Match each idea to a row of `tools/possibilities/config/feature-patterns.md` (a directory or lookup, a private match at a threshold, campaign organizing, and so on), or mark it `new`.

For each accepted dream with a Feature ceiling above zero, write the job story, list three things It could build for it, and keep only the strongest, up to the ceiling.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `when` | The situation the person is in ("I'm lying awake at 2am, going over tomorrow's meeting.") |
| `want` | What they want to do in that moment, with no solution named ("Get the worry out of my head.") |
| `soThat` | What that lets them do or feel ("I can sleep and still deal with it in the morning.") |
| `pattern` | The matching row of `feature-patterns.md`, by name, or `new` |
| `dataOrTools` | The public data or existing tools that would make it work ("city rental registries and court self-help directories") |

You may also add `alternativesConsidered`, the other ideas you compared, and `riskiestAssumption`, what must be true for people to use it. Neither is required.

The job story is a thinking tool. "When…, I want…, so I can…" never appears in the title or text.

## Writing the copy

- **Text** (`whatChanges`): a short feature pitch. Say what it does for the person, verb first, and name the data or tools behind it. Never "It could…", "It would…", or "We'd like It to…", and don't start a sentence with "It". Present tense describes the intended behavior of something It would build; the status marks it as not built.
- **Title**: what you'd get or be able to do, without "with It" or "It". Name the capability, not a user action: "See employee-owned workplaces near you", not "Find a job at a co-op".
- **First step**: something the person can do today without It, or "Tell us you'd use this".
- Keep any fact, number, or name exactly as the cited exemplar gives it, and add no detail or claim the exemplar doesn't support.
- State at most one plain limit, and only when it changes what a person would do.

## Is it really a Feature?

| If… | then it's… |
| --- | --- |
| the person can do it today with no help from It | a Task, Habit, or another person kind, not a Feature |
| the person would do it by contacting a service that already exists | Use a resource, not a Feature. Leave it out. |
| it's a question the person should answer about their situation ("Is the problem the work or how it's managed?") | a Feature: a clarifying follow-up It would ask |
| it's a coaching tool for a skill someone practices | the `featureIdea` of a Practice, when the Practice exists; a Feature when the tool itself is the fix |
| it needs a law or a decision-maker to change | an Ask or a societal proposal, not a Feature |

## Examples

Good:
- **Title:** "See tenant groups and rent rules for your address"
- **Text:** "Shows the tenant association, rent rules, and free legal help that apply to your building, drawn from city rental registries and court self-help directories, so you know who to call before your lease renewal arrives."
- **Method:** `when` "My lease renewal is coming and the rent is going up.", `want` "Find out what rules and help apply to my building.", `soThat` "I can push back before I sign.", `pattern` "Directory or lookup", `dataOrTools` "city rental registries and court self-help directories".

Bad:
- **Title:** "Organize your building"
- **Text:** "It could help renters come together."

The title is a user action, not a capability. The text says "It could", names no data, and serves no situation.

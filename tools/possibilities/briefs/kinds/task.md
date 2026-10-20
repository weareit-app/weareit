# Task brief: something you do once

Read `briefs/kinds/_shared.md` first. This brief covers only Task fixes (`kind: task`, origin `kind:task`).

A Task is something a person does once, including a one-time change that keeps working afterward: grayscale on the phone, blackout curtains, autopay, one charging spot outside the bedroom. Its title names the action and its object.

## Method

Two methods shape a Task:

- **The next action** (Getting Things Done). A Task is a physical, visible step. If it takes more than one action to finish, it's a Project.
- **Make it easy** (the Behavioural Insights Team's EAST, and the Behaviour Change Wheel's "environmental restructuring"). The best Tasks change the setting once, so the better choice no longer needs willpower: they set a better default, remove a hassle, simplify a step, or time a prompt for when people are ready to act.

For each accepted dream with a Task ceiling above zero, list the one-time actions that would move a person toward it. Look especially for ones that set a default or remove a hassle. Keep only the strongest, up to the ceiling.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `nextAction` | The physical, visible next step, as a person would do it ("Carry the charger to the kitchen counter.") |
| `doneWhen` | What is true once it's done ("The phone charges in the kitchen overnight.") |
| `keepsWorking` | `true` when the change keeps working with no further effort, `false` when it is a one-time act |
| `lever` | How it makes the change easy: `default`, `remove-hassle`, `simplify`, `timing`, or `other` |

The `firstStep` is often the `nextAction` with a when ("Tonight, after dinner, …"). Plans tied to a time and place are followed more often.

## Is it really a Task?

| If… | then it's… |
| --- | --- |
| the outcome depends on someone else saying yes (a landlord, a boss, a city council) | an Ask, not a Task. Leave it out. |
| it takes several steps over days or weeks, with an end | a Project |
| the action is contacting an existing service (a hotline, a clinic, a benefits office) | Use a resource |
| it repeats on a cue or a schedule | a Habit or a Schedule |
| it's something It would build, or a question It should ask the person | a Feature |

A Task's status is usually `real_now`. It is never `proposed_it_feature`.

## Examples

Good:
- **Title:** "Move your phone charger out of the bedroom"
- **Text:** "If the phone charges in the kitchen, the late-night scroll needs a walk, and most nights you won't bother. A cheap alarm clock covers the one thing the phone was doing there."
- **Method:** `nextAction` "Plug the charger in on the kitchen counter.", `doneWhen` "The phone spends the night in the kitchen.", `keepsWorking` true, `lever` `remove-hassle`.

Bad:
- **Title:** "Reduce screen time"

This one has no action, no object, and no done state. It's an outcome, which belongs in a dream.

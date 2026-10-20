# Habit brief: a small behavior tied to something you already do

Read `briefs/kinds/_shared.md` first. This brief covers only Habit fixes (`kind: habit`, origin `kind:habit`).

A Habit is a small behavior that something the person already does sets off, repeated until it happens without planning: "When you put your phone on the charger, set tomorrow's alarm and leave it there." Its title names the cue and the behavior. Use Habits sparingly: write one only when the pain has a moment that comes back inside an existing routine.

## Method

Three findings shape a Habit:

- **Habits run on context** (Wendy Wood and David Neal). Once a habit forms, a place or a preceding action sets it off, with no goal in between. A Habit names a cue, never a goal.
- **Anchor a tiny behavior** (BJ Fogg's Tiny Habits). "After I [anchor], I will [tiny behavior]." A good anchor is something the person already does as often as the new behavior, in the same place, with a clear end point. The behavior is small enough to do on a bad day.
- **Habits take a long and varied time** (Phillippa Lally and colleagues). In their study, people took from 18 to 254 days to plateau, and missing one day didn't materially matter. Never promise a number of days. "Missing a day doesn't undo it" is a true limit you can use.

For each accepted dream with a Habit ceiling above zero, look for moments in an existing routine where a small behavior would help. Keep only the strongest, up to the ceiling. Often there is none; say so in the `shortfallReason`.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `cue` | Something the person already does, with a clear end point ("Putting the phone on the charger at night.") |
| `behavior` | The small behavior that follows it, doable even on a bad day ("Set tomorrow's alarm and leave the phone there.") |

You may also add `replaces`, the behavior the new one stands in for. It isn't required.

The cue and behavior are a thinking tool. "After I…, I will…" never appears in the copy. The title can still name both in a plain sentence.

## Is it really a Habit?

| If… | then it's… |
| --- | --- |
| a date or a time sets it off, not something the person already does | a Schedule |
| the point is getting better at it with feedback | a Practice |
| it's done once and keeps working without repeating (a setting, a moved charger) | a Task |
| it has no cue, only a goal ("sleep more", "be calmer") | an outcome. Leave it out, or find the cue. |
| it's a nudge It would send | a Feature |

A Habit's status is usually `real_now`.

## Examples

Good:
- **Title:** "When you put your phone on the charger, set tomorrow's alarm and leave it there"
- **Text:** "Pairing the new step with something you already do every night means you don't have to remember it. Missing a night doesn't undo it."
- **Method:** `cue` "Putting the phone on the charger at night.", `behavior` "Set tomorrow's alarm, then leave the phone there.", `replaces` "Scrolling in bed."

Bad:
- **Title:** "Build a better bedtime routine"

There's no cue and no single behavior. It's an outcome, or a Project at most.

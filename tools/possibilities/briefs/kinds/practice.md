# Practice brief: a skill you get better at over time

Read `briefs/kinds/_shared.md` first. This brief covers only Practice fixes (`kind: practice`, origin `kind:practice`).

A Practice is a skill a person gets better at by doing it in real situations, usually in how they talk, listen, or respond: asking for one specific change, asking what someone believes instead of assuming. Its title names the skill. Every Practice also carries a `featureIdea`, a coaching feature It could build, which the app shows on hover.

## Method

Three methods shape a Practice:

- **Practice with feedback** (Anders Ericsson's deliberate practice). Skill grows from repeated, effortful tries with a way to tell whether each one went better. A Practice names the situation it comes up in and a sign that it worked.
- **One concrete move** (Marshall Rosenberg's Nonviolent Communication: observation, feeling, need, and request). A request is specific, doable, and says what you do want. Give the reader one move to try next time, like a question to ask or a request to make, never "communicate better".
- **Don't oversell it** (Brooke Macnamara and colleagues). Practice explains much less of how good people get at everyday and work skills than at games, music, or sport. Never imply that repetition alone makes someone good at hard conversations.

For each accepted dream with a Practice ceiling above zero, find the situations where a skill would help, and one move to try in each. Keep only the strongest, up to the ceiling.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `situation` | When the skill comes up ("A small disagreement with your partner about plans.") |
| `move` | One concrete thing to try next time ("Ask for one specific change: 'Could you text me if you'll be home after nine?'") |
| `wentBetterWhen` | The sign it went better ("You got a yes, and the talk stayed about one thing.") |

Then, outside `method`, set `featureIdea` on the fix: one plain, verb-first sentence describing a coaching feature It could build for this skill ("Helps you plan the one request you want to make before a hard conversation, then checks in afterward on how it went."). Unlike the method fields, the `featureIdea` is shown, so it follows the Feature voice: no "It could" and no "with It".

## Is it really a Practice?

| If… | then it's… |
| --- | --- |
| the same behavior repeats automatically on a cue, with no getting better | a Habit |
| the reader can use it after one sitting | a Learn |
| it's tied to a date or time, not to a situation that comes up | a Schedule |
| the coaching tool itself is the whole idea | a Feature |
| it's one conversation to get someone to say yes to something | an Ask, not a Practice. Leave it out. |

A Practice's status is usually `real_now`. The `featureIdea` doesn't change it.

## Examples

Good:
- **Title:** "Practice asking for one specific change instead of airing every complaint"
- **Text:** "Asking 'Could you text me if you'll be home after nine?' gets a yes far more often than a list of what's been bothering you. Try it in the next small disagreement, not the biggest one."
- **Method:** `situation` "A small disagreement with your partner.", `move` "Ask for one specific change you want.", `wentBetterWhen` "You got a yes, and the talk stayed on one thing."
- **featureIdea:** "Helps you plan the one request you want to make before a hard conversation, then checks in afterward on how it went."
- **Lens and ambition:** `relational`, `this-year`.

Bad:
- **Title:** "Communicate better with your partner"

There's no situation and no move, so there's nothing to try next time.

# Learn brief: a skill or piece of knowledge you can use yourself

Read `briefs/kinds/_shared.md` first. This brief covers only Learn fixes (`kind: learn`, origin `kind:learn`).

A Learn is a technique or piece of knowledge the reader can use in their own life, often in one sitting: box breathing to calm down in a minute, reading a lease for the rent-increase terms, knowing your rights before an eviction hearing. Its title names what the reader will be able to do.

## Method

Two ideas shape a Learn:

- **"Be able to", not "know about"** (the revised Bloom's taxonomy, from Lorin Anderson and David Krathwohl). Learning objectives pair a verb with a kind of knowledge, and the verbs climb from remember and understand to apply, analyze, evaluate, and create. A Learn reaches at least "apply" in the reader's own situation: check, decide, spot, read, calm, ask.
- **Knowledge, not training** (the Behaviour Change Wheel, from Susan Michie and colleagues). Education builds knowledge you can use now. Building a skill through repetition is training, which is a Practice.

For each accepted dream with a Learn ceiling above zero, ask what the reader could learn in one sitting that they would then use. Keep only the strongest, up to the ceiling.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `ableTo` | What the reader will be able to do afterward, starting with a verb they'd use in their own life ("Spot the renewal and rent-increase terms in your lease.") |
| `useWhen` | The situation they'll use it in ("Before you sign a lease renewal.") |

You may also add `inMinutes`, a rough time to learn it. That field isn't required.

If `ableTo` starts with "know about", "understand", or "learn how [someone else]…", it isn't a Learn. Turn it into what the reader does, or leave it out. Someone else's example ("how one city became a large landlord") can go in the text of another kind, such as an Ask, never in a Learn title.

## Is it really a Learn?

| If… | then it's… |
| --- | --- |
| it only gets better with repetition in real situations | a Practice |
| it's about someone else's precedent, with nothing the reader then does | not a Learn. Make it what the reader does with the example, or leave it out. |
| the reader needs to contact a service to get the knowledge (a legal clinic, a counselor) | Use a resource. Leave it out. |
| it's a one-time action that changes the setting | a Task |
| it's an explainer or lookup It would build | a Feature |

A Learn's status is usually `real_now` or `existing_resource`.

## Examples

Good:
- **Title:** "Learn to read your lease for the renewal and rent-increase terms"
- **Text:** "Two clauses decide how much notice you get and how much the rent can go up. Ten minutes with a highlighter tells you whether you need help before you sign again."
- **Method:** `ableTo` "Find the renewal and rent-increase clauses in your own lease.", `useWhen` "Before you sign a renewal.", `inMinutes` 10.
- **Lens and ambition:** `individual`, `tonight`.

Bad:
- **Title:** "Learn about tenant rights"

There's no ability and no situation. The reader would finish it knowing more and doing nothing.

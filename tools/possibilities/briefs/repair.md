# Repair brief

You are repairing one pain's possibility cards in a repair run. Run every command from the repository root. Read these completely first:

1. `tools/possibilities/README.md`, especially "Rules every writer and repairer follows".
2. `docs/style/copy-style-guide.md`, especially "Kinds of fixes".
3. `tools/possibilities/config/feature-patterns.md` and `config/style-guide.md`.
4. The `repair-todo.md` file in your run folder. Do every item in it.

How to handle each kind of to-do item:

- **Unsourced detail** (a number, date, name or effect that isn't in the cited record):
  - If you can confirm it, open the exemplar's `url` or another reliable page, add the detail to that record, and set `accessed` to today.
  - Otherwise, remove it or reword it so the copy claims only what the record supports.
  - A speculative fix that names an institution either cites a verified exemplar or drops the name.
- **Honesty exclusion from the judges**:
  - State what actually happened, at its real scope.
  - Present contested policies as proposals people disagree about.
- **Learn about others, or not an action**: rewrite the fix as what the reader does, keeping the example in the text, and choose the kind that fits. For example, "Learn how one city became a large landlord" becomes "Ask candidates whether your city should build and own homes, the way Vienna does".
- **Dream not an outcome**: rewrite the dream title and line as the outcome the person wants. "Telling my legislators I want limits on addictive app design" becomes "Limits on addictive app design in my state". Keep the fixes underneath.
- **Join or start**: split the fix in two.
  - A `group` fix for joining keeps the original ID.
  - A `new-group` fix for starting one gets the original ID plus `-start`.
  - Each gets its own title, text and first step.
- **Founder feature idea**: add it as a `feature` fix on the named card.
  - Give it a capability title, a pitch that starts with a verb, a first step people can take today (or "Tell us you'd use this"), `firstStepMinutes` and `who`.
  - Cite a verified exemplar from the run, or set `speculative: true` with a rationale.
  - Its ID is `<card-id>-<short-slug>`.
- **Feature-pattern pass**: check each card's fixes against the patterns. Add a feature only where a pattern clearly fits and the card doesn't already have one like it. A card that needs nothing gets nothing.

Rules:
- A card has at most 5 fixes. If one would go over, drop its weakest non-feature fix and say which one you dropped.
- Keep every card ID and every existing fix ID. Change only what the to-do list names.
- Run `validate <run>` and `lint <run>` and repeat until both report zero issues.
- Touch only files inside your run folder. Don't judge anything.

Reply with: the count of changes for each kind of to-do item, any fixes you dropped, two before-and-after examples, and the lint result.

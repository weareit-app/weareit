# Pitch brief: rewrite feature fixes

Run every command from the repository root. The helper is `python3 tools/possibilities/cards.py`. Read `docs/style/copy-style-guide.md` first, especially the "Kinds of fixes" section.

In each run you are given, edit `cards.json`. Change only fixes where `"kind": "feature"`, and only their `title` and `whatChanges`.

- **whatChanges** becomes a short feature pitch: what it does for the person, verb first, with no "It could…", "It would…" or "We'd like It to…". The Feature tag already says It would build this.
  - Before: "It could draw on the public worker co-op directory and federal data on employee stock plans to show you employee-owned places near you. That gives you somewhere to apply, or a model to point to."
  - After: "Shows employee-owned workplaces near you, drawn from the public worker co-op directory and federal data on employee stock plans, so you have somewhere to apply or a model to point to."
- **title** says what you'd get or be able to do, without "with It" or "It". For example, "See employee-owned workplaces near you".
- **Keep every fact, number and name exactly as it is.** Add no new details or claims. Keep any one plain limit the text already has. Don't start a sentence with "It".
- Present tense here describes the intended behavior of something It would build. The status label marks it as not built.
- Keep every other field, card and fix unchanged, IDs included.

After editing each run, run `validate <run>` and `lint <run>`. Repeat until both pass with zero issues. Touch no other files, don't commit, and don't judge anything.

Reply with the number of feature fixes rewritten per run, whether lint passed, and two before-and-after examples you think show the change best.

# Writer brief: possibility cards for one pain

You are the writer for one pain. Run every command from the repository root. Read these completely first:

1. `tools/possibilities/README.md`, especially "Rules every writer and repairer follows".
2. `docs/style/copy-style-guide.md`, the voice and every rule.
3. `tools/possibilities/config/rubric.md`, which says how judges will score the cards.
4. `tools/possibilities/config/style-guide.md` and `config/feature-patterns.md`, which say what the founder loved and killed, and which features writers tend to miss.
5. One reference run, for format only: the newest run under `docs/research/possibilities/runs/poor-sleep/`. Don't copy its content.

Then write cards for your pain:

1. Run `python3 tools/possibilities/cards.py new-run <pain-id>` and use the path it prints.
2. **Examples.** Search the web, then open pages. Collect 10–20 real things that people, groups, firms or governments have done, spanning at least 4 lenses. Record each one in `exemplars.json`, following the sourcing rule in the README. Today's date goes in `accessed`. If a page blocks you, mark the exemplar `verified: false` and try another source for the same fact. Write the limits honestly.
3. **Basics.** List the obvious practical things people commonly do or buy for this pain. Leaving them out is a failure.
4. **Features.** Work out what It could build: helping people check their situation, track it, figure out what help they need, find providers, organize with neighbors, contact officials or push for laws. Base each feature on public data or existing tools where you can, and record those as exemplars.
5. **Cards.** Write about 14 cards in `cards.json`, meeting the README's coverage rules and the data shape in `tools/possibilities/data-model.md`. Set `provenance` to `{sourceId: "generator-run-<runId>", locator: "cards.json#<card-id>", evidenceType: "ai_generated_from_exemplars", rights: "CC-BY-SA-4.0", reviewStatus: "unreviewed"}`. Put your reasoning in `writerNotes`; judges never see it.
6. Run `validate <run>` and `lint <run>`. Fix every issue and repeat until both report zero issues.
7. Run `finish-run <run> --searches N --pages N` with your real counts.

Touch only files inside your new run folder. Don't judge your own cards.

Reply in 4 lines: the run path, exemplars (verified out of total), the number of cards, and the lint result.

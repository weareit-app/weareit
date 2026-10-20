# Kind brief, version 2

Classify every fix in the input files you're given. Each fix is something a person could do about a pain. Ideas It could build are not in these files; don't add any. Choose exactly one kind:

- **task**: something done once and finished. This includes one-time changes that keep working afterward. Examples: "Set your screen to grayscale", "Put up blackout curtains", "Move the apps off your home screen", "Turn off work notifications after 6", "Ask your city council to fund lawyers for tenants", "Call 988".
- **schedule**: a recurring commitment on the calendar. Examples: "Set up a weekly call or walk with one friend", "Visit a retirement home on the same day each week", "Start a regular lunch with coworkers", "Go to the same class each week".
- **habit**: a behavior triggered by a cue and repeated without planning. Use this rarely. Example: "When you reach for your phone in bed, put it face down".
- **practice**: a skill you get better at over time, usually in how you talk, listen or respond. Examples: "Ask what they believe instead of assuming", "Ask about their experience, then share yours", "Promise to come back to it within a day". Every practice also needs `featureIdea`: one plain, verb-first sentence describing a coaching feature It could build to help with this skill. For example: "Helps you plan the question you want to ask before a hard conversation, then checks in afterward on how it went."
- **project**: a bounded effort over days or weeks, with several steps and an end. Examples: "Organize a block party", "Help run a monthly repair night", "Run a four-day-week trial at your workplace", "Organize a campaign for a local rule".
- **group**: join a group that already exists. Example: "Join your building's tenant association".
- **new-group**: start a group that doesn't exist yet. Example: "Start a tenant association in your building".

Also flag, without fixing anything:

- `"combined": true` if the fix bundles two separate ideas that should be split;
- `"learnOnly": true` if the fix only asks the reader to learn, read or know something rather than do something.

Write one JSON object per input file:

```
{"<fixId>": {"kind": "...", "featureIdea": "..." (practice only), "combined": true (only if so), "learnOnly": true (only if so)}, ...}
```

Cover every fixId in the input. Save it as `out2-<pain>.json` in the same folder as the input, and check that it parses. Read only this brief and your input files. Edit nothing else.

Reply with counts per kind for each pain, the number of combined and learnOnly flags, and the two featureIdeas you think are strongest.
